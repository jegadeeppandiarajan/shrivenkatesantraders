import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder, createCheckoutSession } from "../../features/orders/orderSlice";
import { fetchCart } from "../../features/cart/cartSlice";
import { toast } from "react-toastify";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import SecurityIcon from "@mui/icons-material/Security";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import HomeIcon from "@mui/icons-material/Home";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import MapIcon from "@mui/icons-material/Map";
import PinDropIcon from "@mui/icons-material/PinDrop";
import PublicIcon from "@mui/icons-material/Public";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const initialAddress = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
};

const fieldConfig = {
  fullName: { icon: PersonIcon, label: "Full Name", placeholder: "Enter your full name" },
  phone: { icon: PhoneIcon, label: "Phone Number", placeholder: "Enter your phone number", type: "tel" },
  street: { icon: HomeIcon, label: "Street Address", placeholder: "Enter street address" },
  city: { icon: LocationCityIcon, label: "City", placeholder: "Enter city" },
  state: { icon: MapIcon, label: "State", placeholder: "Enter state" },
  pincode: { icon: PinDropIcon, label: "PIN Code", placeholder: "Enter PIN code" },
  country: { icon: PublicIcon, label: "Country", placeholder: "Country" },
};

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, loading } = useSelector((state) => state.cart);

  const [address, setAddress] = useState(initialAddress);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Deduplicate cart items
  const uniqueItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];

    const seen = new Map();
    items.forEach((item) => {
      // Ensure item and item.product exist before accessing properties
      if (item && item.product && item.product._id) {
        const existingItem = seen.get(item.product._id);
        if (existingItem) {
          existingItem.quantity += item.quantity;
        } else {
          seen.set(item.product._id, { ...item });
        }
      }
    });
    return Array.from(seen.values());
  }, [items]);

  const getProductImage = (product) => {
    if (!product || typeof product !== "object") return null;
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      if (img?.url) return img.url.startsWith("http") ? img.url : `${API_URL}${img.url}`;
      if (typeof img === "string") {
        return img.startsWith("http") ? img : `${API_URL}${img}`;
      }
    }
    return null;
  };

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = {
      items: uniqueItems.map((item) => ({ productId: item.product._id, quantity: item.quantity })),
      shippingAddress: address,
      shippingCost: 0,
      tax: 0,
    };

    try {
      const orderAction = await dispatch(createOrder(payload));
      if (orderAction.meta.requestStatus === "fulfilled") {
        const orderId = orderAction.payload._id;
        const sessionAction = await dispatch(createCheckoutSession(orderId));
        if (sessionAction.meta.requestStatus === "fulfilled" && sessionAction.payload?.url) {
          window.location.href = sessionAction.payload.url;
        } else {
          toast.error(sessionAction.payload?.message || "Failed to create payment session", {
            position: "top-right",
            autoClose: 3000,
          });
        }
      } else {
        toast.error("Failed to create order", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setProcessing(false);
    }
  };

  const isAddressValid = Object.keys(initialAddress).every(
    (key) => {
      const val = address[key];
      return key === "country" || (val && typeof val === "string" && val.trim() !== "");
    }
  );

  // Show loading state while fetching cart
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Loading Checkout</h2>
            <p className="text-slate-500">Please wait while we load your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (uniqueItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center">
              <ShoppingBagIcon sx={{ fontSize: 64 }} className="text-slate-400" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Your Cart is Empty</h2>
            <p className="text-slate-500 mb-8">Add some products to your cart before checkout.</p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-2xl font-semibold"
            >
              <ShoppingBagIcon />
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/cart")}
            className="flex items-center gap-2 text-slate-500 hover:text-brand-primary transition-colors mb-4"
          >
            <ArrowBackIcon sx={{ fontSize: 20 }} />
            <span className="text-sm font-medium">Back to Cart</span>
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800">Checkout</h1>
          <p className="text-slate-500 mt-2">Complete your order</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8">
          <div className="flex items-center justify-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? "text-brand-primary" : "text-slate-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-brand-primary text-white" : "bg-slate-200"}`}>
                1
              </div>
              <span className="font-medium hidden sm:inline">Shipping</span>
            </div>
            <div className={`h-1 w-16 rounded-full ${step >= 2 ? "bg-brand-primary" : "bg-slate-200"}`}></div>
            <div className={`flex items-center gap-2 ${step >= 2 ? "text-brand-primary" : "text-slate-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-brand-primary text-white" : "bg-slate-200"}`}>
                2
              </div>
              <span className="font-medium hidden sm:inline">Payment</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="grid lg:grid-cols-5 gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <LocalShippingIcon className="text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Shipping Details</h2>
                  <p className="text-sm text-slate-500">Where should we deliver your order?</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {Object.keys(initialAddress).map((field) => {
                  const config = fieldConfig[field];
                  const IconComponent = config.icon;
                  return (
                    <div key={field} className={field === "street" ? "md:col-span-2" : ""}>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        {config.label}
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                          <IconComponent sx={{ fontSize: 20 }} />
                        </div>
                        <input
                          name={field}
                          type={config.type || "text"}
                          value={address[field]}
                          onChange={handleChange}
                          placeholder={config.placeholder}
                          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
                          required={field !== "country"}
                          disabled={field === "country"}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center">
                  <ShoppingBagIcon className="text-brand-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
                  <p className="text-sm text-slate-500">{uniqueItems.length} items</p>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto mb-6">
                {uniqueItems.map((item) => (
                  <div key={item.product._id} className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      {getProductImage(item.product) ? (
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBagIcon className="text-slate-300" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-slate-800 text-sm line-clamp-1">{item.product.name}</h4>
                      <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-slate-800 text-sm">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 py-4 border-t border-slate-200">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{(totalPrice || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4 border-t border-slate-200 mb-6">
                <span className="text-lg font-bold text-slate-800">Total</span>
                <span className="text-2xl font-bold text-brand-primary">
                  ₹{(totalPrice || 0).toLocaleString()}
                </span>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={!isAddressValid || processing}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <PaymentIcon />
                    Pay ₹{(totalPrice || 0).toLocaleString()}
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
                <SecurityIcon sx={{ fontSize: 18 }} className="text-green-500" />
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
