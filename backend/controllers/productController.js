const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const { notifyUsersAboutNewProduct } = require("../services/emailService");

const buildFilters = (query) => {
  const filters = { isActive: true };

  if (query.category) {
    filters.category = { $in: query.category.split(",") };
  }

  if (query.minPrice || query.maxPrice) {
    filters.price = {};
    if (query.minPrice) filters.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filters.price.$lte = Number(query.maxPrice);
  }

  if (query.search) {
    filters.$text = { $search: query.search };
  }

  if (query.isFeatured) {
    filters.isFeatured = query.isFeatured === "true";
  }

  return filters;
};

exports.getProducts = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const filters = buildFilters(req.query);
  const sort = req.query.sort || "-createdAt";

  const [products, total] = await Promise.all([
    Product.find(filters).sort(sort).skip(skip).limit(limit),
    Product.countDocuments(filters),
  ]);

  res.status(200).json({
    success: true,
    data: products,
    pagination: {
      page,
      limit,
      total,
      hasMore: skip + products.length < total,
    },
  });
});

exports.getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({ success: true, data: product });
});

exports.createProduct = asyncHandler(async (req, res) => {
  if (req.files && req.files.length) {
    req.body.images = req.files.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      alt: req.body.name,
      isPrimary: index === 0,
    }));
  }

  if (req.body.specifications && typeof req.body.specifications === "string") {
    req.body.specifications = JSON.parse(req.body.specifications);
  }

  const { notifyUsers, ...productData } = req.body;

  const product = await Product.create({
    ...productData,
    createdBy: req.user?._id,
  });

  // Send email notifications if requested
  if (notifyUsers === true || notifyUsers === "true") {
    // Fire and forget - don't wait for emails to complete
    notifyUsersAboutNewProduct(product)
      .then((result) => {
        console.log("Email notification result:", result);
      })
      .catch((err) => {
        console.error("Email notification error:", err);
      });
  }

  res.status(201).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // Handle images
  if (req.files && req.files.length) {
    req.body.images = req.files.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      alt: req.body.name || product.name,
      isPrimary: index === 0,
    }));
  } else if (req.body.keepExistingImages === "true") {
    // Keep existing images if no new ones uploaded
    delete req.body.images;
  }

  // Clean up the keepExistingImages flag
  delete req.body.keepExistingImages;

  if (req.body.specifications && typeof req.body.specifications === "string") {
    req.body.specifications = JSON.parse(req.body.specifications);
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  await product.deleteOne();

  res.status(200).json({ success: true, message: "Product deleted" });
});

exports.getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .sort("-createdAt")
    .limit(8);

  res.status(200).json({ success: true, data: products });
});

exports.getLowStockProducts = asyncHandler(async (req, res) => {
  const products = await Product.getLowStockProducts();
  res.status(200).json({ success: true, data: products });
});

exports.recordProductView = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } });
  res.status(204).end();
});

// Add a review to a product
exports.addReview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;

  const product = await Product.findById(id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // Check if user already reviewed this product
  const alreadyReviewed = product.reviews.find(
    (review) => review.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    return res.status(400).json({
      success: false,
      message: "You have already reviewed this product",
    });
  }

  const review = {
    user: req.user._id,
    rating: Number(rating),
    comment,
    createdAt: new Date(),
  };

  product.reviews.push(review);

  // Update ratings
  const totalRatings = product.reviews.reduce(
    (acc, item) => acc + item.rating,
    0
  );
  product.ratings.average = totalRatings / product.reviews.length;
  product.ratings.count = product.reviews.length;

  await product.save();

  // Populate user details in the response
  await product.populate("reviews.user", "name avatar");

  res.status(201).json({ success: true, data: product });
});

// Get reviews for a product
exports.getReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .select("reviews ratings")
    .populate("reviews.user", "name avatar");

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  res.status(200).json({
    success: true,
    data: {
      reviews: product.reviews,
      ratings: product.ratings,
    },
  });
});

// Delete a review
exports.deleteReview = asyncHandler(async (req, res) => {
  const { id, reviewId } = req.params;

  const product = await Product.findById(id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  const reviewIndex = product.reviews.findIndex(
    (review) => review._id.toString() === reviewId
  );

  if (reviewIndex === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Review not found" });
  }

  // Only allow review owner or admin to delete
  if (
    product.reviews[reviewIndex].user.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this review",
    });
  }

  product.reviews.splice(reviewIndex, 1);

  // Update ratings
  if (product.reviews.length > 0) {
    const totalRatings = product.reviews.reduce(
      (acc, item) => acc + item.rating,
      0
    );
    product.ratings.average = totalRatings / product.reviews.length;
    product.ratings.count = product.reviews.length;
  } else {
    product.ratings.average = 0;
    product.ratings.count = 0;
  }

  await product.save();

  res.status(200).json({ success: true, message: "Review deleted" });
});
