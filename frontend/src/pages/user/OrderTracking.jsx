import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchOrderDetails, trackOrder } from "../../features/orders/orderSlice";
import { useSocket } from "../../context/SocketContext";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import InventoryIcon from "@mui/icons-material/Inventory";
import HomeIcon from "@mui/icons-material/Home";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import PersonIcon from "@mui/icons-material/Person";

// Get base URL for images (strip /api suffix if present)
const API_URL = import.meta.env.VITE_API_URL?.replace(/\/api\/?$/, "") ?? "";

const timelineMap = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered"];

const statusConfig = {
  pending: { icon: PendingIcon, label: "Order Placed", color: "amber" },
  confirmed: { icon: CheckCircleIcon, label: "Confirmed", color: "blue" },
  processing: { icon: InventoryIcon, label: "Processing", color: "purple" },
  shipped: { icon: LocalShippingIcon, label: "Shipped", color: "orange" },
  out_for_delivery: { icon: LocalShippingIcon, label: "Out for Delivery", color: "indigo" },
  delivered: { icon: HomeIcon, label: "Delivered", color: "green" },
};

const OrderTracking = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const socket = useSocket();
  const { current, timeline } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
    dispatch(trackOrder(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("order:subscribe", id);
    socket.on("order:status", () => {
      dispatch(fetchOrderDetails(id));
      dispatch(trackOrder(id));
    });
    return () => {
      socket.emit("order:unsubscribe", id);
      socket.off("order:status");
    };
  }, [socket, id, dispatch]);

  // Deduplicate timeline entries
  const uniqueTimeline = useMemo(() => {
    const seen = new Map();
    timeline.forEach((entry) => {
      if (entry._id && !seen.has(entry._id)) {
        seen.set(entry._id, entry);
      }
    });
    return Array.from(seen.values());
  }, [timeline]);

  // Deduplicate order items
  const uniqueItems = useMemo(() => {
    if (!current?.items) return [];
    const seen = new Map();
    current.items.forEach((item) => {
      const key = item.product?._id || item._id;
      if (key && !seen.has(key)) {
        seen.set(key, item);
      }
    });
    return Array.from(seen.values());
  }, [current?.items]);

  const getProductImage = (item) => {
    if (item.product?.images && item.product.images.length > 0) {
      const img = item.product.images[0];
      if (img?.url) return img.url.startsWith("http") ? img.url : `${API_URL}${img.url}`;
      if (typeof img === "string") {
        return img.startsWith("http") ? img : `${API_URL}${img}`;
      }
    }
    return null;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!current) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  const activeIndex = timelineMap.indexOf(current.orderStatus);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/orders")}
            className="flex items-center gap-2 text-brand-slate hover:text-brand-primary transition-colors mb-4"
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
            <span className="text-sm font-medium">Back to Orders</span>
          </button>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-brand-dark">Order Details</h1>
              <p className="text-brand-slate mt-1">Track your order status</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold bg-${statusConfig[current.orderStatus]?.color || "slate"}-100 text-${statusConfig[current.orderStatus]?.color || "slate"}-700`}>
                {statusConfig[current.orderStatus]?.label || current.orderStatus}
              </div>
            </div>
          </div>
        </div>

        {/* Order Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 rounded-2xl flex items-center justify-center">
                <ReceiptLongIcon className="text-brand-primary" sx={{ fontSize: 28 }} />
              </div>
              <div>
                <p className="text-sm text-brand-slate">Order Number</p>
                <h2 className="text-xl font-bold text-brand-dark">{current.orderNumber}</h2>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-sm text-brand-slate">Order Date</p>
                <p className="font-semibold text-brand-dark">{formatDate(current.createdAt)}</p>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="text-right">
                <p className="text-sm text-brand-slate">Total Amount</p>
                <p className="text-xl font-bold text-brand-primary">₹{current.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-bold text-brand-dark mb-6">Delivery Progress</h3>
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-slate-200 rounded-full">
              <div
                className="h-full bg-gradient-to-r from-brand-primary to-brand-dark rounded-full transition-all duration-500"
                style={{ width: `${(activeIndex / (timelineMap.length - 1)) * 100}%` }}
              ></div>
            </div>

            {/* Progress Steps */}
            <div className="relative flex justify-between">
              {timelineMap.map((stage, index) => {
                const config = statusConfig[stage];
                const IconComponent = config?.icon || PendingIcon;
                const isActive = index <= activeIndex;
                const isCurrent = index === activeIndex;

                return (
                  <div key={stage} className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                          ? "bg-gradient-to-br from-brand-primary to-brand-dark text-white shadow-lg"
                          : "bg-slate-200 text-slate-400"
                        } ${isCurrent ? "ring-4 ring-brand-primary/20 scale-110" : ""}`}
                    >
                      <IconComponent sx={{ fontSize: 20 }} />
                    </div>
                    <p className={`text-xs font-medium mt-3 text-center max-w-[80px] ${isActive ? "text-brand-dark" : "text-slate-400"}`}>
                      {config?.label || stage.replace(/_/g, " ")}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Timeline */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-brand-dark mb-6">Order Timeline</h3>
            <div className="relative">
              {uniqueTimeline.map((entry, index) => {
                const config = statusConfig[entry.status];
                const IconComponent = config?.icon || PendingIcon;

                return (
                  <div key={entry._id} className="flex gap-4 pb-6 last:pb-0">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${config?.color || "slate"}-100 text-${config?.color || "slate"}-600`}>
                        <IconComponent sx={{ fontSize: 20 }} />
                      </div>
                      {index < uniqueTimeline.length - 1 && (
                        <div className="w-0.5 flex-1 bg-slate-200 mt-2"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <p className="font-semibold text-brand-dark capitalize">
                        {config?.label || entry.status.replace(/_/g, " ")}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-brand-slate">
                        <AccessTimeIcon sx={{ fontSize: 14 }} />
                        {formatDate(entry.timestamp)}
                      </div>
                      {entry.note && (
                        <p className="mt-2 text-sm text-slate-600 bg-slate-50 rounded-lg p-3">
                          {entry.note}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details */}
          <div className="space-y-6">
            {/* Shipping Address */}
            {current.shippingAddress && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h3 className="text-lg font-bold text-brand-dark mb-4">Shipping Address</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-slate-600">
                    <PersonIcon sx={{ fontSize: 20 }} className="text-slate-400" />
                    <span>{current.shippingAddress.fullName}</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-600">
                    <PhoneIcon sx={{ fontSize: 20 }} className="text-slate-400" />
                    <span>{current.shippingAddress.phone}</span>
                  </div>
                  <div className="flex items-start gap-3 text-slate-600">
                    <LocationOnIcon sx={{ fontSize: 20 }} className="text-slate-400 mt-0.5" />
                    <div>
                      <p>{current.shippingAddress.street}</p>
                      <p>{current.shippingAddress.city}, {current.shippingAddress.state}</p>
                      <p>{current.shippingAddress.pincode}, {current.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-brand-dark mb-4">Order Items</h3>
              <div className="space-y-4">
                {uniqueItems.map((item, idx) => (
                  <div key={item.product?._id || idx} className="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      {getProductImage(item) ? (
                        <img
                          src={getProductImage(item)}
                          alt={item.product?.name || "Product"}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBagIcon className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-brand-dark text-sm line-clamp-1">
                        {item.product?.name || item.name || "Product"}
                      </h4>
                      <p className="text-xs text-brand-slate">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-brand-dark text-sm">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 pt-4 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{current.subtotal?.toLocaleString() || current.totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between font-bold text-brand-dark text-lg pt-2 border-t border-slate-200">
                  <span>Total</span>
                  <span className="text-brand-primary">₹{current.totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

