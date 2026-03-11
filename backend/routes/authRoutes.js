const express = require("express");
const passport = require("passport");
const {
  register,
  login,
  adminLogin,
  googleCallback,
  getMe,
  logout,
  issueTokenForClient,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Email/Password Authentication
router.post("/register", register);
router.post("/login", login);
router.post("/admin/login", adminLogin);

// Google OAuth
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`,
  }),
  googleCallback,
);

// Protected routes
router.get("/me", protect, getMe);
router.post("/exchange-token", issueTokenForClient);

// Logout doesn't require authentication - allows logout even with expired tokens
router.post("/logout", logout);

module.exports = router;
