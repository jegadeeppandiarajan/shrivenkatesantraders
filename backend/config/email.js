const nodemailer = require("nodemailer");
const { Resend } = require("resend");

// Check if Resend API key is available (preferred method - bypasses ISP blocks)
const resendApiKey = process.env.RESEND_API_KEY;
const useResend = !!resendApiKey;

let resend = null;
let transporter = null;

if (useResend) {
  // Use Resend API (HTTP-based, never blocked by ISPs)
  resend = new Resend(resendApiKey);
  console.log("✅ Email service configured with Resend API");
} else {
  // Fallback to SMTP (may be blocked by some ISPs)
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
    tls: {
      rejectUnauthorized: false,
      minVersion: "TLSv1.2",
    },
  });

  // Verify SMTP connection
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
        console.log(
          "\n   💡 TIP: Your ISP may be blocking SMTP. Use Resend API instead:"
        );
        console.log("   1. Sign up at https://resend.com");
        console.log("   2. Get your API key");
        console.log("   3. Add RESEND_API_KEY=re_xxxxx to your .env file\n");
      } else {
        console.log("✅ Email service is ready (SMTP)");
      }
    });
  } else {
    console.log(
      "⚠️ Email service not configured. Set SMTP credentials or RESEND_API_KEY in .env"
    );
  }
}

// Unified send function that works with both Resend and SMTP
const sendMail = async (options) => {
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const fromName = process.env.APP_NAME || "Shri Venkatesan Traders";

  if (useResend) {
    // Send via Resend API
    try {
      const { data, error } = await resend.emails.send({
        from: `${fromName} <${fromEmail}>`,
        to: Array.isArray(options.to) ? options.to : [options.to],
        subject: options.subject,
        html: options.html || options.text,
        text: options.text,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(`✅ Email sent via Resend to: ${options.to}`);
      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error("❌ Resend error:", error.message);
      throw error;
    }
  } else if (transporter) {
    // Send via SMTP
    try {
      const info = await transporter.sendMail({
        from: `"${fromName}" <${process.env.SMTP_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      console.log(`✅ Email sent via SMTP to: ${options.to}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error("❌ SMTP error:", error.message);
      throw error;
    }
  } else {
    console.log("⚠️ Email not sent - no email service configured");
    return { success: false, error: "Email service not configured" };
  }
};

// Export object with all email functions
const emailModule = {
  transporter,
  sendMail,
  useResend,
  resend,
};

module.exports = emailModule;
