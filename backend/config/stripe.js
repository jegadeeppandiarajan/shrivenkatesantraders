const Stripe = require("stripe");

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

// Check if Stripe is properly configured
const isStripeConfigured =
  stripeSecretKey &&
  stripeSecretKey !== "sk_test_your_stripe_secret_key_here" &&
  stripeSecretKey.startsWith("sk_");

let stripe = null;

if (isStripeConfigured) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: "2023-10-16",
  });
  console.log("✅ Stripe configured successfully");
} else {
  console.warn(
    "⚠️  Stripe is not configured. Payment features will be disabled."
  );
  console.warn("   Please add your STRIPE_SECRET_KEY to .env file");
}

module.exports = stripe;
