const express = require("express");
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderTimeline,
} = require("../controllers/orderController");
const { protect, adminOnly } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validators");

const router = express.Router();

router.use(protect);

router.get("/admin", adminOnly, getAllOrders);
router.post("/", validateOrder, createOrder);
router.get("/", getMyOrders);
router.put("/:id/status", adminOnly, updateOrderStatus);
router.post("/:id/cancel", cancelOrder);
router.get("/:id/timeline", getOrderTimeline);
router.get("/:id", getOrderById);

module.exports = router;
