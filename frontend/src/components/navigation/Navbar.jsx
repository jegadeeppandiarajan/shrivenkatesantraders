import { NavLink, Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useRef } from "react";
import useAuth from "../../hooks/useAuth";
import api from "../../services/api";
import { logoutSuccess } from "../../features/auth/authSlice";
import { fetchCart } from "../../features/cart/cartSlice";
import { useTheme } from "../../context/ThemeContext";
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';

const navLinks = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/products", label: "Products", icon: InventoryIcon },
  { to: "/about", label: "About Us", icon: InfoIcon },
  { to: "/contact", label: "Contact", icon: ContactMailIcon },
];

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, isAdmin } = useAuth();
  const { totalItems = 0 } = useSelector((state) => state.cart || {});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const userMenuRef = useRef(null);
  const aiMessagesEndRef = useRef(null);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Fallback responses when API is unavailable
  const getFallbackResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    if (input.includes('pipe')) return "We offer premium pipes including PVC, MS, GI, and stainless steel in various sizes. Browse our products page!";
    if (input.includes('motor')) return "Our motors collection includes electric motors, submersible pumps, and automation motors with warranty support.";
    if (input.includes('valve')) return "We supply ball valves, butterfly valves, check valves, and gate valves. All ISO certified!";
    if (input.includes('deliver') || input.includes('ship')) return "We dispatch within 24 hours across pan-India. Free shipping on orders above ₹5000!";
    if (input.includes('price') || input.includes('cost')) return "We offer competitive pricing with bulk discounts. Contact our sales team for quotes!";
    if (input.includes('warrant')) return "All products come with manufacturer warranty and hassle-free replacement support.";
    if (input.includes('support') || input.includes('help')) return "We're available 24/7 via phone, email, and chat for technical assistance.";
    if (input.includes('payment') || input.includes('pay')) return "We accept cards, UPI, bank transfer, and COD for eligible locations.";
    
    return "Welcome to Shri Venkatesan Traders! We specialize in premium industrial supplies. How can I help you today?";
  };

  const handleAISendMessage = async () => {
    if (!aiInput.trim()) return;

    const userMessage = { text: aiInput, sender: 'user' };
    setAiMessages((prev) => [...prev, userMessage]);
    const currentInput = aiInput;
    setAiInput('');
    setAiLoading(true);

    try {
      const response = await api.post('/chat', {
        message: currentInput,
        conversationHistory: conversationHistory.slice(-10) // Keep last 10 messages for context
      });

      const aiText = response.data.response;
      const aiMessage = { text: aiText, sender: 'ai' };
      setAiMessages((prev) => [...prev, aiMessage]);
      setConversationHistory((prev) => [...prev, userMessage, aiMessage]);
    } catch (error) {
      console.error('AI Chat Error:', error);
      // Use fallback response if API fails
      const fallbackText = getFallbackResponse(currentInput);
      const aiMessage = { text: fallbackText, sender: 'ai' };
      setAiMessages((prev) => [...prev, aiMessage]);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    aiMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiMessages]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await api.post("/auth/logout");
    dispatch(logoutSuccess());
    setIsLoggingOut(false);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-50 transition-all duration-500 ${scrolled
            ? "bg-white/95 dark:bg-dark-bg/95 shadow-2xl shadow-brand-primary/20 dark:shadow-brand-primary/10 border-b border-brand-primary/30 dark:border-brand-secondary/30 backdrop-blur-xl"
            : "bg-white/90 dark:bg-dark-bg/90 backdrop-blur-xl border-b border-transparent"
          }`}
      >
        {/* Animated decorative top gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary animate-gradient-x bg-[length:200%_100%]"></div>
        
        {/* Subtle animated glow effect in dark mode */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/0 via-brand-secondary/5 to-brand-primary/0 dark:from-brand-secondary/0 dark:via-brand-secondary/10 dark:to-brand-secondary/0 pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 sm:px-4 py-3 lg:py-4 relative">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="relative">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg flex items-center justify-center font-extrabold text-base sm:text-xl shadow-xl group-hover:shadow-brand-primary/50 dark:group-hover:shadow-brand-secondary/50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                <span className="tracking-tight">SV</span>
              </div>
              {/* Animated ring on hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary dark:from-brand-secondary dark:to-brand-honey opacity-0 group-hover:opacity-40 blur-lg group-hover:animate-pulse transition-opacity"></div>
            </div>
            <div className="hidden sm:block">
              <p className="text-[9px] sm:text-[10px] uppercase tracking-[0.25em] sm:tracking-[0.3em] text-brand-gold dark:text-brand-secondary font-bold group-hover:text-brand-honey dark:group-hover:text-brand-honey transition-colors duration-300">Est. 1998</p>
              <h1 className="text-sm sm:text-lg font-extrabold bg-gradient-to-r from-brand-primary via-brand-gold to-brand-dark dark:from-brand-secondary dark:via-brand-honey dark:to-brand-accent bg-clip-text text-transparent leading-tight group-hover:scale-105 transition-transform duration-300">
                Shri Venkatesan Traders
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const IconComponent = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 group overflow-hidden ${isActive
                      ? "text-white dark:text-dark-bg bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary shadow-lg shadow-brand-primary/40 dark:shadow-brand-secondary/40"
                      : "text-slate-700 dark:text-dark-text hover:text-brand-primary dark:hover:text-brand-secondary hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-accent/20 dark:hover:from-dark-hover dark:hover:to-brand-secondary/20"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <IconComponent sx={{ fontSize: 18 }} className="group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
                      <span>{link.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-white dark:bg-dark-bg rounded-full animate-scale-in"></span>
                      )}
                      {/* Hover shine effect */}
                      <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/40 dark:via-brand-secondary/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* AI Chat Button */}
            <button
              onClick={() => setAiChatOpen(!aiChatOpen)}
              className="relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 dark:from-brand-secondary/30 dark:to-brand-honey/20 text-brand-primary dark:text-brand-secondary hover:shadow-lg hover:shadow-brand-primary/30 dark:hover:shadow-brand-secondary/30 transition-all duration-500 hover:scale-110 group border border-brand-primary/30 dark:border-brand-secondary/40 overflow-hidden"
              aria-label="AI Chat"
              title="Ask our AI Assistant"
            >
              <SmartToyIcon sx={{ fontSize: 20 }} className="relative z-10 group-hover:rotate-12 transition-all" />
              {aiChatOpen && (
                <span className="absolute inset-0 bg-gradient-to-r from-brand-primary/20 via-brand-secondary/30 to-brand-primary/20 dark:from-brand-secondary/30 dark:via-brand-honey/40 dark:to-brand-secondary/30 animate-pulse"></span>
              )}
            </button>

            {/* Dark Mode Toggle - Enhanced */}
            <button
              onClick={toggleDarkMode}
              className="relative p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-brand-light to-brand-accent/20 dark:from-dark-card dark:to-dark-hover text-brand-primary dark:text-brand-secondary hover:shadow-lg hover:shadow-brand-primary/30 dark:hover:shadow-brand-secondary/30 transition-all duration-500 hover:scale-110 group border border-brand-primary/20 dark:border-brand-secondary/40 overflow-hidden"
              aria-label="Toggle dark mode"
            >
              {/* Animated background glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-primary/0 via-brand-secondary/20 to-brand-primary/0 dark:from-brand-secondary/0 dark:via-brand-secondary/30 dark:to-brand-secondary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              {darkMode ? (
                <LightModeIcon sx={{ fontSize: 20 }} className="relative z-10 text-brand-secondary group-hover:rotate-180 group-hover:text-brand-honey transition-all duration-500" />
              ) : (
                <DarkModeIcon sx={{ fontSize: 20 }} className="relative z-10 group-hover:-rotate-12 group-hover:text-brand-gold transition-all duration-300" />
              )}
            </button>

            {/* Cart Button with bounce animation */}
            {user && (
              <Link
                to="/cart"
                className="relative p-2 sm:p-2.5 text-slate-600 dark:text-dark-text hover:text-white dark:hover:text-dark-bg hover:bg-gradient-to-r hover:from-brand-primary hover:to-brand-gold dark:hover:from-brand-secondary dark:hover:to-brand-honey rounded-xl transition-all duration-300 group"
              >
                <ShoppingCartIcon sx={{ fontSize: 20 }} className="group-hover:scale-110 transition-transform sm:text-[22px]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-gradient-to-r from-brand-honey to-red-500 dark:from-red-500 dark:to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce-subtle">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="hidden md:flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-dark-card dark:to-dark-hover text-brand-gold dark:text-brand-secondary rounded-xl text-sm font-bold hover:from-amber-100 hover:to-yellow-100 dark:hover:from-brand-secondary/20 dark:hover:to-brand-honey/20 transition-all duration-300 border border-brand-primary/20 dark:border-brand-secondary/40 hover:border-brand-primary/40 dark:hover:border-brand-secondary/60 hover:scale-105 group shadow-sm dark:shadow-brand-secondary/10"
              >
                <SettingsIcon sx={{ fontSize: 18 }} className="group-hover:rotate-90 transition-transform duration-500" />
                <span className="hidden lg:inline">Admin</span>
              </Link>
            )}

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 bg-gradient-to-r from-brand-light to-brand-accent/20 dark:from-dark-card dark:to-dark-hover rounded-xl border-2 border-brand-primary/20 dark:border-brand-secondary/40 hover:border-brand-primary/50 dark:hover:border-brand-secondary/60 hover:shadow-lg hover:shadow-brand-primary/20 dark:hover:shadow-brand-secondary/20 transition-all duration-300 group hover:scale-105"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg flex items-center justify-center text-xs sm:text-sm font-extrabold group-hover:scale-110 transition-transform duration-300 shadow-lg overflow-hidden">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full rounded-xl object-cover" />
                    ) : (
                      user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs sm:text-sm font-bold text-slate-700 dark:text-dark-text max-w-[60px] sm:max-w-[80px] truncate">{user.name?.split(" ")[0]}</span>
                  </div>
                  <KeyboardArrowDownIcon 
                    sx={{ fontSize: 18 }} 
                    className={`text-slate-400 dark:text-dark-muted transition-all duration-300 hidden sm:block ${userMenuOpen ? "rotate-180 text-brand-primary dark:text-brand-secondary" : ""}`}
                  />
                </button>

                {/* User Dropdown with enhanced animations */}
                <div className={`absolute right-0 mt-2 w-64 bg-white dark:bg-dark-card rounded-2xl shadow-2xl shadow-brand-primary/20 dark:shadow-brand-secondary/20 border-2 border-brand-primary/20 dark:border-brand-secondary/30 overflow-hidden transition-all duration-300 origin-top-right ${userMenuOpen ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2 pointer-events-none"}`}>
                  <div className="p-4 bg-gradient-to-br from-brand-light via-white to-brand-accent/20 dark:from-dark-hover dark:via-dark-card dark:to-brand-secondary/10 border-b-2 border-brand-primary/10 dark:border-brand-secondary/20">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg flex items-center justify-center text-lg font-extrabold shadow-lg overflow-hidden ring-2 ring-brand-primary/30 dark:ring-brand-secondary/30">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name?.charAt(0).toUpperCase() || "U"
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-extrabold text-slate-900 dark:text-dark-text truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-dark-muted truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <Link 
                      to="/dashboard" 
                      onClick={() => setUserMenuOpen(false)} 
                      className="group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-dark-text hover:bg-gradient-to-r hover:from-brand-primary/10 hover:to-brand-accent/20 dark:hover:from-brand-secondary/20 dark:hover:to-brand-secondary/10 hover:text-brand-primary dark:hover:text-brand-secondary transition-all"
                    >
                      <DashboardIcon sx={{ fontSize: 18 }} className="group-hover:scale-110 group-hover:rotate-6 transition-all" />
                      <span>Dashboard</span>
                    </Link>
                    <Link 
                      to="/orders" 
                      onClick={() => setUserMenuOpen(false)} 
                      className="group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-dark-text hover:bg-gradient-to-r hover:from-brand-primary/10 hover:to-brand-accent/20 dark:hover:from-brand-secondary/20 dark:hover:to-brand-secondary/10 hover:text-brand-primary dark:hover:text-brand-secondary transition-all"
                    >
                      <ReceiptLongIcon sx={{ fontSize: 18 }} className="group-hover:scale-110 group-hover:rotate-6 transition-all" />
                      <span>My Orders</span>
                    </Link>
                  </div>
                  
                  <div className="p-2 border-t-2 border-slate-100 dark:border-dark-border">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-red-500 dark:text-red-400 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 dark:hover:from-red-500/20 dark:hover:to-red-500/10 transition-all disabled:opacity-50"
                    >
                      {isLoggingOut ? (
                        <div className="w-4 h-4 border-2 border-red-500 dark:border-red-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <LogoutIcon sx={{ fontSize: 18 }} className="group-hover:scale-110 group-hover:rotate-12 transition-all" />
                      )}
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 text-slate-700 dark:text-dark-text font-bold rounded-xl hover:text-brand-primary dark:hover:text-brand-secondary hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-accent/20 dark:hover:from-dark-hover dark:hover:to-brand-secondary/20 transition-all duration-300 group"
                >
                  <LoginIcon sx={{ fontSize: 18 }} className="group-hover:scale-110 group-hover:rotate-6 transition-all" />
                  <span className="text-sm">Login</span>
                </Link>
                <Link
                  to="/register"
                  className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg rounded-xl text-xs sm:text-sm font-extrabold shadow-xl shadow-brand-primary/40 dark:shadow-brand-secondary/40 hover:shadow-brand-primary/60 dark:hover:shadow-brand-secondary/60 transition-all duration-500 hover:scale-105 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-honey via-brand-gold to-brand-primary dark:from-brand-primary dark:via-brand-honey dark:to-brand-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="relative z-10">Get Started</span>
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 dark:via-dark-bg/30 to-transparent"></div>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-accent/20 dark:hover:from-dark-hover dark:hover:to-brand-primary/10 rounded-xl transition-all duration-300 group border border-transparent hover:border-brand-primary/20"
              aria-label="Toggle menu"
            >
              <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center items-center">
                <span className={`block w-4 sm:w-5 h-0.5 bg-gradient-to-r from-brand-primary to-brand-gold rounded-full transition-all duration-300 ${mobileMenuOpen ? "rotate-45 translate-y-[3px]" : ""}`}></span>
                <span className={`block w-4 sm:w-5 h-0.5 bg-gradient-to-r from-brand-primary to-brand-gold rounded-full my-1 transition-all duration-300 ${mobileMenuOpen ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}></span>
                <span className={`block w-4 sm:w-5 h-0.5 bg-gradient-to-r from-brand-primary to-brand-gold rounded-full transition-all duration-300 ${mobileMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""}`}></span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay with blur */}
      <div 
        className={`fixed inset-0 bg-gradient-to-br from-brand-dark/50 via-brand-gold/20 to-brand-primary/50 dark:from-dark-bg/80 dark:via-brand-secondary/20 dark:to-dark-bg/80 backdrop-blur-md z-40 lg:hidden transition-all duration-300 ${mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} 
        onClick={() => setMobileMenuOpen(false)} 
      />

      {/* Mobile Menu Panel with slide animation */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white dark:bg-dark-card z-50 lg:hidden transition-all duration-500 shadow-2xl border-l-4 border-brand-primary dark:border-brand-secondary ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-4 sm:p-5 h-full flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 animate-fade-in-down">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg flex items-center justify-center font-extrabold shadow-xl">
                SV
              </div>
              <span className="font-extrabold bg-gradient-to-r from-brand-primary to-brand-gold dark:from-brand-secondary dark:to-brand-honey bg-clip-text text-transparent">Menu</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Dark Mode Toggle in Mobile */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-gradient-to-br from-brand-light to-brand-accent/20 dark:from-dark-hover dark:to-brand-secondary/20 text-brand-primary dark:text-brand-secondary hover:shadow-lg transition-all duration-300 group border border-brand-primary/20 dark:border-brand-secondary/40"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <LightModeIcon sx={{ fontSize: 18 }} className="group-hover:rotate-180 transition-transform duration-500" />
                ) : (
                  <DarkModeIcon sx={{ fontSize: 18 }} className="group-hover:-rotate-12 transition-transform duration-300" />
                )}
              </button>
              <button 
                onClick={() => setMobileMenuOpen(false)} 
                className="p-2 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100/50 dark:hover:from-red-500/20 dark:hover:to-red-500/10 rounded-xl transition-all group"
              >
                <svg className="w-5 h-5 text-slate-500 dark:text-dark-muted group-hover:text-red-500 dark:group-hover:text-red-400 group-hover:rotate-90 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Navigation with stagger animation */}
          <nav className="space-y-1.5 flex-1 overflow-y-auto">
            {navLinks.map((link, index) => {
              const IconComponent = link.icon;
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-extrabold transition-all duration-300 group ${isActive
                      ? "bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg shadow-lg shadow-brand-primary/40 dark:shadow-brand-secondary/40"
                      : "text-slate-700 dark:text-dark-text hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-accent/20 dark:hover:from-dark-hover dark:hover:to-brand-secondary/20 hover:text-brand-primary dark:hover:text-brand-secondary"
                    } animate-slide-right`
                  }
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <IconComponent sx={{ fontSize: 22 }} className="group-hover:scale-110 group-hover:rotate-6 transition-all" />
                  {link.label}
                </NavLink>
              );
            })}

            {user && (
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-extrabold transition-all duration-300 ${isActive
                    ? "bg-gradient-to-r from-brand-primary to-brand-gold dark:from-brand-secondary dark:to-brand-honey text-white dark:text-dark-bg shadow-lg"
                    : "text-slate-700 dark:text-dark-text hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-accent/20 dark:hover:from-dark-hover dark:hover:to-brand-secondary/20 hover:text-brand-primary dark:hover:text-brand-secondary"
                  }`
                }
              >
                <ShoppingCartIcon sx={{ fontSize: 22 }} />
                Cart
                {totalItems > 0 && (
                  <span className="ml-auto min-w-6 h-6 px-2 bg-gradient-to-r from-brand-honey to-red-500 text-white text-sm font-bold rounded-full flex items-center justify-center shadow-lg">
                    {totalItems}
                  </span>
                )}
              </NavLink>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-extrabold text-brand-gold dark:text-brand-secondary hover:bg-gradient-to-r hover:from-amber-50 hover:to-yellow-50 dark:hover:from-dark-hover dark:hover:to-brand-secondary/20 transition-all"
              >
                <SettingsIcon sx={{ fontSize: 22 }} />
                Admin Panel
              </Link>
            )}
          </nav>

          {/* User Section */}
          {user ? (
            <div className="mt-auto p-4 bg-gradient-to-br from-brand-light via-white to-brand-accent/20 dark:from-dark-hover dark:via-dark-card dark:to-brand-secondary/10 rounded-2xl border-2 border-brand-primary/20 dark:border-brand-secondary/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg flex items-center justify-center font-extrabold text-lg shadow-lg overflow-hidden ring-2 ring-brand-primary/30 dark:ring-brand-secondary/30">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.name?.charAt(0).toUpperCase() || "U"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-extrabold text-slate-900 dark:text-dark-text truncate">{user.name}</p>
                  <p className="text-sm text-slate-500 dark:text-dark-muted truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-extrabold hover:from-red-600 hover:to-red-700 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:shadow-red-500/30"
              >
                {isLoggingOut ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <LogoutIcon sx={{ fontSize: 20 }} />
                    Sign Out
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="mt-auto space-y-3">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 border-2 border-brand-primary/30 dark:border-brand-secondary/40 text-slate-700 dark:text-dark-text rounded-2xl font-extrabold hover:border-brand-primary dark:hover:border-brand-secondary hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-accent/20 dark:hover:from-dark-hover dark:hover:to-brand-secondary/20 hover:text-brand-primary dark:hover:text-brand-secondary transition-all"
              >
                <LoginIcon sx={{ fontSize: 20 }} />
                Login
              </Link>
              <Link
                to="/register"
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg rounded-2xl font-extrabold hover:shadow-xl transition-all shadow-lg shadow-brand-primary/40 dark:shadow-brand-secondary/40"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* AI CHAT PANEL - FLOATING */}
      <div className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${aiChatOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
        <div className={`w-80 max-w-[calc(100vw-48px)] rounded-2xl border-2 overflow-hidden transition-all duration-300 shadow-2xl ${darkMode ? 'bg-dark-card border-dark-border shadow-brand-secondary/20' : 'bg-white border-slate-200 shadow-brand-primary/20'}`}>
          {/* Header */}
          <div className={`p-4 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-honey dark:from-brand-secondary dark:via-brand-honey dark:to-brand-primary text-white dark:text-dark-bg flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <SmartToyIcon sx={{ fontSize: 22 }} />
              <span className="font-bold">SVT AI Assistant</span>
            </div>
            <button
              onClick={() => setAiChatOpen(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-all"
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </button>
          </div>

          {/* Messages */}
          <div className={`h-64 overflow-y-auto p-4 space-y-3 ${darkMode ? 'bg-dark-bg' : 'bg-slate-50'}`}>
            {aiMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <SmartToyIcon sx={{ fontSize: 40 }} className={darkMode ? 'text-dark-muted' : 'text-slate-400'} />
                <p className={`text-xs text-center font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                  Ask about pipes, motors, valves & more!
                </p>
              </div>
            ) : (
              <>
                {aiMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg text-xs font-semibold ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-brand-primary to-brand-gold text-white'
                        : `${darkMode ? 'bg-dark-card border border-dark-border text-dark-text' : 'bg-white border border-slate-300 text-slate-900'}`
                    }`}>
                      <p>{msg.text}</p>
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className={`px-3 py-2 rounded-lg ${darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white border border-slate-300'}`}>
                      <div className="flex gap-1">
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${darkMode ? 'bg-brand-primary' : 'bg-slate-600'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce delay-100 ${darkMode ? 'bg-brand-primary' : 'bg-slate-600'}`}></div>
                        <div className={`w-1.5 h-1.5 rounded-full animate-bounce delay-200 ${darkMode ? 'bg-brand-primary' : 'bg-slate-600'}`}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={aiMessagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          <div className={`p-3 border-t ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-slate-200'}`}>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAISendMessage()}
                placeholder="Ask..."
                className={`flex-1 px-3 py-2 rounded-lg border text-xs transition-all focus:outline-none focus:ring-2 focus:ring-brand-primary ${
                  darkMode
                    ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted'
                    : 'bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-500'
                }`}
                disabled={aiLoading}
              />
              <button
                onClick={handleAISendMessage}
                disabled={aiLoading || !aiInput.trim()}
                className="p-2 rounded-lg bg-gradient-to-r from-brand-primary to-brand-gold text-white hover:shadow-lg transition-all disabled:opacity-50"
              >
                <SendIcon sx={{ fontSize: 16 }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
