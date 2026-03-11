const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const { emitOrderStatus } = require("../sockets/orderSocket");
const {
  sendOrderStatusUpdateEmail,
  sendOrderConfirmationEmail,
} = require("../services/emailService");

const buildOrderItems = async (items = []) => {
  if (!Array.isArray(items) || !items.length) {
    throw new Error("Order must include at least one product");
  }

  const formattedItems = [];
  let itemsTotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId || item.product);
    if (!product) {
      throw new Error("One or more products were not found");
    }

    if (!product.isActive) {
      throw new Error(`${product.name} is not available at the moment`);
    }

    if (product.stock < item.quantity) {
      throw new Error(`${product.name} has insufficient stock`);
    }

    formattedItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity: item.quantity,
      image: product?.images?.[0]?.url || "",
    });

    itemsTotal += product.price * item.quantity;
  }

  return { formattedItems, itemsTotal };
};

exports.createOrder = asyncHandler(async (req, res) => {
  const {
    items,
    shippingAddress,
    billingAddress,
    shippingCost = 0,
    tax = 0,
    discount = 0,
    paymentMethod = "stripe",
    notes,
  } = req.body;

  const { formattedItems, itemsTotal } = await buildOrderItems(items);

  const totalAmount = itemsTotal + shippingCost + tax - discount;

  const order = await Order.create({
    user: req.user._id,
    items: formattedItems,
    shippingAddress,
    billingAddress: billingAddress || shippingAddress,
    itemsTotal,
    shippingCost,
    tax,
    discount,
    totalAmount,
    paymentMethod,
    notes,
  });

  res.status(201).json({ success: true, data: order });
});

exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort("-createdAt")
    .populate("items.product");

  res.status(200).json({ success: true, data: orders });
});

exports.getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product");

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (
    req.user.role !== "admin" &&
    order.user._id.toString() !== req.user._id.toString()
  ) {
    return res
      .status(403)
      .json({ success: false, message: "You cannot view this order" });
  }

  res.status(200).json({ success: true, data: order });
});

exports.getAllOrders = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const status = req.query.status;

  const filters = {};
  if (status) filters.orderStatus = status;

  const [orders, total] = await Promise.all([
    Order.find(filters)
      .populate("user", "name email")
      .sort("-createdAt")
      .skip(skip)
      .limit(limit),
    Order.countDocuments(filters),
  ]);

  res.status(200).json({ success: true, data: orders, total });
});

exports.updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note, trackingNumber, courier, estimatedDelivery } = req.body;
  const allowedStatuses = [
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "out_for_delivery",
    "delivered",
    "cancelled",
    "returned",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const order = await Order.findById(req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courier) order.courier = courier;
  if (estimatedDelivery) order.estimatedDelivery = estimatedDelivery;

  order.statusHistory.push({
    status,
    note,
    updatedBy: req.user._id,
  });

  await order.save();

  emitOrderStatus(order._id.toString(), {
    status: order.orderStatus,
    history: order.statusHistory,
  });

  // Send status update email
  await sendOrderStatusUpdateEmail(order, status, note);

  // When order is confirmed, also send the bill/receipt (invoice) with tracking info
  if (status === "confirmed") {
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.product", "name category price");
    if (populatedOrder && populatedOrder.user && populatedOrder.user.email) {
      await sendOrderConfirmationEmail(populatedOrder);
    }
  }

  res.status(200).json({ success: true, data: order });
});

exports.cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.user.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ success: false, message: "You cannot cancel this order" });
  }

  if (["shipped", "delivered"].includes(order.orderStatus)) {
    return res
      .status(400)
      .json({ success: false, message: "Order already shipped" });
  }

  order.orderStatus = "cancelled";
  order.statusHistory.push({
    status: "cancelled",
    note: "Cancelled by user",
    updatedBy: req.user._id,
  });
  await order.save();

  emitOrderStatus(order._id.toString(), {
    status: order.orderStatus,
    history: order.statusHistory,
  });

  res.status(200).json({ success: true, data: order });
});

exports.getOrderTimeline = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).select(
    "statusHistory orderStatus user",
  );

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (
    req.user.role !== "admin" &&
    order.user?.toString() !== req.user._id.toString()
  ) {
    return res.status(403).json({ success: false, message: "Unauthorized" });
  }

  res.status(200).json({ success: true, data: order.statusHistory });
});

// Send invoice email to customer
exports.sendInvoiceEmail = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate("user", "name email")
    .populate("items.product", "name category price");

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (!order.user?.email) {
    return res
      .status(400)
      .json({ success: false, message: "Customer email not found" });
  }

  try {
    // Create order object with required fields for email
    const orderForEmail = {
      _id: order._id,
      orderNumber:
        order.orderNumber || order._id.toString().slice(-8).toUpperCase(),
      user: order.user,
      items: order.items.map((item) => ({
        name: item.product?.name || item.name,
        price: item.price || item.product?.price,
        quantity: item.quantity,
      })),
      totalAmount: order.totalAmount,
      shippingAddress: order.shippingAddress,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      shippingCharge: order.shippingCost || 0,
      createdAt: order.createdAt,
    };

    const emailResult = await sendOrderConfirmationEmail(orderForEmail);

    if (emailResult.success) {
      console.log(
        `📧 Invoice email sent to ${order.user.email} for order ${order._id}`,
      );
      res.status(200).json({
        success: true,
        message: `Invoice sent to ${order.user.email}`,
      });
    } else {
      console.error(`❌ Failed to send invoice: ${emailResult.error}`);
      res.status(500).json({
        success: false,
        message: emailResult.error || "Failed to send invoice email",
      });
    }
  } catch (error) {
    console.error("❌ Error sending invoice email:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send invoice email",
    });
  }
});
