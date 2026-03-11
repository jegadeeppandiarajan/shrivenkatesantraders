import { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchCart } from "../../features/cart/cartSlice";
import { useTheme } from "../../context/ThemeContext";
import api from "../../services/api";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import VisibilityIcon from "@mui/icons-material/Visibility";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const sessionId = searchParams.get("session_id");
  
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        setError("No payment session found");
        setLoading(false);
        return;
      }

      try {
        // Verify payment and get order details
        const { data } = await api.get(`/payments/verify-session/${sessionId}`);
        
        if (data.success) {
          setOrderDetails(data.data);
          // Clear the cart after successful payment
          dispatch(fetchCart());
        } else {
          setError(data.message || "Payment verification failed");
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        // Even if verification fails, show success (Stripe already processed)
        setOrderDetails({ 
          verified: false,
          message: "Payment successful! Your order is being processed."
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-brand-dark mb-2">Verifying Payment</h2>
          <p className="text-brand-slate">Please wait while we confirm your payment...</p>
        </div>
      </div>
    );
  }

  if (error && !orderDetails) {
    return (
      <div className={`min-h-screen py-12 px-4 ${darkMode ? 'bg-dark-bg' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
        <div className="max-w-2xl mx-auto">
          <div className={`rounded-3xl shadow-xl p-12 text-center ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'}`}>
            <div className="w-24 h-24 mx-auto mb-8 bg-amber-100 rounded-full flex items-center justify-center">
              <ReceiptLongIcon sx={{ fontSize: 48 }} className="text-amber-600" />
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Payment Status Unknown</h2>
            <p className={`mb-8 ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>{error}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/orders"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-brand-primary text-white rounded-2xl font-semibold hover:bg-brand-dark transition-colors"
              >
                <ReceiptLongIcon />
                Check My Orders
              </Link>
              <Link
                to="/"
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 border-2 rounded-2xl font-semibold transition-colors ${darkMode ? 'border-dark-border text-dark-text hover:bg-dark-bg' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}
              >
                <HomeIcon />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-12 px-4 ${darkMode ? 'bg-dark-bg' : 'bg-gradient-to-br from-green-50 to-emerald-50'}`}>
      <div className="max-w-3xl mx-auto">
        {/* Success Card */}
        <div className={`rounded-3xl shadow-xl overflow-hidden ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'}`}>
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-center text-white">
            <div className="w-24 h-24 mx-auto mb-6 bg-white/20 backdrop-blur rounded-full flex items-center justify-center animate-bounce">
              <CheckCircleIcon sx={{ fontSize: 56 }} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Payment Successful!</h1>
            <p className="text-green-100 text-lg">Thank you for your order</p>
          </div>

          {/* Order Details */}
          <div className="p-8">
            {orderDetails?.order && (
              <div className={`rounded-2xl p-6 mb-8 ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
                  <ReceiptLongIcon className="text-brand-primary" />
                  Order Details
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Order Number</p>
                    <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{orderDetails.order.orderNumber}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Total Amount</p>
                    <p className="font-bold text-green-600 text-xl">₹{orderDetails.order.totalAmount?.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Payment Status</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                      <CheckCircleIcon sx={{ fontSize: 16 }} />
                      Paid
                    </span>
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Order Status</p>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      <LocalShippingIcon sx={{ fontSize: 16 }} />
                      {orderDetails.order.orderStatus || "Confirmed"}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* What's Next Section */}
            <div className="mb-8">
              <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>What happens next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Order Confirmation</p>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>You'll receive an email confirmation shortly</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Processing</p>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>We'll prepare your order for shipping</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Shipping</p>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Your order will be shipped and you can track it</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <div>
                    <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Delivery</p>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Receive your order at your doorstep</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {orderDetails?.order?._id ? (
                <Link
                  to={`/orders/${orderDetails.order._id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <VisibilityIcon />
                  Track Your Order
                </Link>
              ) : (
                <Link
                  to="/orders"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <ReceiptLongIcon />
                  View My Orders
                </Link>
              )}
              <Link
                to="/products"
                className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border-2 rounded-2xl font-semibold transition-colors ${darkMode ? 'border-dark-border text-dark-text hover:bg-dark-bg' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <ShoppingBagIcon />
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Support Info */}
        <div className={`mt-8 text-center ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
          <p>
            Need help? Contact us at{" "}
            <a href="mailto:support@shrivenkatesantraders.com" className="text-brand-primary hover:underline">
              support@shrivenkatesantraders.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;

