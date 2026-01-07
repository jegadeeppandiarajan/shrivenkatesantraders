const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  // Enhanced timeout and connection settings
  connectionTimeout: parseInt(process.env.SMTP_TIMEOUT) || 10000,
  socketTimeout: parseInt(process.env.SMTP_TIMEOUT) || 10000,
  pool: {
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 2000,
    rateLimit: 5,
  },
});

// Verify connection configuration
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter.verify(function (error, success) {
    if (error) {
      console.log("❌ Email service error:", error.message);
      console.log("   Please check your SMTP settings in .env file");
      console.log("   SMTP Host:", process.env.SMTP_HOST);
      console.log("   SMTP Port:", process.env.SMTP_PORT);
      console.log(
        "   SMTP User:",
        process.env.SMTP_USER?.substring(0, 5) + "***"
      );
    } else {
      console.log("✅ Email service is ready to send messages");
    }
  });
} else {
  console.log(
    "⚠️ Email service not configured. Set SMTP_USER and SMTP_PASS in .env"
  );
}

module.exports = transporter;
