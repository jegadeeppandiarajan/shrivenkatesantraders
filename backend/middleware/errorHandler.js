const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for development
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered for ${field}`;
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = { message: messages.join(", "), statusCode: 400 };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    error = { message: "Invalid token", statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    error = { message: "Token expired", statusCode: 401 };
  }

  // Multer file upload errors
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      error = {
        message: "File size too large. Maximum 5MB allowed.",
        statusCode: 400,
      };
    } else if (err.code === "LIMIT_FILE_COUNT") {
      error = { message: "Too many files uploaded", statusCode: 400 };
    } else {
      error = { message: err.message, statusCode: 400 };
    }
  }

  // Stripe errors
  if (err.type && err.type.startsWith("Stripe")) {
    error = { message: err.message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || "Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
