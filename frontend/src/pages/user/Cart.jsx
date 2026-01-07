import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, updateCartItem, removeCartItem, clearCart } from "../../features/cart/cartSlice";
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

const IMAGE_BASE_URL = "http://localhost:5000";

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

  // Loading State
  if (loading && cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 relative">
          <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-brand-dark font-medium animate-pulse">Loading your cart...</p>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <ErrorOutlineIcon sx={{ fontSize: 40 }} className="text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Oops! Something went wrong</h2>
        <p className="text-slate-500 mb-6 max-w-md text-center">{error}</p>
        <button
          onClick={() => dispatch(fetchCart())}
          className="px-8 py-3 bg-brand-primary text-white rounded-xl shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all duration-300 transform hover:-translate-y-1"
        >
          Try Again
        </button>
      </div>
    );
  }

  // Empty State
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-32 h-32 bg-gradient-to-br from-slate-50 to-slate-100 rounded-full flex items-center justify-center mb-6 shadow-iner border border-slate-100">
          <ShoppingCartIcon sx={{ fontSize: 64 }} className="text-slate-300" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-3">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 max-w-md">
          Looks like you haven't added anything yet. Discover our premium collection of pipes and motors.
        </p>
        <Link
          to="/products"
          className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-xl font-semibold shadow-xl shadow-brand-primary/20 hover:shadow-brand-primary/40 transition-all duration-300 transform hover:-translate-y-1"
        >
          <ShoppingBagIcon className="group-hover:animate-bounce-subtle" />
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Shopping Cart</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            You have <span className="font-bold text-brand-primary">{totalItems}</span> items in your cart
          </p>
        </div>
        <button
          onClick={handleClearCart}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-red-100"
        >
          <DeleteOutlineIcon sx={{ fontSize: 18 }} />
          Clear Cart
        </button>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
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
                className={`group relative bg-white rounded-2xl p-4 sm:p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 ${
                  removingItems[productId] ? "opacity-50 pointer-events-none scale-[0.98]" : ""
                }`}
              >
                <div className="flex gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                    {isProductAvailable ? (
                      getProductImage(product) ? (
                        <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <ShoppingBagIcon sx={{ fontSize: 32 }} />
                        </div>
                      )
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 text-slate-400">
                        <ErrorOutlineIcon sx={{ fontSize: 24 }} />
                        <span className="text-[10px] uppercase font-bold mt-1">Unavailable</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          {isProductAvailable && product.category && (
                            <p className="text-xs font-bold text-brand-primary uppercase tracking-wider mb-1">
                              {product.category}
                            </p>
                          )}
                          <h3 className={`text-lg font-semibold text-slate-800 truncate ${isProductAvailable ? "group-hover:text-brand-primary transition-colors" : "text-slate-400 italic"}`}>
                            {isProductAvailable ? (
                                <Link to={`/products/${productId}`}>{product.name}</Link>
                            ) : (
                                "Product Unavailable"
                            )}
                          </h3>
                        </div>
                        <p className="text-lg font-bold text-slate-800 flex-shrink-0">
                           ₹{(item.price || 0).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                      {/* Quantity Control */}
                      <div className="flex items-center gap-3 bg-slate-50 rounded-lg p-1 border border-slate-200">
                        <button
                          onClick={() => handleUpdateQuantity(productId, item.quantity - 1, item.quantity)}
                          disabled={!isProductAvailable || item.quantity <= 1 || updatingItems[productId]}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:text-brand-primary hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <RemoveIcon sx={{ fontSize: 16 }} />
                        </button>
                        <span className="w-8 text-center font-semibold text-slate-700">
                          {updatingItems[productId] ? (
                            <span className="block w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></span>
                          ) : (
                            item.quantity
                          )}
                        </span>
                        <button
                          onClick={() => handleUpdateQuantity(productId, item.quantity + 1, item.quantity)}
                          disabled={!isProductAvailable || updatingItems[productId]}
                          className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-slate-600 shadow-sm hover:text-brand-primary hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                          <AddIcon sx={{ fontSize: 16 }} />
                        </button>
                      </div>

                      {/* Actions */}
                      <button
                        onClick={() => handleRemoveItem(productId, isProductAvailable ? product.name : "Item")}
                        disabled={removingItems[productId]}
                        className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
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
          <div className="bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/50 p-6 sm:p-8 sticky top-24">
            <h2 className="text-xl font-bold text-slate-800 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold">₹{(totalPrice || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax Estimate</span>
                <span className="text-slate-400 text-sm">Calculated at checkout</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-slate-800 font-bold text-lg">Total</span>
                <div className="text-right">
                    <span className="block text-3xl font-bold text-brand-primary bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-brand-dark">
                    ₹{(totalPrice || 0).toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">Including all taxes</span>
                </div>
              </div>
            </div>

            <Link
              to="/checkout"
              className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-dark text-white rounded-xl font-bold shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              <ShoppingBagIcon sx={{ fontSize: 20 }} />
              Proceed to Checkout
            </Link>

            <Link
              to="/products"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 mt-4 text-slate-600 hover:text-brand-primary font-medium hover:bg-slate-50 rounded-xl transition-all"
            >
              <ArrowBackIcon sx={{ fontSize: 16 }} />
              Continue Shopping
            </Link>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-3 gap-2">
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
  );
};

export default Cart;
