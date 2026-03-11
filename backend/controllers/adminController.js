const asyncHandler = require("express-async-handler");
const Order = require("../models/Order");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const User = require("../models/User");

const getDateRange = (days) => {
  const now = new Date();
  const start = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return { start, end: now };
};

const buildSalesPipeline = (start) => [
  { $match: { createdAt: { $gte: start } } },
  {
    $group: {
      _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      revenue: { $sum: "$totalAmount" },
      orders: { $sum: 1 },
    },
  },
  { $sort: { _id: 1 } },
];

exports.getDashboardAnalytics = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const { start: revenueStart } = getDateRange(days);
  const { start: last7Days } = getDateRange(7);
  const { start: lastMonth } = getDateRange(60);

  const [
    totals,
    revenueSeries,
    bestSellers,
    lowStock,
    paymentsToday,
    orderStats,
    recentOrders,
    topCustomers,
  ] = await Promise.all([
    Promise.all([
      Order.countDocuments(),
      Order.aggregate([
        { $match: { paymentStatus: "paid" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
      Product.countDocuments({ isActive: true }),
      User.countDocuments(),
    ]),
    Order.aggregate(buildSalesPipeline(revenueStart)),
    Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          quantity: { $sum: "$items.quantity" },
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
    ]),
    Product.getLowStockProducts(),
    Payment.aggregate([
      { $match: { createdAt: { $gte: last7Days } } },
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 },
          amount: { $sum: "$amount" },
        },
      },
    ]),
    // Order status breakdown
    Order.aggregate([
      {
        $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
        },
      },
    ]),
    // Recent orders
    Order.find()
      .sort("-createdAt")
      .limit(5)
      .populate("user", "name email")
      .select("orderNumber totalAmount orderStatus paymentStatus createdAt"),
    // Top customers by spending
    Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      {
        $group: {
          _id: "$user",
          totalSpent: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: 1,
          name: "$userInfo.name",
          email: "$userInfo.email",
          totalSpent: 1,
          orderCount: 1,
        },
      },
    ]),
  ]);

  const [[ordersCount, revenueAgg, productsCount, customersCount]] = [totals];

  // Calculate order status counts
  const orderStatusCounts = {
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  };
  orderStats.forEach((stat) => {
    if (orderStatusCounts.hasOwnProperty(stat._id)) {
      orderStatusCounts[stat._id] = stat.count;
    }
  });

  res.status(200).json({
    success: true,
    metrics: {
      totalOrders: ordersCount,
      totalRevenue: revenueAgg[0]?.total || 0,
      totalProducts: productsCount,
      totalCustomers: customersCount,
    },
    orderStatusCounts,
    revenueSeries,
    bestSellers,
    lowStock,
    paymentsSummary: paymentsToday,
    recentOrders,
    topCustomers,
  });
});

exports.getPaymentTransactions = asyncHandler(async (req, res) => {
  const payments = await Payment.find()
    .populate("user", "name email")
    .populate("order", "orderNumber totalAmount")
    .sort("-createdAt")
    .limit(50);

  res.status(200).json({ success: true, data: payments });
});

exports.getCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find()
    .sort("-createdAt")
    .limit(20)
    .select("name email role lastLogin");
  res.status(200).json({ success: true, data: customers });
});

// Get all users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .sort("-createdAt")
    .select("name email role isActive createdAt lastLogin");
  res.status(200).json({ success: true, data: users });
});

// Update user role
exports.updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { userId } = req.params;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ success: false, message: "Invalid role" });
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true },
  ).select("name email role isActive");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({ success: true, data: user });
});

// Update user status (activate/deactivate)
exports.updateUserStatus = asyncHandler(async (req, res) => {
  const { isActive } = req.body;
  const { userId } = req.params;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true },
  ).select("name email role isActive");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({ success: true, data: user });
});

// Delete user
exports.deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Prevent deleting yourself
  if (user._id.toString() === req.user._id.toString()) {
    return res
      .status(400)
      .json({ success: false, message: "Cannot delete your own account" });
  }

  await User.findByIdAndDelete(userId);

  res.status(200).json({ success: true, message: "User deleted successfully" });
});
