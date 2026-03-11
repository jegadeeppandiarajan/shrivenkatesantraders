import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyOrders } from "../../features/orders/orderSlice";
import { useTheme } from "../../context/ThemeContext";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import InventoryIcon from "@mui/icons-material/Inventory";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const getStatusConfig = (darkMode) => ({
  pending: {
    color: darkMode ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-amber-100 text-amber-700 border-amber-200",
    icon: PendingIcon,
    label: "Pending",
  },
  confirmed: {
    color: darkMode ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-blue-100 text-blue-700 border-blue-200",
    icon: CheckCircleIcon,
    label: "Confirmed",
  },
  processing: {
    color: darkMode ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-purple-100 text-purple-700 border-purple-200",
    icon: InventoryIcon,
    label: "Processing",
  },
  shipped: {
    color: darkMode ? "bg-orange-500/20 text-orange-400 border-orange-500/30" : "bg-orange-100 text-orange-700 border-orange-200",
    icon: LocalShippingIcon,
    label: "Shipped",
  },
  delivered: {
    color: darkMode ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircleIcon,
    label: "Delivered",
  },
  cancelled: {
    color: darkMode ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-red-100 text-red-700 border-red-200",
    icon: PendingIcon,
    label: "Cancelled",
  },
});

// Get base URL for images (strip /api suffix if present)
const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/api\/?$/, "");

const Orders = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const { list, loading } = useSelector((state) => state.orders);
  const statusConfig = getStatusConfig(darkMode);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  // Deduplicate orders by ID (in case of any duplicates from API)
  const uniqueOrders = useMemo(() => {
    const seen = new Map();
    list.forEach((order) => {
      if (order._id && !seen.has(order._id)) {
        seen.set(order._id, order);
      }
    });
    return Array.from(seen.values());
  }, [list]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getProductImage = (item) => {
    if (item.product?.images && item.product.images.length > 0) {
      const img = item.product.images[0];
      // Handle if img is an object with url property
      if (typeof img === 'object' && img?.url) {
        return img.url.startsWith("http") ? img.url : `${API_URL}${img.url}`;
      }
      // Handle if img is a string
      if (typeof img === 'string') {
        return img.startsWith("http") ? img : `${API_URL}${img}`;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <AnimatedBackground />
        <div className="text-center z-10">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`font-medium ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (uniqueOrders.length === 0) {
    return (
      <div className={`min-h-screen py-12 px-4 relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <AnimatedBackground />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className={`rounded-3xl shadow-xl p-12 text-center backdrop-blur-sm ${darkMode ? 'bg-dark-card/90 border border-dark-border' : 'bg-white/90'}`}>
            <div className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-dark-bg' : 'bg-gradient-to-br from-slate-100 to-slate-200'}`}>
              <ReceiptLongIcon sx={{ fontSize: 64 }} className={darkMode ? 'text-dark-muted' : 'text-slate-400'} />
            </div>
            <h2 className={`text-3xl font-bold mb-4 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>No Orders Yet</h2>
            <p className={`mb-8 max-w-md mx-auto ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
              You haven't placed any orders yet. Start shopping and your orders will appear here!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-gold text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <ShoppingBagIcon />
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-8 px-4 relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
      <AnimatedBackground />
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-3xl md:text-4xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>My Orders</h1>
          <p className={`mt-2 ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>{uniqueOrders.length} {uniqueOrders.length === 1 ? "order" : "orders"} placed</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {uniqueOrders.map((order, index) => {
            const status = statusConfig[order.orderStatus] || statusConfig.pending;
            const StatusIcon = status.icon;

            return (
              <div
                key={order._id}
                className={`rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Order Header */}
                <div className={`p-6 border-b ${darkMode ? 'border-dark-border' : 'border-brand-primary/10'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10'}`}>
                        <ReceiptLongIcon className="text-brand-primary" />
                      </div>
                      <div>
                        <h3 className={`font-bold text-lg ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{order.orderNumber}</h3>
                        <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
                          <CalendarTodayIcon sx={{ fontSize: 14 }} />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${status.color}`}>
                      <StatusIcon sx={{ fontSize: 18 }} />
                      {status.label}
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="p-6">
                  <div className="flex flex-wrap gap-3 mb-4">
                    {order.items.slice(0, 4).map((item, idx) => (
                      <div
                        key={`${order._id}-item-${idx}`}
                        className={`w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 ${darkMode ? 'bg-dark-bg' : 'bg-slate-100'}`}
                      >
                        {getProductImage(item) ? (
                          <img
                            src={getProductImage(item)}
                            alt={item.product?.name || "Product"}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ShoppingBagIcon className={darkMode ? 'text-dark-muted' : 'text-slate-300'} />
                          </div>
                        )}
                      </div>
                    ))}
                    {order.items.length > 4 && (
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-dark-bg' : 'bg-slate-100'}`}>
                        <span className={`text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>+{order.items.length - 4}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Items</p>
                        <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{order.items.length} products</p>
                      </div>
                      <div className={`h-8 w-px ${darkMode ? 'bg-dark-border' : 'bg-slate-200'}`}></div>
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Total Amount</p>
                        <p className="font-bold text-brand-primary text-lg">₹{order.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>

                    <Link
                      to={`/orders/${order._id}`}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand-primary to-brand-gold text-white rounded-2xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      View Details
                      <ArrowForwardIcon sx={{ fontSize: 18 }} />
                    </Link>
                  </div>
                </div>

                {/* Shipping Info */}
                {order.shippingAddress && (
                  <div className={`px-6 py-4 border-t ${darkMode ? 'bg-dark-bg border-dark-border' : 'bg-slate-50 border-brand-primary/10'}`}>
                    <div className="flex items-start gap-3">
                      <LocalShippingIcon className={`mt-0.5 ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`} sx={{ fontSize: 18 }} />
                      <div className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                        <span className="font-medium">Delivering to:</span>{" "}
                        {order.shippingAddress.street}, {order.shippingAddress.city},{" "}
                        {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Orders;

