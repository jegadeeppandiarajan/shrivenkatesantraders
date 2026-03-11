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
  let allImages = [];

  if (req.files && req.files.length) {
    allImages = req.files.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      alt: req.body.name,
      isPrimary: index === 0,
    }));
  }

  // Handle URL-based images
  if (req.body.imageUrls) {
    try {
      const urls = JSON.parse(req.body.imageUrls);
      if (Array.isArray(urls)) {
        const urlImages = urls.map((url, index) => ({
          url,
          alt: req.body.name,
          isPrimary: allImages.length === 0 && index === 0,
        }));
        allImages = [...allImages, ...urlImages];
      }
    } catch (e) {
      console.error("Error parsing imageUrls:", e);
    }
    delete req.body.imageUrls;
  }

  if (allImages.length > 0) {
    // Ensure first image is primary
    allImages = allImages.map((img, i) => ({ ...img, isPrimary: i === 0 }));
    req.body.images = allImages;
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
  console.log("=== updateProduct called ===");
  console.log("req.files:", req.files?.length || 0, "files");
  console.log("req.body keys:", Object.keys(req.body));

  let product = await Product.findById(req.params.id);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  // Handle images - combine existing images with newly uploaded ones
  let finalImages = [];

  // Parse existing images from request (images to keep)
  if (req.body.existingImages) {
    try {
      const existingImages = JSON.parse(req.body.existingImages);
      console.log("Existing images to keep:", existingImages?.length || 0);
      if (Array.isArray(existingImages)) {
        finalImages = [...existingImages];
      }
    } catch (e) {
      console.error("Error parsing existing images:", e);
    }
  }

  // Add newly uploaded images
  if (req.files && req.files.length) {
    console.log(
      "New files uploaded:",
      req.files.map((f) => f.filename),
    );
    const newImages = req.files.map((file, index) => ({
      url: `/uploads/products/${file.filename}`,
      alt: req.body.name || product.name,
      isPrimary: finalImages.length === 0 && index === 0,
    }));
    finalImages = [...finalImages, ...newImages];
  }

  // Add URL-based images
  if (req.body.imageUrls) {
    try {
      const urls = JSON.parse(req.body.imageUrls);
      if (Array.isArray(urls)) {
        const urlImages = urls.map((url, index) => ({
          url,
          alt: req.body.name || product.name,
          isPrimary: finalImages.length === 0 && index === 0,
        }));
        finalImages = [...finalImages, ...urlImages];
      }
    } catch (e) {
      console.error("Error parsing imageUrls:", e);
    }
    delete req.body.imageUrls;
  }

  console.log("Final images count:", finalImages.length);

  // Set images if we have any (new or existing)
  if (finalImages.length > 0) {
    // Ensure first image is marked as primary
    finalImages = finalImages.map((img, index) => ({
      ...img,
      isPrimary: index === 0,
    }));
    req.body.images = finalImages;
  } else if (finalImages.length === 0 && !req.files?.length) {
    // No images provided at all, keep existing product images
    delete req.body.images;
  }

  // Clean up the existingImages field from body
  delete req.body.existingImages;
  delete req.body.keepExistingImages;

  if (req.body.specifications && typeof req.body.specifications === "string") {
    req.body.specifications = JSON.parse(req.body.specifications);
  }

  // Convert string values to proper types
  if (req.body.price) req.body.price = Number(req.body.price);
  if (req.body.stock) req.body.stock = Number(req.body.stock);
  if (req.body.featured === "true") req.body.featured = true;
  if (req.body.featured === "false") req.body.featured = false;

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
    (review) => review.user.toString() === req.user._id.toString(),
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
    0,
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
    (review) => review._id.toString() === reviewId,
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
      0,
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
