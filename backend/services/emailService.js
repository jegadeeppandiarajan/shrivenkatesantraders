const transporter = require("../config/email");
const User = require("../models/User");

/**
 * Send email to a single recipient
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    // Check if email service is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn(
        "⚠️ Email service not configured. SMTP_USER or SMTP_PASS missing."
      );
      return { success: false, error: "Email service not configured" };
    }

    const mailOptions = {
      from: `"${process.env.APP_NAME || "Shri Venkatesan Traders"}" <${
        process.env.SMTP_USER
      }>`,
      to,
      subject,
      text,
      html,
    };

    console.log(`📧 Sending email to: ${to}`);
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("❌ Error sending email:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send new product notification to all users
 */
const notifyUsersAboutNewProduct = async (product) => {
  try {
    console.log("🔔 Starting new product notification for:", product.name);

    // Check if email service is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn("⚠️ Email service not configured. Skipping notifications.");
      return {
        success: false,
        error: "Email service not configured",
        notified: 0,
      };
    }

    // Get all active users with email
    const users = await User.find({
      isActive: { $ne: false },
      email: { $exists: true, $ne: "" },
    }).select("email name");

    console.log(`📋 Found ${users.length} users to notify`);

    if (!users.length) {
      console.log("No users to notify about new product");
      return { success: true, notified: 0 };
    }

    const subject = `🆕 New Product Alert: ${product.name}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Product Alert</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🏪 Shri Venkatesan Traders
              </h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">
                Your Trusted Plumbing Partner
              </p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              <h2 style="color: #1e293b; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">
                🆕 New Product Just Added!
              </h2>
              
              <div style="background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%); border-radius: 16px; padding: 25px; margin: 20px 0;">
                <h3 style="color: #0ea5e9; margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">
                  ${product.name}
                </h3>
                <p style="color: #475569; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                  ${
                    product.shortDescription ||
                    product.description ||
                    "Check out our latest product!"
                  }
                </p>
                <div style="display: flex; align-items: center; gap: 20px;">
                  <span style="background-color: #0ea5e9; color: white; padding: 8px 16px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                    ${product.category}
                  </span>
                  <span style="color: #059669; font-size: 22px; font-weight: 700;">
                    ₹${product.price?.toLocaleString() || "Contact for price"}
                  </span>
                </div>
              </div>

              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 20px 0;">
                We've just added a new product to our inventory that we think you'll love! 
                Be among the first to check it out and take advantage of our quality products at competitive prices.
              </p>
              
              <a href="${
                process.env.FRONTEND_URL || "http://localhost:5173"
              }/products/${product._id}" 
                 style="display: inline-block; background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); color: white; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 600; font-size: 16px; margin-top: 10px;">
                View Product Details →
              </a>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; margin: 0 0 10px 0;">
                Thank you for being a valued customer!
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Shri Venkatesan Traders. All rights reserved.
              </p>
              <p style="color: #94a3b8; font-size: 11px; margin: 15px 0 0 0;">
                If you no longer wish to receive these emails, you can update your preferences in your account settings.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const text = `
New Product Alert from Shri Venkatesan Traders!

We've just added a new product: ${product.name}

Category: ${product.category}
Price: ₹${product.price?.toLocaleString() || "Contact for price"}

${product.shortDescription || product.description || ""}

Visit our website to check it out!
${process.env.FRONTEND_URL || "http://localhost:5173"}/products/${product._id}

Thank you for being a valued customer!
Shri Venkatesan Traders
    `;

    // Send emails in batches to avoid rate limiting
    const batchSize = 10;
    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < users.length; i += batchSize) {
      const batch = users.slice(i, i + batchSize);
      const emailPromises = batch.map((user) =>
        sendEmail({
          to: user.email,
          subject,
          html,
          text,
        })
      );

      const results = await Promise.allSettled(emailPromises);
      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value.success) {
          successCount++;
        } else {
          failCount++;
        }
      });

      // Small delay between batches to avoid rate limiting
      if (i + batchSize < users.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    console.log(
      `Product notification emails sent: ${successCount} success, ${failCount} failed`
    );
    return { success: true, notified: successCount, failed: failCount };
  } catch (error) {
    console.error("Error notifying users about new product:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send order confirmation email with invoice/bill to user and admin
 */
const sendOrderConfirmationEmail = async (order) => {
  try {
    if (!order || !order.user || !order.user.email) {
      console.warn("⚠️ Cannot send order confirmation: Missing user email");
      return { success: false, error: "Missing user email" };
    }

    const { user, items, totalAmount, shippingAddress, orderNumber } = order;
    const invoiceNumber = `INV-${orderNumber}`;
    const invoiceDate = new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    // Formatting helper
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount);
    };

    // Calculate subtotal, GST, etc.
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const gstRate = 18; // 18% GST
    const gstAmount = (subtotal * gstRate) / 100;
    const shippingCharge = order.shippingCharge || 0;

    const itemsHtml = items
      .map(
        (item, index) => `
      <tr style="background-color: ${index % 2 === 0 ? "#ffffff" : "#f8fafc"};">
        <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; color: #334155;">${
          index + 1
        }</td>
        <td style="padding: 14px; border-bottom: 1px solid #e2e8f0;">
          <p style="margin: 0; font-weight: 600; color: #1e293b;">${
            item.name
          }</p>
        </td>
        <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #334155;">${
          item.quantity
        }</td>
        <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #334155;">${formatCurrency(
          item.price
        )}</td>
        <td style="padding: 14px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: 600; color: #1e293b;">
          ${formatCurrency(item.price * item.quantity)}
        </td>
      </tr>
    `
      )
      .join("");

    const subject = `🧾 Invoice #${invoiceNumber} - Your Order from Shri Venkatesan Traders`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice - ${invoiceNumber}</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 700px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0A5C80 0%, #0ea5e9 50%, #E67E22 100%); padding: 30px 40px;">
              <table width="100%">
                <tr>
                  <td>
                    <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800;">🏪 Shri Venkatesan Traders</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0 0; font-size: 13px;">Your Trusted Plumbing & Hardware Partner</p>
                  </td>
                  <td style="text-align: right;">
                    <div style="background: rgba(255,255,255,0.2); padding: 12px 20px; border-radius: 8px; display: inline-block;">
                      <p style="color: #fff; margin: 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Invoice</p>
                      <p style="color: #fff; margin: 4px 0 0 0; font-size: 18px; font-weight: 700;">${invoiceNumber}</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Invoice Meta -->
          <tr>
            <td style="padding: 30px 40px 20px 40px;">
              <table width="100%">
                <tr>
                  <td style="vertical-align: top; width: 50%;">
                    <p style="margin: 0 0 5px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; font-weight: 600;">Bill To</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 700; color: #1e293b;">${
                      user.name
                    }</p>
                    <p style="margin: 5px 0 0 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                      ${user.email}<br>
                      ${
                        shippingAddress?.phone
                          ? `Phone: ${shippingAddress.phone}`
                          : ""
                      }
                    </p>
                  </td>
                  <td style="vertical-align: top; width: 50%; text-align: right;">
                    <table style="margin-left: auto;">
                      <tr>
                        <td style="padding: 4px 15px 4px 0; font-size: 13px; color: #64748b;">Invoice Date:</td>
                        <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #1e293b;">${invoiceDate}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 15px 4px 0; font-size: 13px; color: #64748b;">Order Number:</td>
                        <td style="padding: 4px 0; font-size: 13px; font-weight: 600; color: #1e293b;">${orderNumber}</td>
                      </tr>
                      <tr>
                        <td style="padding: 4px 15px 4px 0; font-size: 13px; color: #64748b;">Payment Status:</td>
                        <td style="padding: 4px 0;">
                          <span style="background: #dcfce7; color: #166534; padding: 3px 10px; border-radius: 12px; font-size: 11px; font-weight: 700;">✓ PAID</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Shipping Address -->
          ${
            shippingAddress
              ? `
          <tr>
            <td style="padding: 0 40px 25px 40px;">
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 15px 20px; border-radius: 10px; border-left: 4px solid #0ea5e9;">
                <p style="margin: 0 0 5px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #0ea5e9; font-weight: 700;">📦 Shipping Address</p>
                <p style="margin: 0; font-size: 13px; color: #475569; line-height: 1.6;">
                  ${shippingAddress.fullName || user.name}<br>
                  ${shippingAddress.street || ""}<br>
                  ${shippingAddress.city || ""}, ${
                  shippingAddress.state || ""
                } - ${shippingAddress.pincode || ""}<br>
                  ${shippingAddress.country || "India"}
                </p>
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Items Table -->
          <tr>
            <td style="padding: 0 40px;">
              <table width="100%" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden;">
                <thead>
                  <tr style="background: linear-gradient(135deg, #0A5C80 0%, #0ea5e9 100%);">
                    <th style="padding: 14px; text-align: left; color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">#</th>
                    <th style="padding: 14px; text-align: left; color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Item Description</th>
                    <th style="padding: 14px; text-align: center; color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Qty</th>
                    <th style="padding: 14px; text-align: right; color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Unit Price</th>
                    <th style="padding: 14px; text-align: right; color: #fff; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 25px 40px;">
              <table width="100%">
                <tr>
                  <td style="width: 60%;"></td>
                  <td style="width: 40%;">
                    <table width="100%" style="background: #f8fafc; border-radius: 10px; overflow: hidden;">
                      <tr>
                        <td style="padding: 12px 20px; font-size: 13px; color: #64748b;">Subtotal:</td>
                        <td style="padding: 12px 20px; text-align: right; font-size: 13px; font-weight: 600; color: #334155;">${formatCurrency(
                          subtotal
                        )}</td>
                      </tr>
                      ${
                        shippingCharge > 0
                          ? `
                      <tr>
                        <td style="padding: 12px 20px; font-size: 13px; color: #64748b;">Shipping:</td>
                        <td style="padding: 12px 20px; text-align: right; font-size: 13px; font-weight: 600; color: #334155;">${formatCurrency(
                          shippingCharge
                        )}</td>
                      </tr>
                      `
                          : ""
                      }
                      <tr style="background: linear-gradient(135deg, #0A5C80 0%, #0ea5e9 100%);">
                        <td style="padding: 15px 20px; font-size: 14px; font-weight: 700; color: #fff;">TOTAL:</td>
                        <td style="padding: 15px 20px; text-align: right; font-size: 20px; font-weight: 800; color: #fff;">${formatCurrency(
                          totalAmount
                        )}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Track Order Button -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <a href="${
                process.env.CLIENT_URL || "http://localhost:3000"
              }/orders/${order._id}" 
                 style="display: inline-block; background: linear-gradient(135deg, #E67E22 0%, #f59e0b 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 15px rgba(230, 126, 34, 0.3);">
                📍 Track Your Order
              </a>
            </td>
          </tr>

          <!-- Footer Note -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0; font-size: 13px; color: #92400e; line-height: 1.6;">
                  <strong>💡 Note:</strong> This is an auto-generated invoice. Please keep it for your records. 
                  For any queries regarding this order, please contact our support team with your order number.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1e293b; padding: 30px 40px; text-align: center;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0 0 10px 0;">Thank you for shopping with us! 🙏</p>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Shri Venkatesan Traders. All rights reserved.
              </p>
              <p style="color: #475569; font-size: 11px; margin: 15px 0 0 0;">
                📞 Contact: support@shrivenkatesantraders.com | 📍 Your City, India
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const textContent = `
INVOICE - ${invoiceNumber}
===============================
Shri Venkatesan Traders

Bill To: ${user.name}
Email: ${user.email}
Invoice Date: ${invoiceDate}
Order Number: ${orderNumber}

ITEMS:
${items
  .map(
    (item, i) =>
      `${i + 1}. ${item.name} x${item.quantity} - ${formatCurrency(
        item.price * item.quantity
      )}`
  )
  .join("\n")}

-------------------------------
TOTAL: ${formatCurrency(totalAmount)}
-------------------------------

Payment Status: PAID ✓

${
  shippingAddress
    ? `
SHIPPING ADDRESS:
${shippingAddress.fullName || user.name}
${shippingAddress.street || ""}
${shippingAddress.city || ""}, ${shippingAddress.state || ""} - ${
        shippingAddress.pincode || ""
      }
`
    : ""
}

Track your order: ${process.env.CLIENT_URL || "http://localhost:3000"}/orders/${
      order._id
    }

Thank you for shopping with us!
Shri Venkatesan Traders
    `;

    // Send to user
    await sendEmail({
      to: user.email,
      subject,
      html,
      text: textContent,
    });

    // Send copy to admin (optional, if configured)
    if (process.env.ADMIN_EMAIL) {
      await sendEmail({
        to: process.env.ADMIN_EMAIL,
        subject: `[ADMIN] New Order Invoice #${invoiceNumber} - ${formatCurrency(
          totalAmount
        )}`,
        html,
        text: textContent,
      });
    }

    console.log(`✅ Invoice email sent for ${invoiceNumber} to ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Error sending invoice email:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Send order status update email to user
 */
