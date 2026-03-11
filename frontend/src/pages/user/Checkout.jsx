import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createOrder, createCheckoutSession } from "../../features/orders/orderSlice";
import { fetchCart } from "../../features/cart/cartSlice";
import { useTheme } from "../../context/ThemeContext";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import { toast } from "react-toastify";
import api from "../../services/api";
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
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

// Get base URL for images (strip /api suffix if present)
const API_URL = (import.meta.env.VITE_API_URL || "https://shrivenkatesantraders.onrender.com/api").replace(/\/api\/?$/, "");

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
  const [loyaltyDiscount, setLoyaltyDiscount] = useState({ tier: 'Bronze', discount: 0 });

  useEffect(() => {
    dispatch(fetchCart());
    // Fetch user's loyalty tier and discount
    const fetchLoyaltyDiscount = async () => {
      try {
        const { data } = await api.get("/users/analytics");
        if (data.success) {
          setLoyaltyDiscount({
            tier: data.data.tier,
            discount: data.data.discount
          });
        }
      } catch (error) {
        console.log("Could not fetch loyalty discount");
      }
    };
    fetchLoyaltyDiscount();
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

  // Calculate discount amount and final total
  const discountAmount = useMemo(() => {
    return Math.round((totalPrice || 0) * (loyaltyDiscount.discount / 100));
  }, [totalPrice, loyaltyDiscount.discount]);

  const finalTotal = useMemo(() => {
    return (totalPrice || 0) - discountAmount;
  }, [totalPrice, discountAmount]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setProcessing(true);

    const payload = {
      items: uniqueItems.map((item) => ({ productId: item.product._id, quantity: item.quantity })),
      shippingAddress: address,
      shippingCost: 0,
      tax: 0,
      discount: discountAmount,
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

  const { darkMode } = useTheme();

  // Show loading state while fetching cart
  if (loading) {
    return (
      <div className={`min-h-screen py-12 px-4 relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <AnimatedBackground />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className={`rounded-3xl shadow-xl p-12 text-center backdrop-blur-sm ${darkMode ? 'bg-dark-card/90 border border-dark-border' : 'bg-white/90 border border-brand-primary/10'}`}>
            <div className="w-16 h-16 mx-auto mb-6 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            <h2 className={`text-2xl font-display font-bold mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Loading Checkout</h2>
            <p className={`font-display ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Please wait while we load your cart...</p>
          </div>
        </div>
      </div>
    );
  }

  if (uniqueItems.length === 0) {
    return (
      <div className={`min-h-screen py-12 px-4 relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <AnimatedBackground />
        <div className="max-w-2xl mx-auto relative z-10">
          <div className={`rounded-3xl shadow-xl p-12 text-center backdrop-blur-sm ${darkMode ? 'bg-dark-card/90 border border-dark-border' : 'bg-white/90 border border-brand-primary/10'}`}>
            <div className={`w-32 h-32 mx-auto mb-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <ShoppingBagIcon sx={{ fontSize: 64 }} className={darkMode ? 'text-dark-muted' : 'text-brand-primary/30'} />
            </div>
            <h2 className={`text-3xl font-display font-bold mb-4 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Your Cart is Empty</h2>
            <p className={`mb-8 font-display ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Add some products to your cart before checkout.</p>
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-full font-semibold hover:bg-brand-secondary transition-all"
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
    <div className={`min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
      <AnimatedBackground />
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => navigate("/cart")}
            className={`flex items-center gap-1.5 sm:gap-2 transition-colors mb-3 sm:mb-4 ${darkMode ? 'text-dark-muted hover:text-brand-primary' : 'text-brand-slate hover:text-brand-primary'}`}
          >
            <ArrowBackIcon sx={{ fontSize: { xs: 18, sm: 20 } }} />
            <span className="text-xs sm:text-sm font-medium">Back to Cart</span>
          </button>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-display font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Checkout</h1>
          <p className={`mt-1 sm:mt-2 text-sm sm:text-base font-display ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Complete your order</p>
        </div>

        {/* Progress Steps */}
        <div className={`rounded-2xl shadow-sm p-3 sm:p-4 mb-6 sm:mb-8 backdrop-blur-sm ${darkMode ? 'bg-dark-card/90 border border-dark-border' : 'bg-white/90 border border-brand-primary/10'}`}>
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className={`flex items-center gap-1.5 sm:gap-2 ${step >= 1 ? "text-brand-primary" : "text-brand-slate"}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm rounded-full flex items-center justify-center font-semibold ${step >= 1 ? "bg-brand-primary text-white" : "bg-brand-primary/20"}`}>
                1
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base hidden xs:inline">Shipping</span>
            </div>
            <div className={`h-1 w-8 sm:w-12 md:w-16 rounded-full ${step >= 2 ? "bg-brand-primary" : "bg-brand-primary/20"}`}></div>
            <div className={`flex items-center gap-1.5 sm:gap-2 ${step >= 2 ? "text-brand-primary" : "text-brand-slate"}`}>
              <div className={`w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm rounded-full flex items-center justify-center font-semibold ${step >= 2 ? "bg-brand-primary text-white" : "bg-brand-primary/20"}`}>
                2
              </div>
              <span className="font-medium text-xs sm:text-sm md:text-base hidden xs:inline">Payment</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleCheckout} className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Shipping Form */}
          <div className="lg:col-span-3">
            <div className={`rounded-2xl shadow-sm p-4 sm:p-6 md:p-8 backdrop-blur-sm ${darkMode ? 'bg-dark-card/90 border border-dark-border' : 'bg-white/90 border border-brand-primary/10'}`}>
              <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center flex-shrink-0 ${darkMode ? 'bg-brand-primary/20' : 'bg-brand-primary/10'}`}>
                  <LocalShippingIcon className="text-brand-primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </div>
                <div>
                  <h2 className={`text-lg sm:text-xl font-display font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Shipping Details</h2>
                  <p className={`text-xs sm:text-sm font-display ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Where should we deliver your order?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {Object.keys(initialAddress).map((field) => {
                  const config = fieldConfig[field];
                  const IconComponent = config.icon;
                  return (
                    <div key={field} className={field === "street" ? "sm:col-span-2" : ""}>
                      <label className={`block text-xs sm:text-sm font-medium mb-1.5 sm:mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
                        {config.label}
                      </label>
                      <div className="relative">
                        <div className={`absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
                          <IconComponent sx={{ fontSize: { xs: 18, sm: 20 } }} />
                        </div>
                        <input
                          name={field}
                          type={config.type || "text"}
                          value={address[field]}
                          onChange={handleChange}
                          placeholder={config.placeholder}
                          className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base rounded-full border-2 outline-none transition-all ${darkMode ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20' : 'border-brand-primary/20 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 bg-white'}`}
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
            <div className={`rounded-2xl shadow-sm p-4 sm:p-6 sticky top-24 backdrop-blur-sm ${darkMode ? 'bg-dark-card/90 border border-dark-border' : 'bg-white/90 border border-brand-primary/10'}`}>
              <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center ${darkMode ? 'bg-brand-primary/20' : 'bg-brand-primary/10'}`}>
                  <ShoppingBagIcon className="text-brand-primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
                </div>
                <div>
                  <h2 className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Order Summary</h2>
                  <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>{uniqueItems.length} items</p>
                </div>
              </div>

              {/* Cart Items */}
              <div className="space-y-3 sm:space-y-4 max-h-64 overflow-y-auto mb-6">
                {uniqueItems.map((item) => (
                  <div key={item.product._id} className={`flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-slate-50'}`}>
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 ${darkMode ? 'bg-dark-hover' : 'bg-white'}`}>
                      {getProductImage(item.product) ? (
                        <img
                          src={getProductImage(item.product)}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBagIcon className={darkMode ? 'text-dark-muted' : 'text-slate-300'} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm line-clamp-1 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{item.product.name}</h4>
                      <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Qty: {item.quantity}</p>
                    </div>
                    <p className={`font-semibold text-sm ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className={`space-y-3 py-4 border-t ${darkMode ? 'border-dark-border' : 'border-slate-200'}`}>
                <div className={`flex justify-between ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                  <span>Subtotal</span>
                  <span>₹{(totalPrice || 0).toLocaleString()}</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                  <span>Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className={`flex justify-between ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                  <span>Tax</span>
                  <span>₹0</span>
                </div>
                {loyaltyDiscount.discount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2 text-green-600">
                      <LocalOfferIcon sx={{ fontSize: 18 }} />
                      <span className="font-medium">{loyaltyDiscount.tier} Discount ({loyaltyDiscount.discount}%)</span>
                    </span>
                    <span className="text-green-600 font-semibold">-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
              </div>

              {/* Loyalty Tier Badge */}
              {loyaltyDiscount.discount > 0 && (
                <div className="mb-4 p-3 bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl border border-amber-200">
                  <div className="flex items-center gap-2">
                    <EmojiEventsIcon sx={{ fontSize: 20 }} className="text-amber-500" />
                    <span className="text-sm font-semibold text-amber-700">
                      You're saving ₹{discountAmount.toLocaleString()} as a {loyaltyDiscount.tier} member!
                    </span>
                  </div>
                </div>
              )}

              <div className={`flex justify-between items-center py-4 border-t mb-6 ${darkMode ? 'border-dark-border' : 'border-slate-200'}`}>
                <span className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Total</span>
                <div className="text-right">
                  {loyaltyDiscount.discount > 0 && (
                    <span className="text-sm text-slate-400 line-through block">₹{(totalPrice || 0).toLocaleString()}</span>
                  )}
                  <span className="text-2xl font-bold text-brand-primary">
                    ₹{finalTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={!isAddressValid || processing}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Redirecting to Stripe...
                  </>
                ) : (
                  <>
                    <PaymentIcon />
                    Pay ₹{finalTotal.toLocaleString()}
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className={`mt-6 flex items-center justify-center gap-2 text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
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

