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

  // Add avatar if provided
  if (req.body.avatar !== undefined) {
    updates.avatar = req.body.avatar;
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
