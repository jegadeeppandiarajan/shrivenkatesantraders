const asyncHandler = require("express-async-handler");
const Cart = require("../models/Cart");
const Product = require("../models/Product");

const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

exports.getCart = asyncHandler(async (req, res) => {
  const cart = await findOrCreateCart(req.user._id);
  res.status(200).json({ success: true, data: cart });
});

exports.addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  if (product.stock < quantity) {
    return res
      .status(400)
      .json({ success: false, message: "Insufficient stock" });
  }

  const cart = await findOrCreateCart(req.user._id);
  await cart.addItem(productId, quantity, product.price);
  await cart.populate("items.product");

  res.status(200).json({ success: true, data: cart });
});

exports.updateItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const product = await Product.findById(productId);

  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  if (quantity > product.stock) {
    return res
      .status(400)
      .json({ success: false, message: "Insufficient stock" });
  }

  const cart = await findOrCreateCart(req.user._id);
  await cart.updateItemQuantity(productId, quantity);
  await cart.populate("items.product");

  res.status(200).json({ success: true, data: cart });
});

exports.removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await findOrCreateCart(req.user._id);
  await cart.removeItem(productId);
  await cart.populate("items.product");

  res.status(200).json({ success: true, data: cart });
});

exports.clearCart = asyncHandler(async (req, res) => {
  const cart = await findOrCreateCart(req.user._id);
  await cart.clearCart();

  res.status(200).json({ success: true, data: cart });
});
