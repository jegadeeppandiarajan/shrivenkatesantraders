const express = require("express");
const {
  getDashboardAnalytics,
  getPaymentTransactions,
  getCustomers,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/dashboard", getDashboardAnalytics);
router.get("/payments", getPaymentTransactions);
router.get("/customers", getCustomers);

// User management routes
router.get("/users", getAllUsers);
router.put("/users/:userId/role", updateUserRole);
router.put("/users/:userId/status", updateUserStatus);
router.delete("/users/:userId", deleteUser);

module.exports = router;
