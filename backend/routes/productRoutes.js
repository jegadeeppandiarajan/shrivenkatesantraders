const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getFeaturedProducts,
  getLowStockProducts,
  recordProductView,
  addReview,
  getReviews,
  deleteReview,
} = require("../controllers/productController");
const { protect, adminOnly, optionalAuth } = require("../middleware/auth");
const { validateProduct } = require("../middleware/validators");
const upload = require("../config/multer");

const router = express.Router();

router.get("/", optionalAuth, getProducts);
router.get("/featured", getFeaturedProducts);
router.get("/low-stock", protect, adminOnly, getLowStockProducts);
router.post("/:id/view", recordProductView);
router.get("/:id", optionalAuth, getProductById);

// Review routes
router.get("/:id/reviews", getReviews);
router.post("/:id/reviews", protect, addReview);
router.delete("/:id/reviews/:reviewId", protect, deleteReview);

router.post(
  "/",
  protect,
  adminOnly,
  upload.array("images", 5),
  validateProduct,
  createProduct
);

router.put(
  "/:id",
  protect,
  adminOnly,
  upload.array("images", 5),
  updateProduct
);

router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
