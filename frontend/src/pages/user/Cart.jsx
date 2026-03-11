import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, updateCartItem, removeCartItem, clearCart } from "../../features/cart/cartSlice";
import { useTheme } from "../../context/ThemeContext";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import { toast } from "react-toastify";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import SecurityIcon from "@mui/icons-material/Security";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

// Get base URL for images (strip /api suffix if present)
const IMAGE_BASE_URL = (import.meta.env.VITE_API_URL || "https://shrivenkatesantraders.onrender.com/api").replace(/\/api\/?$/, "");

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, totalItems, loading, error } = useSelector((state) => state.cart || {});
  const [updatingItems, setUpdatingItems] = useState({});
  const [removingItems, setRemovingItems] = useState({});

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const cartItems = useMemo(() => {
    if (!items || !Array.isArray(items)) return [];
    return items;
  }, [items]);

  const handleUpdateQuantity = async (productId, quantity, currentQuantity) => {
    if (quantity < 1) return;
    if (quantity === currentQuantity) return;
    
    setUpdatingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await dispatch(updateCartItem({ productId, quantity })).unwrap();
    } catch (err) {
      toast.error(err || "Failed to update quantity");
    } finally {
      setUpdatingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveItem = async (productId, productName) => {
    setRemovingItems((prev) => ({ ...prev, [productId]: true }));
    try {
      await dispatch(removeCartItem(productId)).unwrap();
      toast.info(`${productName} removed from cart`);
    } catch (err) {
      toast.error(err || "Failed to remove item");
    } finally {
      setRemovingItems((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleClearCart = async () => {
    if (window.confirm("Are you sure you want to clear your entire cart?")) {
      try {
        await dispatch(clearCart()).unwrap();
        toast.info("Cart cleared successfully");
      } catch (err) {
        toast.error(err || "Failed to clear cart");
      }
    }
  };

  const getProductImage = (product) => {
    if (!product || typeof product !== 'object') return null;
    if (product.images && product.images.length > 0) {
      const img = product.images[0];
      if (img?.url) return `${IMAGE_BASE_URL}${img.url}`; // Handle object structure from reviews
      if (typeof img === 'string') {
          return img.startsWith("http") ? img : `${IMAGE_BASE_URL}${img}`;
      }
    }
    return null;
  };

  const { darkMode } = useTheme();

  // Loading State
  if (loading && cartItems.length === 0) {
    return (
      <div className={`min-h-[60vh] flex flex-col items-center justify-center relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <AnimatedBackground />
        <div className="w-16 h-16 relative z-10">
          <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className={`mt-4 font-medium font-display animate-pulse z-10 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Loading your cart...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className={`min-h-[60vh] flex flex-col items-center justify-center p-8 relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <AnimatedBackground />
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ErrorOutlineIcon sx={{ fontSize: 40 }} className="text-red-500" />
        </div>
        <h2 className={`text-2xl font-display font-bold mb-2 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Oops! Something went wrong</h2>
        <p className={`mb-6 max-w-md text-center font-display ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>{error}</p>
        <button
          onClick={() => dispatch(fetchCart())}
          className="px-8 py-3 bg-brand-primary text-white rounded-full shadow-lg shadow-brand-primary/20 hover:bg-brand-secondary transition-all duration-300 transform hover:-translate-y-1"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State
  if (cartItems.length === 0) {
    return (
      <div className={`min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <AnimatedBackground />
        <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-inner border z-10 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-brand-primary/10'}`}>
          <ShoppingCartIcon sx={{ fontSize: 64 }} className={darkMode ? 'text-dark-muted' : 'text-brand-primary/30'} />
        </div>
        <h2 className={`text-3xl font-display font-bold mb-3 z-10 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Your Cart is Empty</h2>
        <p className={`mb-8 max-w-md font-display z-10 ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
          Looks like you haven't added anything yet. Discover our premium collection of pipes and motors.
        </p>
        <Link
          to="/products"
          className="group flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-full font-semibold shadow-xl shadow-brand-primary/20 hover:bg-brand-secondary hover:shadow-brand-primary/40 transition-all duration-300 transform hover:-translate-y-1 z-10"
        >
          <ShoppingBagIcon className="group-hover:animate-bounce-subtle" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
      <AnimatedBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className={`text-2xl sm:text-3xl font-display font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Shopping Cart</h1>
          <p className={`mt-1 flex items-center gap-2 text-sm sm:text-base font-display ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
            You have <span className="font-bold text-brand-primary">{totalItems}</span> items in your cart
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className={`self-start sm:self-auto flex items-center gap-2 px-3 sm:px-4 py-2 text-red-500 hover:text-red-600 rounded-full transition-colors text-xs sm:text-sm font-medium border border-transparent ${darkMode ? 'hover:bg-red-500/10 hover:border-red-500/20' : 'hover:bg-red-50 hover:border-red-100'}`}
        >
          <DeleteOutlineIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-3 sm:space-y-4">
          {cartItems.map((item) => {
            // Robust product handling
            const product = item.product;
            const isProductAvailable = product && typeof product === 'object';
            const productId = isProductAvailable ? product._id : (item.product || item._id);
            const itemId = item._id || productId; // Fallback for key

            if (!itemId) return null; // Should ideally not happen

            return (
              <div
                key={itemId}
                className={`group relative rounded-3xl p-3 sm:p-4 md:p-6 border shadow-sm hover:shadow-md transition-all duration-300 backdrop-blur-sm ${
                  darkMode ? 'bg-dark-card/90 border-dark-border hover:border-brand-primary/30' : 'bg-white/90 border-brand-primary/10'
                } ${
                  removingItems[productId] ? "opacity-50 pointer-events-none scale-[0.98]" : ""
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6">
                  {/* Product Image */}
                  <div className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 flex-shrink-0 rounded-2xl overflow-hidden border ${darkMode ? 'bg-dark-bg border-dark-border' : 'bg-brand-cream border-brand-primary/10'}`}>
                    {isProductAvailable ? (
                      getProductImage(product) ? (
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-brand-primary/30">
                          <ShoppingBagIcon sx={{ fontSize: { xs: 24, sm: 32 } }} />
                        </div>
                      )
                    ) : (
                      <div className={`w-full h-full flex flex-col items-center justify-center ${darkMode ? 'bg-dark-bg text-dark-muted' : 'bg-slate-100 text-slate-400'}`}>
                        <ErrorOutlineIcon sx={{ fontSize: 24 }} />
                        <span className="text-[10px] uppercase font-bold mt-1">Unavailable</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4">
                        <div className="min-w-0 flex-1">
                          {isProductAvailable && product.category && (
                            <p className="text-[10px] sm:text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">
                              {product.category}
                            </p>
                          )}
                          <h3 className={`text-base sm:text-lg font-semibold line-clamp-2 sm:truncate ${darkMode ? (isProductAvailable ? 'text-dark-text group-hover:text-brand-primary transition-colors' : 'text-dark-muted italic') : (isProductAvailable ? 'text-brand-dark group-hover:text-brand-primary transition-colors' : 'text-slate-400 italic')}`}>
                            {isProductAvailable ? (
                                <Link to={`/products/${productId}`}>{product.name}</Link>
                            ) : (
                                "Product Unavailable"
                            )}
                          </h3>
                        </div>
                        <p className={`text-base sm:text-lg font-bold flex-shrink-0 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
                           ₹{(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-end justify-between gap-3 sm:gap-4 mt-3 sm:mt-4">
                      {/* Quantity Control */}
                      <div className={`flex items-center gap-2 sm:gap-3 rounded-lg p-1 border ${darkMode ? 'bg-dark-bg border-dark-border' : 'bg-slate-50 border-slate-200'}`}>
                        <button
                          onClick={() => handleUpdateQuantity(productId, item.quantity - 1, item.quantity)}
                          disabled={!isProductAvailable || item.quantity <= 1 || updatingItems[productId]}
                          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md shadow-sm hover:text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all ${darkMode ? 'bg-dark-card text-dark-text hover:bg-dark-hover' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                          <RemoveIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                        </button>
                        <span className={`w-7 sm:w-8 text-center text-sm sm:text-base font-semibold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>
                          {updatingItems[productId] ? (
                            <span className="block w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></span>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(productId, item.quantity + 1, item.quantity)}
                          disabled={!isProductAvailable || updatingItems[productId]}
                          className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-md shadow-sm hover:text-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all ${darkMode ? 'bg-dark-card text-dark-text hover:bg-dark-hover' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
                        >
                          <AddIcon sx={{ fontSize: { xs: 14, sm: 16 } }} />
                        </button>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => handleRemoveItem(productId, isProductAvailable ? product.name : "Item")}
                        disabled={removingItems[productId]}
                        className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium text-red-500 hover:text-red-600 px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50 ${darkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'}`}
                      >
                        <DeleteOutlineIcon sx={{ fontSize: { xs: 16, sm: 18 } }} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4">
          <div className={`rounded-2xl sm:rounded-2xl border shadow-xl p-4 sm:p-6 md:p-8 lg:sticky lg:top-24 backdrop-blur-sm ${darkMode ? 'bg-dark-card/90 border-dark-border shadow-dark-card/50' : 'bg-white/90 border-brand-primary/10 shadow-slate-200/50'}`}>
            <h2 className={`text-lg sm:text-xl font-bold mb-4 sm:mb-6 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className={`flex justify-between ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold">₹{(totalPrice || 0).toLocaleString()}</span>
              </div>
              <div className={`flex justify-between ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className={`flex justify-between ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                <span>Tax Estimate</span>
                <span className={`text-sm ${darkMode ? 'text-dark-muted/60' : 'text-slate-400'}`}>Calculated at checkout</span>
              </div>
            </div>

            <div className={`border-t border-dashed pt-6 mb-8 ${darkMode ? 'border-dark-border' : 'border-slate-200'}`}>
              <div className="flex justify-between items-end">
                <span className={`font-bold text-lg ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Total</span>
                <div className="text-right">
                    <span className="block text-3xl font-bold text-brand-primary bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                    ₹{(totalPrice || 0).toLocaleString()}
                    </span>
                    <span className={`text-xs font-medium ${darkMode ? 'text-dark-muted/60' : 'text-slate-400'}`}>Including all taxes</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-2xl font-bold shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <ShoppingBagIcon sx={{ fontSize: 20 }} />
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className={`w-full flex items-center justify-center gap-2 px-6 py-3 mt-4 font-medium rounded-2xl transition-all ${darkMode ? 'text-dark-muted hover:text-brand-primary hover:bg-dark-hover' : 'text-slate-600 hover:text-brand-primary hover:bg-slate-50'}`}
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
              Continue Shopping
            </Link>

            {/* Trust Badges */}
            <div className={`mt-8 pt-6 border-t grid grid-cols-3 gap-2 ${darkMode ? 'border-dark-border' : 'border-brand-primary/10'}`}>
              <div className="flex flex-col items-center text-center p-2 rounded-lg bg-green-50/50">
                <LocalShippingIcon className="text-green-600 mb-1" sx={{ fontSize: 20 }} />
                <span className="text-[10px] font-semibold text-slate-600">Free<br/>Shipping</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-lg bg-blue-50/50">
                <SecurityIcon className="text-blue-600 mb-1" sx={{ fontSize: 20 }} />
                <span className="text-[10px] font-semibold text-slate-600">Secure<br/>Payment</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-lg bg-purple-50/50">
                <SupportAgentIcon className="text-purple-600 mb-1" sx={{ fontSize: 20 }} />
                <span className="text-[10px] font-semibold text-slate-600">24/7<br/>Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Cart;

