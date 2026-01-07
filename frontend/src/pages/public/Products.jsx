import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchProducts } from "../../features/products/productSlice";
import { addCartItem } from "../../features/cart/cartSlice";
import { useTheme } from "../../context/ThemeContext";
import { toast } from "react-toastify";
import ImageIcon from '@mui/icons-material/Image';
import StarIcon from '@mui/icons-material/Star';

const categories = ["Pipes", "Motors", "Accessories", "Fittings", "Valves", "Pumps"];
const IMAGE_BASE_URL = "http://localhost:5000";

const ProductSkeleton = ({ darkMode }) => (
  <div className={`rounded-3xl border shadow-lg overflow-hidden ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-slate-100'}`}>
    <div className={`h-48 ${darkMode ? 'bg-dark-bg' : 'bg-slate-100'} animate-pulse`}></div>
    <div className="p-6 space-y-3">
      <div className={`h-4 w-20 rounded-full animate-pulse ${darkMode ? 'bg-dark-bg' : 'bg-slate-200'}`}></div>
      <div className={`h-6 w-3/4 rounded-lg animate-pulse ${darkMode ? 'bg-dark-bg' : 'bg-slate-200'}`}></div>
      <div className={`h-8 w-1/3 rounded-lg animate-pulse ${darkMode ? 'bg-dark-bg' : 'bg-slate-200'}`}></div>
      <div className={`h-4 w-full rounded-lg animate-pulse ${darkMode ? 'bg-dark-bg' : 'bg-slate-200'}`}></div>
      <div className={`h-4 w-2/3 rounded-lg animate-pulse ${darkMode ? 'bg-dark-bg' : 'bg-slate-200'}`}></div>
    </div>
  </div>
);

