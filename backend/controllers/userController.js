const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Order = require("../models/Order");
const Product = require("../models/Product");

exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-__v");
  res.status(200).json({ success: true, data: user });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const updates = {
    name: req.body.name,
    phone: req.body.phone,
    address: req.body.address,
  };

  // Add customAvatar if provided (user-selected avatar)
  if (req.body.avatar !== undefined) {
    updates.customAvatar = req.body.avatar;
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: user });
});

exports.getOrderHistory = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort("-createdAt");
  res.status(200).json({ success: true, data: orders });
});

exports.toggleWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  const user = await User.findById(req.user._id);
  const alreadyInWishlist = user.wishlist
    .map((id) => id.toString())
    .includes(productId);

  if (alreadyInWishlist) {
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
  } else {
    user.wishlist.push(productId);
  }

  await user.save();
  await user.populate("wishlist");

  res.status(200).json({ success: true, data: user.wishlist });
});

exports.getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.status(200).json({ success: true, data: user.wishlist });
});

// Get user analytics including loyalty tier and discount
exports.getUserAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Get all orders for the user
  const orders = await Order.find({ user: userId }).populate("items.product");

  // Calculate total spent
  const totalSpent = orders.reduce(
    (sum, order) => sum + (order.totalAmount || 0),
    0
  );

  // Calculate loyalty tier and discount
  let tier = "Bronze";
  let discount = 0;
  let nextTierSpend = 10000;

  if (totalSpent >= 50000) {
    tier = "Platinum";
    discount = 15;
    nextTierSpend = null;
  } else if (totalSpent >= 25000) {
    tier = "Gold";
    discount = 10;
    nextTierSpend = 50000;
  } else if (totalSpent >= 10000) {
    tier = "Silver";
    discount = 5;
    nextTierSpend = 25000;
  }

  // Calculate category breakdown
  const categoryCount = {};
  orders.forEach((order) => {
    order.items?.forEach((item) => {
      const category = item.product?.category || "Other";
      categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
    });
  });

  // Calculate monthly spending (last 6 months)
  const monthlySpending = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = month.toLocaleDateString("en-US", { month: "short" });
    monthlySpending[monthKey] = 0;
  }

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const monthKey = orderDate.toLocaleDateString("en-US", { month: "short" });
    if (monthlySpending.hasOwnProperty(monthKey)) {
      monthlySpending[monthKey] += order.totalAmount || 0;
    }
  });

  res.status(200).json({
    success: true,
    data: {
      totalSpent,
      totalOrders: orders.length,
      deliveredOrders: orders.filter((o) => o.status === "delivered").length,
      avgOrderValue: orders.length > 0 ? totalSpent / orders.length : 0,
      tier,
      discount,
      nextTierSpend,
      categoryBreakdown: categoryCount,
      monthlySpending,
    },
  });
});
