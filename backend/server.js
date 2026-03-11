const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const path = require("path");
const http = require("http");

// Load environment variables
dotenv.config();

// Database connection
const connectDB = require("./config/database");

// Passport configuration
require("./config/passport");

// Import routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

// Import error handler
const errorHandler = require("./middleware/errorHandler");
const { initSocket } = require("./sockets/orderSocket");

// Initialize express app
const app = express();
const server = http.createServer(app);

// Connect to database
connectDB();

// Security middleware
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);

// CORS configuration
app.use(
  cors({
    origin:
      process.env.CLIENT_URL || "https://shrivenkatesantraders.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parser - JSON (skip Stripe webhook)
app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    return next();
  }
  return express.json({ limit: "10mb" })(req, res, next);
});

app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    return next();
  }
  return express.urlencoded({ extended: true, limit: "10mb" })(req, res, next);
});

// Cookie parser
app.use(cookieParser());

// Logging middleware (development only)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Initialize passport
app.use(passport.initialize());

// Static files for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Shri Venkatesan Traders API is running",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Error handler middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

initSocket(server);

server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════════╗
  ║                                                            ║
  ║   🏭 Shri Venkatesan Traders - Pipes & Motors             ║
  ║                                                            ║
  ║   Server running in ${process.env.NODE_ENV} mode                    ║
  ║   Port: ${PORT}                                              ║
  ║   API: ${process.env.BACKEND_URL || "http://localhost:" + PORT}/api         ║
  ║                                                            ║
  ╚════════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.error(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});

module.exports = app;
