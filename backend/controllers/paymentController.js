const asyncHandler = require("express-async-handler");
const stripe = require("../config/stripe");
const Order = require("../models/Order");
const Payment = require("../models/Payment");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const {
  emitOrderStatus,
  emitDashboardUpdate,
} = require("../sockets/orderSocket");
const { sendOrderConfirmationEmail } = require("../services/emailService");

const createPaymentRecord = async ({ order, session, status }) => {
  const updateData = {
    order: order._id,
    user: order.user,
    stripeSessionId: session.id,
    amount: session.amount_total / 100,
    currency: session.currency,
    status,
    metadata: session.metadata,
  };

  // Only set stripePaymentIntentId if it exists (it's null until payment completes)
  if (session.payment_intent) {
    updateData.stripePaymentIntentId = session.payment_intent;
  }

  return Payment.findOneAndUpdate({ stripeSessionId: session.id }, updateData, {
    upsert: true,
    new: true,
  });
};

const updateInventoryForOrder = async (order) => {
  // Check if inventory was already updated to prevent double updates
  if (order.inventoryUpdated) {
    console.log(
      `[Inventory] Skipping - already updated for order ${order._id}`
    );
    return false;
  }

  console.log(
    `[Inventory] Reducing stock for order ${order._id} with ${order.items.length} items`
  );

  try {
    await Promise.all(
      order.items.map(async (item) => {
        const result = await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity, salesCount: item.quantity } },
          { new: true }
        );
        console.log(
          `[Inventory] Updated ${item.name}: reduced by ${item.quantity}, new stock: ${result?.stock}`
        );
        return result;
      })
    );

    // Mark inventory as updated
    await Order.findByIdAndUpdate(order._id, { inventoryUpdated: true });
    console.log(
      `[Inventory] ✅ Successfully updated inventory for order ${order._id}`
    );
    return true;
  } catch (error) {
    console.error(
      `[Inventory] ❌ Failed to update inventory for order ${order._id}:`,
      error
    );
    throw error;
  }
};

