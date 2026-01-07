import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchFeaturedProducts } from "../../features/products/productSlice";
import { useTheme } from "../../context/ThemeContext";
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedIcon from '@mui/icons-material/Verified';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import PhoneIcon from '@mui/icons-material/Phone';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import StorefrontIcon from '@mui/icons-material/Storefront';
import SpeedIcon from '@mui/icons-material/Speed';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import StarIcon from '@mui/icons-material/Star';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

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
  const [statsRef, statsInView] = useInView();
  const [categoriesRef, categoriesInView] = useInView();
  const [featuresRef, featuresInView] = useInView();
  const [productsRef, productsInView] = useInView();
  const [galleryRef, galleryInView] = useInView();
  const [reviewsRef, reviewsInView] = useInView();
  const [trustRef, trustInView] = useInView();
  const [ctaRef, ctaInView] = useInView();
  const [footerRef, footerInView] = useInView();

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
  }, [dispatch]);

  const stats = [
    { icon: TrendingUpIcon, value: "10,000+", label: "Businesses Served", color: "from-amber-500 to-orange-500" },
    { icon: StorefrontIcon, value: "5,000+", label: "Products", color: "from-blue-500 to-cyan-500" },
    { icon: SpeedIcon, value: "24h", label: "Dispatch", color: "from-green-500 to-emerald-500" },
    { icon: WorkspacePremiumIcon, value: "25+", label: "Years", color: "from-purple-500 to-pink-500" }
  ];

  const features = [
    { title: "Premium Quality", desc: "ISO certified pipes, motors & valves from trusted manufacturers", icon: CheckCircleIcon, gradient: "from-amber-500 to-orange-600" },
    { title: "Fast Delivery", desc: "Dispatch within 24 hours across India with tracking support", icon: LocalShippingIcon, gradient: "from-blue-500 to-cyan-600" },
    { title: "Expert Support", desc: "Dedicated technical team ready to assist 24/7", icon: PhoneIcon, gradient: "from-green-500 to-emerald-600" }
  ];

  const categories = [
    { title: "Pipes", count: "500+", icon: "🔧", gradient: "from-amber-400 to-orange-500" },
    { title: "Motors", count: "300+", icon: "⚙️", gradient: "from-blue-400 to-cyan-500" },
    { title: "Valves", count: "200+", icon: "🔩", gradient: "from-green-400 to-emerald-500" },
    { title: "Fittings", count: "150+", icon: "📌", gradient: "from-purple-400 to-pink-500" }
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? 'bg-dark-bg text-dark-text' : 'bg-slate-50 text-slate-900'}`}>
      {/* HERO - Enhanced with Animations */}
      <section 
        ref={heroRef}
        className={`relative pt-24 pb-40 overflow-hidden border-b ${darkMode ? 'bg-gradient-to-br from-slate-900 via-brand-gold/10 to-slate-900 border-dark-border' : 'bg-gradient-to-br from-slate-50 via-brand-primary/5 to-slate-100 border-slate-200'}`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute w-[500px] h-[500px] rounded-full blur-3xl animate-blob ${darkMode ? 'bg-brand-primary/10' : 'bg-brand-primary/20'} -top-32 -right-32`}></div>
          <div className={`absolute w-[400px] h-[400px] rounded-full blur-3xl animate-blob animation-delay-2000 ${darkMode ? 'bg-brand-gold/10' : 'bg-brand-gold/20'} -bottom-20 -left-32`}></div>
          <div className={`absolute w-[300px] h-[300px] rounded-full blur-3xl animate-blob animation-delay-4000 ${darkMode ? 'bg-brand-secondary/10' : 'bg-brand-secondary/20'} top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full animate-float ${darkMode ? 'bg-brand-primary/30' : 'bg-brand-primary/40'}`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i * 0.5}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl px-4 mx-auto">
          <div className="grid items-center gap-16 py-12 lg:grid-cols-2">
            {/* Left Content */}
            <div className={`text-center lg:text-left transition-all duration-1000 ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Badge */}
              <div className={`inline-flex items-center gap-2 px-5 py-2.5 mb-8 font-bold border rounded-full backdrop-blur-md transition-all duration-500 hover:scale-105 ${darkMode ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' : 'bg-brand-primary/10 border-brand-primary/30 text-brand-primary'}`}>
                <AutoAwesomeIcon sx={{ fontSize: 18 }} className="animate-pulse" />
                <span className="text-sm">Industry Leaders Since 1998</span>
              </div>

              {/* Headline */}
              <h1 className={`mb-8 text-5xl font-black leading-tight lg:text-7xl tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                <span className="block overflow-hidden">
                  <span className={`block transition-all duration-700 delay-100 ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    Premium Industrial
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <span className={`block bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey bg-clip-text text-transparent transition-all duration-700 delay-300 ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                    Supply Solutions
                  </span>
                </span>
              </h1>

              {/* Description */}
              <p className={`max-w-xl mb-10 text-xl font-medium leading-relaxed transition-all duration-700 delay-500 ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'} ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                High-quality pipes, motors, valves & automation parts delivered with precision to <span className="font-bold text-brand-primary">10,000+</span> businesses across India.
              </p>

              {/* CTA Buttons */}
              <div className={`flex flex-col gap-4 sm:flex-row transition-all duration-700 delay-700 ${heroInView ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}>
                <Link 
                  to="/products" 
                  className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold text-white rounded-2xl bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/50 transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <RocketLaunchIcon sx={{ fontSize: 22 }} className="group-hover:rotate-12 transition-transform" />
                    Shop Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-honey via-brand-gold to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </Link>
                <Link 
                  to="/contact" 
                  className={`group inline-flex items-center justify-center gap-3 px-10 py-5 text-lg font-bold rounded-2xl border-2 transition-all duration-500 hover:scale-105 active:scale-95 ${darkMode ? 'bg-dark-card/50 border-brand-primary/50 text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary' : 'bg-white/80 border-brand-primary/30 text-brand-primary hover:bg-brand-primary/5 hover:border-brand-primary'}`}
                >
                  <PhoneIcon sx={{ fontSize: 22 }} className="group-hover:animate-wiggle" />
                  Get a Quote
                </Link>
              </div>
            </div>

            {/* Right - Animated Visual */}
            <div className={`flex items-center justify-center transition-all duration-1000 delay-300 ${heroInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                {/* Main Card */}
                <div className={`relative p-12 rounded-[2rem] shadow-2xl backdrop-blur-xl transition-all duration-500 hover:scale-105 ${darkMode ? 'bg-dark-card/80 border border-dark-border' : 'bg-white/80 border border-slate-200'}`}>
                  <div className="text-center">
                    <div className="text-8xl mb-6 animate-float">🏭</div>
                    <p className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Industrial Excellence</p>
                    <p className={`font-medium ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Quality • Speed • Trust</p>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className={`absolute -top-6 -left-12 p-4 rounded-2xl shadow-xl animate-float ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white border border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500">
                      <CheckCircleIcon sx={{ fontSize: 20 }} className="text-white" />
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>ISO Certified</p>
                      <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Quality Assured</p>
                    </div>
                  </div>
                </div>

                <div className={`absolute -bottom-4 -right-8 p-4 rounded-2xl shadow-xl animate-float animation-delay-1000 ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white border border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500">
                      <LocalShippingIcon sx={{ fontSize: 20 }} className="text-white" />
                    </div>
                    <div>
                      <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>24h Dispatch</p>
                      <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Pan-India</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS - Enhanced with Animations */}
      <section ref={statsRef} className={`-mt-16 relative z-20 ${darkMode ? 'bg-transparent' : 'bg-transparent'}`}>
        <div className="max-w-6xl px-4 mx-auto">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={i} 
                  className={`group p-6 rounded-2xl border backdrop-blur-xl transition-all duration-500 transform hover:-translate-y-3 hover:shadow-2xl cursor-pointer ${statsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${darkMode ? 'bg-dark-card/90 border-dark-border hover:border-brand-primary' : 'bg-white/90 border-slate-200 hover:border-brand-primary'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                      <Icon sx={{ fontSize: 28 }} className="text-white" />
                    </div>
                    <div>
                      <p className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>{stat.value}</p>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES - Enhanced */}
      <section ref={categoriesRef} className={`py-28 ${darkMode ? 'bg-dark-bg' : 'bg-slate-50'}`}>
        <div className="max-w-6xl px-4 mx-auto">
          <div className={`mb-20 text-center transition-all duration-700 ${categoriesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-block px-6 py-2 mb-6 border rounded-full ${darkMode ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'}`}>
              <span className="text-sm font-bold">🛒 Browse Categories</span>
            </div>
            <h2 className={`mb-4 text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Shop by Category</h2>
            <p className={`max-w-2xl mx-auto text-xl ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
              Find everything you need for your industrial projects
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <Link 
                key={i} 
                to="/products" 
                className={`group relative p-10 text-center rounded-3xl transition-all duration-500 transform hover:-translate-y-4 hover:shadow-2xl overflow-hidden ${categoriesInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${darkMode ? 'bg-dark-card border border-dark-border hover:border-brand-primary' : 'bg-white border border-slate-200 hover:border-brand-primary'}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Background Gradient on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                
                {/* Icon */}
                <div className="relative mb-6 text-7xl transition-all duration-500 group-hover:scale-125 group-hover:-rotate-12">
                  {cat.icon}
                </div>
                
                <h3 className={`mb-2 text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{cat.title}</h3>
                <p className={`text-lg font-bold bg-gradient-to-r ${cat.gradient} bg-clip-text text-transparent`}>{cat.count} items</p>
                
                {/* Arrow */}
                <div className={`mt-4 inline-flex items-center gap-1 font-bold transition-all duration-300 group-hover:gap-3 ${darkMode ? 'text-brand-primary' : 'text-brand-primary'}`}>
                  <span>Explore</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES - Enhanced with Animations */}
      <section ref={featuresRef} className={`py-28 overflow-hidden ${darkMode ? 'bg-gradient-to-b from-dark-bg to-dark-card' : 'bg-gradient-to-b from-slate-100 to-white'}`}>
        <div className="max-w-6xl px-4 mx-auto">
          <div className={`mb-20 text-center transition-all duration-700 ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-block px-6 py-2 mb-6 border rounded-full ${darkMode ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'}`}>
              <span className="text-sm font-bold">✨ Why Choose Us</span>
            </div>
            <h2 className={`mb-4 text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Excellence in Every Order</h2>
            <p className={`max-w-2xl mx-auto text-xl ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
              We deliver quality, speed, and unmatched service
            </p>
          </div>
          <div className="grid gap-8 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={i} 
                  className={`group relative p-10 rounded-[2rem] border transition-all duration-500 transform hover:-translate-y-4 hover:shadow-2xl overflow-hidden ${featuresInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${darkMode ? 'bg-dark-card border-dark-border hover:border-brand-primary' : 'bg-white border-slate-200 hover:border-brand-primary'}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  {/* Icon Container */}
                  <div className={`relative inline-flex p-5 mb-8 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon className="text-white" sx={{ fontSize: 36 }} />
                  </div>
                  
                  <h3 className={`relative mb-4 text-2xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h3>
                  <p className={`relative text-lg font-medium leading-relaxed ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{feature.desc}</p>
                  
                  {/* Learn More Link */}
                  <div className={`relative mt-6 inline-flex items-center gap-2 font-bold text-brand-primary transition-all duration-300 group-hover:gap-4`}>
                    <span>Learn More</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PRODUCTS - Enhanced with Animations */}
      <section ref={productsRef} className={`py-28 ${darkMode ? 'bg-dark-bg' : 'bg-slate-50'}`}>
        <div className="max-w-6xl px-4 mx-auto">
          <div className={`flex flex-col items-center justify-between mb-16 lg:flex-row transition-all duration-700 ${productsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="text-center lg:text-left">
              <div className={`inline-block px-6 py-2 mb-4 border rounded-full ${darkMode ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'}`}>
                <span className="text-sm font-bold">🔥 Hot Products</span>
              </div>
              <h2 className={`text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Best Sellers</h2>
              <p className="mt-3 text-xl font-semibold text-brand-primary">Trusted by thousands of businesses</p>
            </div>
            <Link 
              to="/products" 
              className="group mt-8 lg:mt-0 inline-flex items-center gap-3 px-10 py-5 font-bold text-white rounded-2xl bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/50 transition-all duration-500 hover:scale-105"
            >
              View All Products
              <span className="group-hover:translate-x-2 transition-transform">→</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featured.slice(0, 6).map((product, index) => (
              <Link 
                key={product._id} 
                to={`/products/${product._id}`} 
                className={`group relative overflow-hidden rounded-3xl border transition-all duration-500 transform hover:-translate-y-4 hover:shadow-2xl ${productsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${darkMode ? 'bg-dark-card border-dark-border hover:border-brand-primary' : 'bg-white border-slate-200 hover:border-brand-primary'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {/* Product Image Area */}
                <div className={`relative flex items-center justify-center h-64 overflow-hidden ${darkMode ? 'bg-dark-bg' : 'bg-gradient-to-br from-slate-100 to-slate-50'}`}>
                  <div className="transition-all duration-500 text-8xl group-hover:scale-125 group-hover:rotate-12">
                    {product.category === 'Pipes' && '🔧'}
                    {product.category === 'Motors' && '⚙️'}
                    {product.category === 'Valves' && '🔩'}
                    {product.category === 'Accessories' && '🛠️'}
                    {product.category === 'Fittings' && '📌'}
                    {product.category === 'Pumps' && '💧'}
                    {!product.category && '📦'}
                  </div>
                  
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-4 left-4 px-4 py-2 text-sm font-black text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg animate-pulse">
                      -{product.discount}% OFF
                    </div>
                  )}
                  
                  {/* Quick View Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-6">
                    <span className="px-6 py-2 font-bold text-white bg-brand-primary/90 backdrop-blur-sm rounded-full">
                      Quick View
                    </span>
                  </div>
                </div>
                
                {/* Product Info */}
                <div className="p-8">
                  <h3 className={`mb-3 text-xl font-black line-clamp-2 transition-colors duration-300 group-hover:text-brand-primary ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                    {product.name}
                  </h3>
                  <p className={`mb-5 text-sm line-clamp-2 ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                    {product.description}
                  </p>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < (product.rating || 4) ? 'text-brand-primary' : `${darkMode ? 'text-dark-muted' : 'text-slate-300'}`}`}>
                        ★
                      </span>
                    ))}
                    <span className={`ml-2 text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                      ({product.reviews || 0} reviews)
                    </span>
                  </div>
                  
                  {/* Price & Stock */}
                  <div className={`flex items-center justify-between pt-5 border-t ${darkMode ? 'border-dark-border' : 'border-slate-200'}`}>
                    <div>
                      <p className={`text-xs font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>Price</p>
                      <p className="text-3xl font-black bg-gradient-to-r from-brand-primary to-brand-gold bg-clip-text text-transparent">
                        ₹{product.price?.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>Stock</p>
                      <p className={`text-lg font-black ${product.stock > 10 ? 'text-green-500' : product.stock > 0 ? 'text-brand-primary' : 'text-red-500'}`}>
                        {product.stock > 0 ? `${product.stock} left` : 'Out'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Add to Cart Button */}
                  <button className="flex items-center justify-center w-full gap-3 py-4 mt-6 font-bold text-white transition-all duration-500 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-gold group-hover:shadow-xl group-hover:shadow-brand-primary/30 hover:scale-105 active:scale-95">
                    <ShoppingCartIcon sx={{ fontSize: 20 }} />
                    View Product
                  </button>
                </div>
              </Link>
            ))}
          </div>
          {!featured.length && (
            <div className={`py-24 text-center rounded-3xl ${darkMode ? 'bg-dark-card' : 'bg-white'}`}>
              <div className="text-8xl mb-6 animate-bounce">🚀</div>
              <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Featured products coming soon!</p>
              <p className={`mt-2 text-lg ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Stay tuned for amazing deals</p>
            </div>
          )}
        </div>
      </section>

      {/* COMPANY GALLERY - Enhanced with Animations */}
      <section ref={galleryRef} className={`py-28 overflow-hidden ${darkMode ? 'bg-gradient-to-b from-dark-bg to-dark-card' : 'bg-gradient-to-b from-white to-slate-50'}`}>
        <div className="max-w-6xl px-4 mx-auto">
          <div className={`mb-20 text-center transition-all duration-700 ${galleryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-block px-6 py-2 mb-6 border rounded-full ${darkMode ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'}`}>
              <span className="text-sm font-bold">🏢 Our Facility</span>
            </div>
            <h2 className={`mb-6 text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Shri Venkatesan Traders</h2>
            <p className={`max-w-3xl mx-auto text-xl leading-relaxed ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
              A trusted name in industrial supplies with state-of-the-art infrastructure, ISO certifications, and a commitment to excellence serving <span className="font-bold text-brand-primary">10,000+</span> businesses nationwide.
            </p>
          </div>

          {/* Main Gallery */}
          <div className={`grid grid-cols-1 gap-8 lg:grid-cols-3 lg:grid-rows-2 transition-all duration-1000 ${galleryInView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            {/* Large Featured Image */}
            <div className={`lg:col-span-2 lg:row-span-2 relative overflow-hidden rounded-[2rem] shadow-2xl transition-all duration-500 group border hover:-translate-y-2 ${darkMode ? 'bg-dark-card border-dark-border hover:border-brand-primary' : 'bg-slate-100 border-slate-200 hover:border-brand-primary'}`}>
              <div className="relative w-full h-96 lg:h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/20 via-brand-gold/10 to-brand-honey/20 overflow-hidden min-h-[400px]">
                <div className="text-center relative z-10">
                  <div className="text-[10rem] mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 drop-shadow-lg">🏭</div>
                </div>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/40 to-transparent backdrop-blur-sm`}>
                  <div className="text-center px-8">
                    <p className="text-5xl font-black text-white mb-4">Modern Facility</p>
                    <p className="text-xl text-slate-200">10,000+ sq ft state-of-the-art warehouse</p>
                    <div className="mt-6 inline-flex gap-4">
                      <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white text-sm font-bold">ISO 9001</span>
                      <span className="px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white text-sm font-bold">24/7 Support</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Small Cards */}
            <div className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group border p-10 flex flex-col items-center justify-center text-center h-52 hover:-translate-y-2 ${darkMode ? 'bg-dark-card border-dark-border hover:border-brand-primary' : 'bg-white border-slate-200 hover:border-brand-primary hover:shadow-2xl'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-7xl mb-4 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">🔬</div>
              <p className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Quality Lab</p>
              <p className={`text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>ISO certified testing</p>
            </div>

            <div className={`relative overflow-hidden rounded-2xl shadow-xl transition-all duration-500 group border p-10 flex flex-col items-center justify-center text-center h-52 hover:-translate-y-2 ${darkMode ? 'bg-dark-card border-dark-border hover:border-brand-primary' : 'bg-white border-slate-200 hover:border-brand-primary hover:shadow-2xl'}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="text-7xl mb-4 group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500">🚚</div>
              <p className={`text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Delivery Network</p>
              <p className={`text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Pan-India logistics</p>
            </div>
          </div>

          {/* Features Grid Below */}
          <div className="grid grid-cols-2 gap-6 mt-10 lg:grid-cols-4">
            {[
              { icon: "✅", title: "Certified Quality", sub: "ISO 9001:2015", gradient: "from-green-500/10 to-emerald-500/10" },
              { icon: "📦", title: "Secure Packing", sub: "Professional handling", gradient: "from-blue-500/10 to-cyan-500/10" },
              { icon: "💼", title: "Expert Team", sub: "25+ years experience", gradient: "from-purple-500/10 to-pink-500/10" },
              { icon: "🌍", title: "All India Reach", sub: "10,000+ clients", gradient: "from-amber-500/10 to-orange-500/10" }
            ].map((item, i) => (
              <div 
                key={i}
                className={`group p-8 rounded-2xl border transition-all duration-500 text-center hover:-translate-y-2 overflow-hidden relative ${galleryInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${darkMode ? 'bg-dark-card border-dark-border hover:border-brand-primary' : 'bg-white border-slate-200 hover:border-brand-primary hover:shadow-xl'}`}
                style={{ transitionDelay: `${i * 100 + 400}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                <div className="relative text-6xl mb-4 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">{item.icon}</div>
                <p className={`relative font-black text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</p>
                <p className={`relative text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST SECTION - Enhanced with Animations */}
      <section ref={trustRef} className={`py-28 overflow-hidden ${darkMode ? 'bg-gradient-to-r from-brand-primary/10 via-brand-gold/10 to-brand-honey/10' : 'bg-gradient-to-r from-brand-primary/5 via-brand-gold/5 to-brand-honey/5'}`}>
        <div className="max-w-6xl px-4 mx-auto">
          <div className={`mb-20 text-center transition-all duration-700 ${trustInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-block px-6 py-2 mb-6 border rounded-full ${darkMode ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'}`}>
              <span className="text-sm font-bold">🛡️ Trust & Security</span>
            </div>
            <h2 className={`text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Why Trust Us?
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { icon: SecurityIcon, title: "256-bit SSL", sub: "Secure Payments", gradient: "from-blue-500 to-cyan-500" },
              { icon: FlashOnIcon, title: "24h Dispatch", sub: "Fast Shipping", gradient: "from-amber-500 to-orange-500" },
              { icon: CheckCircleIcon, title: "ISO Certified", sub: "Quality Assured", gradient: "from-green-500 to-emerald-500" },
              { icon: EmojiEventsIcon, title: "25+ Years", sub: "Experience", gradient: "from-purple-500 to-pink-500" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i}
                  className={`group p-10 text-center rounded-[2rem] border transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl overflow-hidden relative ${trustInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${darkMode ? 'bg-dark-card/80 backdrop-blur-xl border-dark-border hover:border-brand-primary' : 'bg-white/80 backdrop-blur-xl border-slate-200 hover:border-brand-primary'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  <div className={`relative inline-flex p-5 mb-6 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon sx={{ fontSize: 36 }} className="text-white" />
                  </div>
                  <p className={`relative text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</p>
                  <p className={`relative text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{item.sub}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CUSTOMER REVIEWS - Enhanced with Animations */}
      <section ref={reviewsRef} className={`py-28 ${darkMode ? 'bg-dark-bg' : 'bg-white'}`}>
        <div className="max-w-6xl px-4 mx-auto">
          <div className={`mb-20 text-center transition-all duration-700 ${reviewsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-block px-6 py-2 mb-6 border rounded-full ${darkMode ? 'bg-brand-primary/20 border-brand-primary/40 text-brand-primary' : 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary'}`}>
              <span className="text-sm font-bold">⭐ Customer Reviews</span>
            </div>
            <h2 className={`mb-6 text-5xl lg:text-6xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>What Our Customers Say</h2>
            <p className={`max-w-2xl mx-auto text-xl ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
              Trusted by <span className="font-bold text-brand-primary">10,000+</span> satisfied businesses across India
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {[
              { name: "Rajesh Kumar", role: "Business Owner, Chennai", review: "Excellent quality pipes and motors. Delivery was faster than expected. Their customer support is outstanding!" },
              { name: "Priya Sharma", role: "Factory Manager, Bangalore", review: "Been sourcing from them for 5 years. Consistent quality, reliable delivery, and best prices in the market." },
              { name: "Vikram Patel", role: "Procurement Head, Pune", review: "ISO certified products with warranty support. They handle bulk orders professionally. Highly recommended!" }
            ].map((review, i) => (
              <div 
                key={i}
                className={`group relative p-10 rounded-[2rem] border transition-all duration-500 hover:-translate-y-4 hover:shadow-2xl overflow-hidden ${reviewsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} ${darkMode ? 'bg-dark-card border-dark-border hover:border-brand-primary' : 'bg-slate-50 border-slate-200 hover:border-brand-primary'}`}
                style={{ transitionDelay: `${i * 150}ms` }}
              >
                {/* Background Accent */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-gold/20 blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                
                {/* Rating */}
                <div className="relative flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <StarIcon key={j} sx={{ fontSize: 24 }} className="text-brand-primary drop-shadow-sm" />
                  ))}
                </div>
                
                {/* Quote */}
                <p className={`relative mb-8 text-lg font-semibold leading-relaxed ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                  "{review.review}"
                </p>
                
                {/* Author */}
                <div className={`relative pt-6 border-t ${darkMode ? 'border-dark-border' : 'border-slate-200'}`}>
                  <p className="text-lg font-black text-brand-primary">{review.name}</p>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{review.role}</p>
                </div>
              </div>
            ))}
          </div>

          <div className={`text-center mt-16 transition-all duration-700 delay-500 ${reviewsInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className={`inline-block p-8 rounded-3xl ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-gradient-to-r from-brand-primary/5 to-brand-gold/5 border border-slate-200'}`}>
              <p className={`text-2xl font-black mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                ⭐ 4.8/5 Average Rating
              </p>
              <p className={`text-lg ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                Based on 2000+ verified reviews
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Enhanced with Animations */}
      <section ref={ctaRef} className={`py-32 relative overflow-hidden ${darkMode ? 'bg-gradient-to-br from-dark-bg via-brand-primary/5 to-dark-card' : 'bg-gradient-to-br from-slate-50 via-brand-primary/5 to-white'}`}>
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute w-[600px] h-[600px] rounded-full blur-3xl animate-blob ${darkMode ? 'bg-brand-primary/5' : 'bg-brand-primary/10'} -top-48 -right-48`}></div>
          <div className={`absolute w-[500px] h-[500px] rounded-full blur-3xl animate-blob animation-delay-2000 ${darkMode ? 'bg-brand-gold/5' : 'bg-brand-gold/10'} -bottom-48 -left-48`}></div>
        </div>

        <div className={`relative max-w-5xl px-4 mx-auto text-center transition-all duration-1000 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className={`inline-flex items-center gap-2 px-6 py-3 mb-8 border-2 rounded-full backdrop-blur-md ${darkMode ? 'bg-brand-primary/20 border-brand-primary text-brand-primary' : 'bg-brand-primary/10 border-brand-primary text-brand-primary'}`}>
            <span className="text-2xl animate-bounce">🎉</span>
            <p className="text-sm font-bold">Special Offer - Limited Time</p>
          </div>
          
          <h2 className={`mb-8 text-5xl lg:text-7xl font-black leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Ready to upgrade your
            <span className="block bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey bg-clip-text text-transparent">
              supply chain?
            </span>
          </h2>
          
          <p className={`max-w-3xl mx-auto mb-12 text-xl lg:text-2xl font-medium ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
            Join <span className="font-bold text-brand-primary">10,000+</span> businesses that trust Shri Venkatesan Traders for premium industrial supplies delivered fast.
          </p>
          
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Link 
              to="/register" 
              className="group relative inline-flex items-center justify-center gap-3 px-12 py-6 text-xl font-bold text-white rounded-2xl bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/50 transition-all duration-500 hover:scale-105 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-3">
                <RocketLaunchIcon sx={{ fontSize: 24 }} className="group-hover:rotate-12 transition-transform" />
                Create Free Account
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-brand-honey via-brand-gold to-brand-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
            <Link 
              to="/contact" 
              className={`group inline-flex items-center justify-center gap-3 px-12 py-6 text-xl font-bold rounded-2xl border-2 transition-all duration-500 hover:scale-105 active:scale-95 ${darkMode ? 'bg-dark-card/50 backdrop-blur-xl border-brand-primary text-brand-primary hover:bg-brand-primary/10' : 'bg-white/80 backdrop-blur-xl border-brand-primary text-brand-primary hover:bg-brand-primary/5'}`}
            >
              <PhoneIcon sx={{ fontSize: 24 }} className="group-hover:animate-wiggle" />
              Contact Sales
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className={`mt-16 flex flex-wrap justify-center gap-8 transition-all duration-700 delay-300 ${ctaInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {["ISO 9001", "Secure Payments", "Free Support", "Fast Delivery"].map((badge, i) => (
              <div key={i} className={`flex items-center gap-2 px-4 py-2 rounded-full ${darkMode ? 'bg-dark-card/50' : 'bg-white/50'} backdrop-blur-sm`}>
                <CheckCircleIcon sx={{ fontSize: 18 }} className="text-green-500" />
                <span className={`text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER - Enhanced with Animations */}
      <section ref={footerRef} className={`py-16 border-t ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-slate-100 border-slate-200'}`}>
        <div className={`max-w-6xl px-4 mx-auto transition-all duration-700 ${footerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid grid-cols-1 gap-12 text-center lg:grid-cols-3">
            {[
              { icon: PhoneIcon, title: "24/7 Support", desc: "Customer service always ready", gradient: "from-blue-500 to-cyan-500" },
              { icon: DeliveryDiningIcon, title: "Pan-India Delivery", desc: "Shipping to all corners", gradient: "from-amber-500 to-orange-500" },
              { icon: VerifiedIcon, title: "Quality Guaranteed", desc: "All products certified", gradient: "from-green-500 to-emerald-500" }
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div 
                  key={i}
                  className={`group p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 ${footerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className={`inline-flex p-4 mb-4 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                    <Icon sx={{ fontSize: 32 }} className="text-white" />
                  </div>
                  <p className={`mb-2 text-xl font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</p>
                  <p className={`font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{item.desc}</p>
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
