const express = require("express");
const {
  getProfile,
  updateProfile,
  getOrderHistory,
  toggleWishlist,
  getWishlist,
  getUserAnalytics,
} = require("../controllers/userController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/orders", getOrderHistory);
router.get("/wishlist", getWishlist);
router.post("/wishlist", toggleWishlist);
router.get("/analytics", getUserAnalytics);

module.exports = router;