const sendOrderStatusUpdateEmail = async (order, status, note) => {
  try {
    // Check if email service is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn(
        "⚠️ Email service not configured. Skipping status update email."
      );
      return { success: false, error: "Email service not configured" };
    }

    const populatedOrder = await order.populate("user", "name email");
    if (!populatedOrder.user || !populatedOrder.user.email) {
      console.warn("⚠️ Cannot send status update: Missing user email");
      return { success: false, error: "Missing user email" };
    }

    const statusConfig = {
      pending: {
        label: "Pending",
        icon: "⏳",
        color: "#f59e0b",
        bgColor: "#fef3c7",
      },
      confirmed: {
        label: "Confirmed",
        icon: "✅",
        color: "#10b981",
        bgColor: "#d1fae5",
      },
      processing: {
        label: "Processing",
        icon: "⚙️",
        color: "#6366f1",
        bgColor: "#e0e7ff",
      },
      shipped: {
        label: "Shipped",
        icon: "🚚",
        color: "#0ea5e9",
        bgColor: "#e0f2fe",
      },
      out_for_delivery: {
        label: "Out for Delivery",
        icon: "📦",
        color: "#8b5cf6",
        bgColor: "#ede9fe",
      },
      delivered: {
        label: "Delivered",
        icon: "🎉",
        color: "#22c55e",
        bgColor: "#dcfce7",
      },
      cancelled: {
        label: "Cancelled",
        icon: "❌",
        color: "#ef4444",
        bgColor: "#fee2e2",
      },
      returned: {
        label: "Returned",
        icon: "↩️",
        color: "#f97316",
        bgColor: "#ffedd5",
      },
    };

    const config = statusConfig[status] || {
      label: status,
      icon: "📋",
      color: "#64748b",
      bgColor: "#f1f5f9",
    };
    const subject = `${config.icon} Order ${config.label}: #${populatedOrder.orderNumber}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Status Update</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9;">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #0A5C80 0%, #0ea5e9 50%, #E67E22 100%); padding: 30px 40px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">🏪 Shri Venkatesan Traders</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0 0; font-size: 13px;">Order Status Update</p>
            </td>
          </tr>

          <!-- Status Badge -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <div style="display: inline-block; background-color: ${
                config.bgColor
              }; padding: 20px 40px; border-radius: 16px; border: 2px solid ${
      config.color
    };">
                <span style="font-size: 48px; display: block; margin-bottom: 10px;">${
                  config.icon
                }</span>
                <span style="font-size: 24px; font-weight: 800; color: ${
                  config.color
                }; text-transform: uppercase; letter-spacing: 1px;">${
      config.label
    }</span>
              </div>
            </td>
          </tr>

          <!-- Greeting & Message -->
          <tr>
            <td style="padding: 20px 40px;">
              <p style="color: #1e293b; font-size: 16px; margin: 0;">Hello <strong>${
                populatedOrder.user.name
              }</strong>,</p>
              <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 15px 0 0 0;">
                ${
                  status === "confirmed"
                    ? "Great news! Your order has been confirmed and is being prepared."
                    : ""
                }
                ${
                  status === "processing"
                    ? "Your order is currently being processed and will be shipped soon."
                    : ""
                }
                ${
                  status === "shipped"
                    ? "Exciting! Your order has been shipped and is on its way to you."
                    : ""
                }
                ${
                  status === "out_for_delivery"
                    ? "Your order is out for delivery! Please be available to receive it."
                    : ""
                }
                ${
                  status === "delivered"
                    ? "Your order has been delivered successfully. Thank you for shopping with us!"
                    : ""
                }
                ${
                  status === "cancelled"
                    ? "Your order has been cancelled. If you have any questions, please contact us."
                    : ""
                }
                ${
                  status === "returned"
                    ? "Your return request has been processed."
                    : ""
                }
                ${
                  status === "pending"
                    ? "Your order is pending and will be processed shortly."
                    : ""
                }
              </p>
            </td>
          </tr>

          <!-- Order Details -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); padding: 20px; border-radius: 12px; border-left: 4px solid ${
                config.color
              };">
                <table width="100%">
                  <tr>
                    <td style="padding: 5px 0; color: #64748b; font-size: 13px;">Order Number:</td>
                    <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #1e293b; font-size: 14px;">#${
                      populatedOrder.orderNumber
                    }</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #64748b; font-size: 13px;">Total Amount:</td>
                    <td style="padding: 5px 0; text-align: right; font-weight: 700; color: #0ea5e9; font-size: 14px;">₹${populatedOrder.totalAmount?.toLocaleString(
                      "en-IN"
                    )}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #64748b; font-size: 13px;">Updated On:</td>
                    <td style="padding: 5px 0; text-align: right; font-weight: 600; color: #1e293b; font-size: 13px;">${new Date().toLocaleDateString(
                      "en-IN",
                      {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          ${
            note
              ? `
          <!-- Admin Note -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 15px 20px; border-radius: 10px; border-left: 4px solid #f59e0b;">
                <p style="margin: 0 0 5px 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #92400e; font-weight: 700;">💬 Note from Admin</p>
                <p style="margin: 0; font-size: 14px; color: #78350f; font-style: italic; line-height: 1.5;">"${note}"</p>
              </div>
            </td>
          </tr>
          `
              : ""
          }

          ${
            status === "shipped" &&
            (populatedOrder.trackingNumber || populatedOrder.courier)
              ? `
          <!-- Tracking Info -->
          <tr>
            <td style="padding: 0 40px 20px 40px;">
              <div style="background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%); padding: 20px; border-radius: 12px; border: 2px dashed #0ea5e9;">
                <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 700; color: #0369a1;">🚚 Tracking Information</p>
                ${
                  populatedOrder.courier
                    ? `<p style="margin: 0 0 5px 0; font-size: 13px; color: #0c4a6e;"><strong>Courier:</strong> ${populatedOrder.courier}</p>`
                    : ""
                }
                ${
                  populatedOrder.trackingNumber
                    ? `<p style="margin: 0 0 5px 0; font-size: 13px; color: #0c4a6e;"><strong>Tracking ID:</strong> <span style="background: #fff; padding: 3px 10px; border-radius: 6px; font-family: monospace; font-weight: 700;">${populatedOrder.trackingNumber}</span></p>`
                    : ""
                }
                ${
                  populatedOrder.estimatedDelivery
                    ? `<p style="margin: 0; font-size: 13px; color: #0c4a6e;"><strong>Expected Delivery:</strong> ${new Date(
                        populatedOrder.estimatedDelivery
                      ).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}</p>`
                    : ""
                }
              </div>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Track Order Button -->
          <tr>
            <td style="padding: 10px 40px 30px 40px; text-align: center;">
              <a href="${
                process.env.FRONTEND_URL ||
                process.env.CLIENT_URL ||
                "http://localhost:5173"
              }/orders/${populatedOrder._id}" 
                 style="display: inline-block; background: linear-gradient(135deg, #0A5C80 0%, #0ea5e9 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 15px rgba(10, 92, 128, 0.3);">
                📍 Track Your Order
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #1e293b; padding: 25px 40px; text-align: center;">
              <p style="color: #94a3b8; font-size: 13px; margin: 0 0 8px 0;">Questions about your order?</p>
              <p style="color: #64748b; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Shri Venkatesan Traders. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

    const result = await sendEmail({
      to: populatedOrder.user.email,
      subject,
      html,
      text: `Your order #${
        populatedOrder.orderNumber
      } status has been updated to: ${config.label}. ${
        note ? `Note: ${note}` : ""
      } Track your order at: ${
        process.env.FRONTEND_URL ||
        process.env.CLIENT_URL ||
        "http://localhost:5173"
      }/orders/${populatedOrder._id}`,
    });

    if (result.success) {
      console.log(
        `✅ Order status email sent for #${populatedOrder.orderNumber} - ${config.label}`
      );
    }
    return result;
  } catch (error) {
    console.error("❌ Error sending status update email:", error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendEmail,
  notifyUsersAboutNewProduct,
  sendOrderConfirmationEmail,
  sendOrderStatusUpdateEmail,
};
