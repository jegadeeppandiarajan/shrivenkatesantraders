const express = require("express");
const {
  createCheckoutSession,
  handleStripeWebhook,
  verifySession,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/create-checkout-session", protect, createCheckoutSession);
router.get("/verify-session/:sessionId", protect, verifySession);
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

module.exports = router;