const Products = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { darkMode } = useTheme();
  const { items, loading } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({ search: "", category: "" });
  const [isVisible, setIsVisible] = useState(false);
  const [addingToCart, setAddingToCart] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProducts({
        search: filters.search || undefined,
        category: filters.category || undefined,
      })
    );
    setIsVisible(true);
  }, [dispatch, filters]);

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.info("Please login to add items to cart", {
        position: "top-center",
        autoClose: 2000,
      });
      navigate("/login");
      return;
    }

    if (product.stock === 0) {
      toast.error("This product is out of stock", {
        position: "top-right",
        autoClose: 2000,
      });
      return;
    }

    setAddingToCart(product._id);
    try {
      await dispatch(addCartItem({ productId: product._id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart!`, {
        position: "top-right",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error(error || "Failed to add item to cart", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <section className={`min-h-screen ${darkMode ? 'bg-dark-bg' : 'bg-gradient-to-b from-slate-50 to-white'}`}>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-brand-gold to-brand-primary py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand-secondary rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center animate-fade-in-up">
            <p className="text-white/80 text-sm uppercase tracking-[0.5em] font-semibold">Industrial Supplies</p>
            <h1 className="text-4xl md:text-5xl font-bold text-white mt-4">Product Catalog</h1>
            <p className="text-white/70 mt-4 max-w-2xl mx-auto">
              Browse our extensive collection of industrial pipes, motors, and accessories. Quality products for all your needs.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filter Section */}
        <div className={`rounded-3xl border p-6 shadow-xl -mt-8 relative z-20 mb-10 transition-all duration-700 ${
          darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-slate-100'
        } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <svg className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="search"
                placeholder="Search pipes, motors, accessories..."
                value={filters.search}
                onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
                className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none transition-all text-lg ${
                  darkMode 
                    ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                    : 'border-slate-100 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/10'
                }`}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilters((prev) => ({ ...prev, category: "" }))}
                className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                  !filters.category
                    ? "bg-brand-primary text-white shadow-lg"
                    : darkMode 
                      ? 'bg-dark-bg text-dark-text hover:bg-dark-hover' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat }))}
                  className={`px-5 py-3 rounded-xl font-semibold transition-all ${
                    filters.category === cat
                      ? "bg-brand-primary text-white shadow-lg"
                      : darkMode 
                        ? 'bg-dark-bg text-dark-text hover:bg-dark-hover' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <div className={`mt-4 flex items-center justify-between text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-brand-accent rounded-full animate-pulse"></span>
              {items.length} products found
            </span>
            {filters.category && (
              <button
                onClick={() => setFilters({ search: "", category: "" })}
                className="text-brand-primary font-semibold hover:underline flex items-center gap-1"
              >
                Clear filters
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <ProductSkeleton key={i} darkMode={darkMode} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((product, index) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className={`card-hover group rounded-3xl border shadow-lg overflow-hidden transition-all duration-500 ${
                  darkMode ? 'bg-dark-card border-dark-border hover:border-brand-primary/50' : 'bg-white border-slate-100'
                } ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`h-48 flex items-center justify-center relative overflow-hidden ${darkMode ? 'bg-dark-bg' : 'bg-gradient-to-br from-slate-100 to-slate-50'}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  {product.images && product.images.length > 0 ? (
                    <img
                      src={`${IMAGE_BASE_URL}${product.images[0].url}`}
                      alt={product.images[0].alt || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon sx={{ fontSize: 72 }} className={darkMode ? 'text-dark-muted' : 'text-slate-300'} />
                  )}
                  {product.featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-brand-secondary text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <StarIcon sx={{ fontSize: 12 }} />
                      Featured
                    </div>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                      Low Stock
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-slate-700 text-white text-xs font-bold rounded-full">
                      Out of Stock
                    </div>
                  )}
                  {product.ratings?.average > 0 && (
                    <div className={`absolute bottom-4 left-4 px-2 py-1 backdrop-blur-sm text-xs font-semibold rounded-lg flex items-center gap-1 ${darkMode ? 'bg-dark-card/90 text-dark-text' : 'bg-white/90 text-slate-800'}`}>
                      <StarIcon sx={{ fontSize: 14, color: '#f59e0b' }} />
                      {product.ratings.average.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-brand-primary/10 text-brand-primary text-xs font-semibold rounded-full">
                      {product.category}
                    </span>
                  </div>
                  <h4 className={`text-xl font-bold group-hover:text-brand-primary transition-colors line-clamp-1 ${darkMode ? 'text-dark-text' : 'text-slate-900'}`}>
                    {product.name}
                  </h4>
                  <p className="text-2xl font-bold text-brand-primary mt-3">₹ {product.price.toLocaleString()}</p>
                  <p className={`text-sm mt-3 line-clamp-2 ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>{product.shortDescription || product.description}</p>
                  <div className={`mt-5 pt-5 border-t ${darkMode ? 'border-dark-border' : 'border-slate-100'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-sm font-semibold ${product.stock === 0 ? "text-red-500" : product.stock < 10 ? "text-red-500" : darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>
                        {product.stock === 0 ? "Out of Stock" : product.stock < 10 ? `Only ${product.stock} left!` : `${product.stock} in stock`}
                      </span>
                      <span className="text-brand-primary font-semibold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                        Details
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={addingToCart === product._id || product.stock === 0}
                      className="w-full py-2.5 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-gold transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                      {addingToCart === product._id ? (
                        <>
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Adding...
                        </>
                      ) : product.stock === 0 ? (
                        "Out of Stock"
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${darkMode ? 'bg-dark-card' : 'bg-slate-100'}`}>
              <svg className={`w-12 h-12 ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className={`text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>No products found</h3>
            <p className={`mt-2 ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>Try adjusting your search or filter to find what you're looking for.</p>
            <button
              onClick={() => setFilters({ search: "", category: "" })}
              className="mt-6 px-6 py-3 bg-brand-primary text-white font-semibold rounded-xl hover:bg-brand-gold transition-colors"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;
