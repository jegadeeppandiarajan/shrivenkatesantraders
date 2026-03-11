import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFeaturedProducts } from "../../features/products/productSlice";
import { useTheme } from "../../context/ThemeContext";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import VerifiedIcon from '@mui/icons-material/Verified';

import PhoneIcon from '@mui/icons-material/Phone';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';

import StorefrontIcon from '@mui/icons-material/Storefront';


import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import BuildIcon from '@mui/icons-material/Build';
import SettingsIcon from '@mui/icons-material/Settings';
import PlumbingIcon from '@mui/icons-material/Plumbing';
import HandymanIcon from '@mui/icons-material/Handyman';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';



// Custom hook for intersection observer animations
const useInView = (options = {}) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [ref, isInView];
};

const Home = () => {
  const dispatch = useDispatch();
  const { featured } = useSelector((state) => state.products);
  const { darkMode } = useTheme();

  // Animation refs
  const [heroRef, heroInView] = useInView();
  const [productsRef, productsInView] = useInView();
  const [reviewsRef, reviewsInView] = useInView();
  const [ctaRef, ctaInView] = useInView();
  const [footerRef, footerInView] = useInView();

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  return (
    <div className={`min-h-screen transition-colors duration-700 ${darkMode ? 'bg-dark-bg text-dark-text' : 'bg-stone-100 text-stone-900'}`}>

      {/* Industrial Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Base gradient */}
        <div className={`absolute inset-0 transition-colors duration-700 ${darkMode ? 'bg-gradient-to-b from-dark-bg via-dark-bg to-dark-card' : 'bg-gradient-to-b from-stone-100 via-white to-stone-100'}`}></div>
        
        {/* Accent glow */}
        <div className={`absolute w-[500px] h-[500px] rounded-full blur-[180px] transition-opacity duration-700 ${darkMode ? 'bg-brand-primary/5 opacity-50' : 'bg-brand-primary/8 opacity-80'} -top-32 -right-32`}></div>
      </div>

      {/* HERO - Industrial Split Layout */}
      <section
        ref={heroRef}
        className={`relative pt-24 sm:pt-32 pb-16 sm:pb-24 overflow-hidden z-10`}
      >
        <div className="relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Text Content */}
            <div className={`transition-all duration-1000 ${heroInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              {/* Tagline */}
              <p className={`uppercase tracking-[0.2em] text-sm font-bold mb-4 ${darkMode ? 'text-brand-primary' : 'text-brand-primary'}`}>
                Industrial Supplies Direct
              </p>

              {/* Main Headline */}
              <h1 className={`mb-6 text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-[1.05] tracking-tight ${darkMode ? 'text-white' : 'text-brand-dark'}`}>
                PIPES & MOTORS
                <br />
                <span className="text-brand-primary">DIRECT</span>
              </h1>

              {/* Description */}
              <p className={`max-w-lg mb-8 text-base sm:text-lg leading-relaxed ${darkMode ? 'text-dark-muted' : 'text-stone-600'}`}>
                Your trusted source for premium industrial pipes, motors, valves, and automation parts. Quality guaranteed, competitive prices, fast delivery across Tamil Nadu.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold text-white uppercase tracking-wider bg-brand-primary hover:bg-brand-secondary transition-all duration-300 hover:scale-105"
                >
                  <ShoppingCartIcon sx={{ fontSize: 20 }} />
                  Browse Catalog
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  to="/contact"
                  className={`group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold uppercase tracking-wider border-2 transition-all duration-300 hover:scale-105 ${darkMode ? 'border-dark-border text-white hover:bg-dark-card hover:border-brand-primary' : 'border-stone-300 text-brand-dark hover:bg-white hover:border-brand-primary'}`}
                >
                  <PhoneIcon sx={{ fontSize: 20 }} />
                  Get Quote
                </Link>
              </div>
            </div>

            {/* Right Side - Stats Grid */}
            <div className={`transition-all duration-1000 delay-200 ${heroInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: "600+", label: "Products Listed", icon: "📦" },
                  { value: "25+", label: "Years Experience", icon: "⭐" },
                  { value: "10K+", label: "Happy Clients", icon: "👥" },
                  { value: "4.9", label: "Customer Rating", icon: "★" },
                ].map((stat, i) => (
                  <div 
                    key={i} 
                    className={`p-6 sm:p-8 transition-all duration-500 hover:-translate-y-1 ${darkMode ? 'bg-dark-card border border-dark-border hover:border-brand-primary/50' : 'bg-white border border-stone-200 hover:border-brand-primary shadow-sm hover:shadow-md'}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    <p className={`text-3xl sm:text-4xl lg:text-5xl font-display font-black mb-2 ${darkMode ? 'text-white' : 'text-brand-dark'}`}>
                      {stat.value}
                    </p>
                    <p className={`uppercase tracking-wider text-xs sm:text-sm font-bold ${darkMode ? 'text-brand-primary' : 'text-brand-primary'}`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Trust Badge */}
              <div className={`mt-4 p-4 flex items-center gap-3 ${darkMode ? 'bg-dark-card/50 border border-dark-border' : 'bg-stone-50 border border-stone-200'}`}>
                <VerifiedIcon className="text-brand-primary" sx={{ fontSize: 24 }} />
                <p className={`text-sm font-medium ${darkMode ? 'text-dark-muted' : 'text-stone-600'}`}>
                  Trusted by <span className={`font-bold ${darkMode ? 'text-white' : 'text-brand-dark'}`}>10,000+ businesses</span> across Tamil Nadu
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS - Industrial Section */}
      <section ref={productsRef} className={`relative z-10 py-16 sm:py-24 transition-colors duration-700 ${darkMode ? 'bg-dark-card/50' : 'bg-white'}`}>
        <div className="max-w-7xl px-4 sm:px-6 lg:px-8 mx-auto">
          <div className={`flex flex-col items-center justify-between mb-10 sm:mb-14 lg:flex-row transition-all duration-700 ${productsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center lg:text-left mb-8 lg:mb-0">
              <p className={`uppercase tracking-[0.2em] text-sm font-bold mb-2 ${darkMode ? 'text-brand-primary' : 'text-brand-primary'}`}>Featured Products</p>
              <h2 className={`text-3xl sm:text-4xl md:text-5xl font-display font-black ${darkMode ? 'text-white' : 'text-brand-dark'}`}>BEST SELLERS</h2>
              <p className={`mt-2 text-base sm:text-lg ${darkMode ? 'text-dark-muted' : 'text-stone-600'}`}>Quality products trusted by thousands</p>
            </div>
            <Link
              to="/products"
              className="group inline-flex items-center gap-3 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white bg-brand-primary hover:bg-brand-secondary transition-all duration-300 hover:scale-105"
            >
              View All Products
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.slice(0, 6).map((product, index) => (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                className={`group relative overflow-hidden transition-all duration-500 hover:-translate-y-2 ${productsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${darkMode ? 'bg-dark-card border border-dark-border hover:border-brand-primary' : 'bg-white border border-stone-200 hover:border-brand-primary shadow-sm hover:shadow-lg'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Product Image Area */}
                <div className={`relative flex items-center justify-center h-48 overflow-hidden ${darkMode ? 'bg-dark-bg' : 'bg-stone-100'}`}>
                  <div className="transition-all duration-300 group-hover:scale-110">
                    {product.category === 'Pipes' && (
                      <div className="p-5 bg-brand-primary">
                        <PlumbingIcon sx={{ fontSize: 48 }} className="text-white" />
                      </div>
                    )}
                    {product.category === 'Motors' && (
                      <div className="p-5 bg-brand-secondary">
                        <SettingsIcon sx={{ fontSize: 48 }} className="text-white" />
                      </div>
                    )}
                    {product.category === 'Valves' && (
                      <div className="p-5 bg-brand-secondary">
                        <BuildIcon sx={{ fontSize: 48 }} className="text-white" />
                      </div>
                    )}
                    {product.category === 'Accessories' && (
                      <div className="p-5 bg-stone-600">
                        <HandymanIcon sx={{ fontSize: 48 }} className="text-white" />
                      </div>
                    )}
                    {product.category === 'Fittings' && (
                      <div className="p-5 bg-stone-600">
                        <HandymanIcon sx={{ fontSize: 48 }} className="text-white" />
                      </div>
                    )}
                    {product.category === 'Pumps' && (
                      <div className="p-5 bg-brand-secondary">
                        <PlumbingIcon sx={{ fontSize: 48 }} className="text-white" />
                      </div>
                    )}
                    {!product.category && (
                      <div className="p-5 bg-brand-secondary">
                        <StorefrontIcon sx={{ fontSize: 48 }} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white bg-brand-primary">
                      {product.discount}% OFF
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold uppercase tracking-wider ${darkMode ? 'bg-dark-card text-dark-muted border border-dark-border' : 'bg-white text-stone-600 border border-stone-200'}`}>
                    {product.category}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5">
                  <h3 className={`mb-2 text-lg font-bold line-clamp-2 transition-colors duration-300 group-hover:text-brand-primary ${darkMode ? 'text-white' : 'text-brand-dark'}`}>
                    {product.name}
                  </h3>
                  <p className={`mb-4 text-sm line-clamp-2 ${darkMode ? 'text-dark-muted' : 'text-stone-600'}`}>
                    {product.description}
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-sm ${i < (product.rating || 4) ? 'text-brand-primary' : `${darkMode ? 'text-dark-muted' : 'text-stone-300'}`}`}>
                        ★
                      </span>
                    ))}
                    <span className={`ml-2 text-xs ${darkMode ? 'text-dark-muted' : 'text-stone-500'}`}>
                      ({product.reviews || 0} reviews)
                    </span>
                  </div>

                  {/* Price & Stock */}
                  <div className={`flex items-center justify-between pt-4 border-t ${darkMode ? 'border-dark-border' : 'border-stone-200'}`}>
                    <div>
                      <p className="text-2xl font-black text-brand-primary">
                        ₹{product.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-brand-primary/10 text-brand-primary' : 'bg-red-100 text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </div>
                  </div>

                  {/* View Product Button */}
                  <button className="flex items-center justify-center w-full gap-2 py-3 mt-4 text-sm font-bold uppercase tracking-wider text-white bg-brand-primary hover:bg-brand-secondary transition-all duration-300">
                    <ShoppingCartIcon sx={{ fontSize: 18 }} />
                    View Details
                  </button>
                </div>
              </Link>
            ))}
          </div>
          {!featured.length && (
            <div className={`py-16 text-center ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white border border-stone-200'}`}>
              <div className="mb-4">
                <RocketLaunchIcon sx={{ fontSize: 64 }} className="text-brand-primary" />
              </div>
              <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-brand-dark'}`}>Featured products coming soon!</p>
              <p className={`mt-2 ${darkMode ? 'text-dark-muted' : 'text-stone-600'}`}>Stay tuned for amazing deals</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA - Industrial Section */}
      <section ref={ctaRef} className={`relative z-10 py-16 sm:py-24 overflow-hidden transition-colors duration-700 ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        
        <div className={`relative max-w-5xl px-4 sm:px-6 lg:px-8 mx-auto transition-all duration-1000 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Text */}
            <div>
              <p className="uppercase tracking-[0.2em] text-sm font-bold text-brand-primary mb-4">
                Get Started Today
              </p>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                UPGRADE YOUR
                <br />
                <span className="text-brand-primary">SUPPLY CHAIN</span>
              </h2>
              <p className={`text-lg mb-8 ${darkMode ? 'text-white/70' : 'text-slate-600'}`}>
                Join 10,000+ businesses that trust Shri Venkatesan Traders for premium industrial supplies delivered fast.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/register"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold uppercase tracking-wider text-white bg-brand-primary hover:bg-brand-secondary transition-all duration-300 rounded-xl"
                >
                  <RocketLaunchIcon sx={{ fontSize: 20 }} className="group-hover:rotate-12 transition-transform" />
                  Create Free Account
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </Link>
                <Link
                  to="/contact"
                  className={`group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-bold uppercase tracking-wider border-2 transition-all duration-300 rounded-xl ${darkMode ? 'border-white/30 text-white hover:border-brand-primary hover:bg-brand-primary/10' : 'border-slate-300 text-slate-700 hover:border-brand-primary hover:bg-brand-primary/5 hover:text-brand-primary'}`}
                >
                  <PhoneIcon sx={{ fontSize: 20 }} className="group-hover:scale-110 transition-transform" />
                  Contact Sales
                </Link>
              </div>
            </div>

            {/* Right - Trust Stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "ISO Certified", icon: EmojiEventsIcon, color: "text-amber-500" },
                { label: "Secure Payments", icon: SecurityIcon, color: "text-emerald-500" },
                { label: "Free Support", icon: SupportAgentIcon, color: "text-blue-500" },
                { label: "Fast Delivery", icon: LocalShippingIcon, color: "text-brand-primary" }
              ].map((badge, i) => {
                const IconComponent = badge.icon;
                return (
                <div key={i} className={`p-6 border rounded-2xl ${darkMode ? 'border-dark-border bg-dark-card/50 hover:border-brand-primary/50' : 'border-slate-200 bg-white hover:border-brand-primary/50 shadow-sm'} transition-all duration-300 flex flex-col items-center sm:items-start text-center sm:text-left group`}>
                  <div className={`mb-3 p-3 rounded-xl transition-colors duration-300 ${darkMode ? 'bg-dark-hover group-hover:bg-dark-border/80' : 'bg-slate-50 group-hover:bg-brand-primary/10'}`}>
                    <IconComponent sx={{ fontSize: 32 }} className={`${badge.color} group-hover:scale-110 transition-transform duration-300`} />
                  </div>
                  <p className={`text-sm font-bold uppercase tracking-wider ${darkMode ? 'text-white' : 'text-slate-800'}`}>{badge.label}</p>
                </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER INFO - Industrial Section */}
      <section ref={footerRef} className={`py-16 border-t transition-colors duration-700 ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-stone-100 border-stone-200'}`}>
        <div className={`max-w-7xl px-4 mx-auto transition-all duration-700 ${footerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: PhoneIcon, title: "24/7 Support", desc: "Customer service always ready", stat: "100%" },
              { icon: DeliveryDiningIcon, title: "Tamil Nadu Delivery", desc: "Serving all districts", stat: "50+" },
              { icon: VerifiedIcon, title: "Quality Guaranteed", desc: "All products certified", stat: "ISO" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className={`group p-6 flex items-start gap-5 transition-all duration-300 hover:-translate-y-1 ${darkMode ? 'bg-dark-bg border border-dark-border hover:border-brand-primary/50' : 'bg-white border border-stone-200 hover:border-brand-primary/50 shadow-sm hover:shadow-md'} ${footerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="p-3 bg-brand-primary">
                    <Icon sx={{ fontSize: 24 }} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-brand-dark'}`}>{item.title}</p>
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-stone-600'}`}>{item.desc}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-brand-primary">{item.stat}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