exports.createCheckoutSession = asyncHandler(async (req, res) => {
  // Check if Stripe is configured
  if (!stripe) {
    return res.status(503).json({
      success: false,
      message:
        "Payment service is not configured. Please contact administrator.",
      hint: "Stripe API keys are not set in .env file",
    });
  }

  const { orderId } = req.body;

  if (!orderId) {
    return res
      .status(400)
      .json({ success: false, message: "Order ID is required" });
  }

  const order = await Order.findById(orderId).populate("user", "email name");

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  if (order.user._id.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ success: false, message: "You cannot pay for this order" });
  }

  // Validate order items
  if (!order.items || order.items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Order has no items" });
  }

  try {
    // Build line items with validation
    const backendUrl =
      process.env.BACKEND_URL || `${req.protocol}://${req.get("host")}`;

    const lineItems = order.items.map((item) => {
      let unitAmount = Math.round(item.price * 100);

      // Safety check for invalid price
      if (isNaN(unitAmount)) {
        console.error(`Invalid price for item ${item.name}: ${item.price}`);
        unitAmount = 0;
      }

      if (unitAmount < 50) {
        throw new Error(`Price for ${item.name} is too low. Minimum is ₹0.50`);
      }

      // Ensure image URL is absolute
      let imageUrl = item.image;
      if (imageUrl && !imageUrl.startsWith("http")) {
        imageUrl = `${backendUrl}${
          imageUrl.startsWith("/") ? "" : "/"
        }${imageUrl}`;
      }

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name || "Product",
          },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    });

    const customerEmail = order.user?.email;
    if (!customerEmail) {
      throw new Error(
        `Customer email is required for payment. Please update your profile or use a valid account.`
      );
    }

    console.log(
      `[Stripe] Creating session for order ${order._id} with ${lineItems.length} items for ${customerEmail}`
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      client_reference_id: order._id.toString(),
      metadata: {
        orderId: order._id.toString(),
        userId: order.user._id.toString(),
      },
      line_items: lineItems,
      success_url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/checkout/cancelled`,
    });

    order.stripeSessionId = session.id;
    await order.save();
    await createPaymentRecord({ order, session, status: "pending" });

    res
      .status(200)
      .json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("❌ Stripe checkout session creation failed:", error);

    // Handle specific Stripe errors
    if (error.type === "StripeAuthenticationError") {
      return res.status(503).json({
        success: false,
        message: "Payment service authentication failed. Invalid API key.",
      });
    }

    if (error.type === "StripeInvalidRequestError") {
      return res.status(400).json({
        success: false,
        message: error.message || "Invalid payment request",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create payment session",
      error: error.stack,
      hint: "Check if all product data (price, images) is valid and Stripe keys are correct.",
    });
  }
});

exports.handleStripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const order = await Order.findById(session.metadata.orderId);

    if (order) {
      console.log(`💳 Processing payment completion for order ${order._id}`);
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";
      order.paidAt = new Date();
      order.stripePaymentIntentId = session.payment_intent;
      await order.save();
      console.log(`✅ Order status updated to confirmed for ${order._id}`);

      await createPaymentRecord({ order, session, status: "succeeded" });
      console.log(`💾 Payment record created for ${order._id}`);

      // Fetch full order with user details for email
      const populatedOrder = await Order.findById(order._id).populate(
        "user",
        "name email"
      );

      // Send confirmation email with error handling
      try {
        const emailResult = await sendOrderConfirmationEmail(populatedOrder);
        if (emailResult.success) {
          console.log(
            `📧 Order confirmation email sent successfully for order ${order._id}`
          );
        } else {
          console.warn(
            `⚠️ Failed to send email for order ${order._id}: ${emailResult.error}`
          );
        }
      } catch (emailError) {
        console.error(
          `❌ Error sending confirmation email for order ${order._id}:`,
          emailError.message
        );
        // Don't fail the payment process if email fails
      }

      await Cart.findOneAndUpdate(
        { user: order.user },
        { items: [], totalItems: 0, totalPrice: 0 }
      );

      emitOrderStatus(order._id.toString(), {
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
      });
      emitDashboardUpdate({ type: "orders", orderId: order._id });
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object;
    const payment = await Payment.findOne({
      stripePaymentIntentId: charge.payment_intent,
    });
    if (payment) {
      payment.status = "refunded";
      payment.refundAmount = charge.amount_refunded / 100;
      payment.refundedAt = new Date();
      payment.refundReason = charge.refunds?.data?.[0]?.reason;
      await payment.save();

      await Order.findByIdAndUpdate(payment.order, {
        paymentStatus: "refunded",
      });
    }
  }

  res.status(200).json({ received: true });
});

// Verify payment session and return order details
exports.verifySession = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;

  if (!sessionId) {
    return res
      .status(400)
      .json({ success: false, message: "Session ID is required" });
  }

  // Check if Stripe is configured
  if (!stripe) {
    // If Stripe is not configured, try to find order by session ID
    const order = await Order.findOne({ stripeSessionId: sessionId })
      .select(
        "orderNumber totalAmount orderStatus paymentStatus items createdAt"
      )
      .populate("items.product", "name images");

    if (order) {
      return res.status(200).json({
        success: true,
        data: {
          verified: true,
          order: order,
        },
      });
    }

    return res.status(404).json({ success: false, message: "Order not found" });
  }

  try {
    // Retrieve the session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    // Find the order associated with this session
    const order = await Order.findOne({ stripeSessionId: sessionId }).populate(
      "items.product",
      "name images"
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // If payment was successful but order not updated (webhook might be delayed)
    if (session.payment_status === "paid" && order.paymentStatus !== "paid") {
      // Use findByIdAndUpdate to avoid middleware issues with select()
      await Order.findByIdAndUpdate(order._id, {
        paymentStatus: "paid",
        orderStatus: "confirmed",
        paidAt: new Date(),
        stripePaymentIntentId: session.payment_intent,
        $push: {
          statusHistory: {
            status: "confirmed",
            timestamp: new Date(),
            note: "Payment confirmed via Stripe",
          },
        },
      });

      // Refresh order data
      order.paymentStatus = "paid";
      order.orderStatus = "confirmed";

      // Update inventory and clear cart
      await updateInventoryForOrder(order);

      // Send confirmation email
      const populatedOrder = await Order.findById(order._id).populate(
        "user",
        "name email"
      );
      await sendOrderConfirmationEmail(populatedOrder);

      await Cart.findOneAndUpdate(
        { user: order.user },
        { items: [], totalItems: 0, totalPrice: 0 }
      );

      // Emit socket events
      emitOrderStatus(order._id.toString(), {
        status: order.orderStatus,
        paymentStatus: order.paymentStatus,
      });
      emitDashboardUpdate({ type: "orders", orderId: order._id });
    }

    res.status(200).json({
      success: true,
      data: {
        verified: true,
        paymentStatus: session.payment_status,
        order: {
          _id: order._id,
          orderNumber: order.orderNumber,
          totalAmount: order.totalAmount,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          items: order.items,
          createdAt: order.createdAt,
        },
      },
    });
  } catch (error) {
    console.error("Session verification error:", error.message);

    // Try to find order even if Stripe verification fails
    const order = await Order.findOne({ stripeSessionId: sessionId }).select(
      "_id orderNumber totalAmount orderStatus paymentStatus"
    );

    if (order) {
      return res.status(200).json({
        success: true,
        data: {
          verified: false,
          message: "Payment verification pending",
          order: order,
        },
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to verify payment session",
    });
  }
});
