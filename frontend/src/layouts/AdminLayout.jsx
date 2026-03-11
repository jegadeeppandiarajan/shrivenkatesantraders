import { NavLink, Outlet, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import api from "../services/api";
import { logoutSuccess } from "../features/auth/authSlice";
import { useTheme } from "../context/ThemeContext";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import PaymentIcon from '@mui/icons-material/Payment';
import PeopleIcon from '@mui/icons-material/People';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const adminNav = [
  { to: "/admin", label: "Overview", icon: DashboardIcon, end: true },
  { to: "/admin/orders", label: "Orders", icon: LocalShippingIcon },
  { to: "/admin/products", label: "Products", icon: InventoryIcon },
  { to: "/admin/payments", label: "Payments", icon: PaymentIcon },
  { to: "/admin/users", label: "Users", icon: PeopleIcon },
];

const AdminLayout = () => {
  const dispatch = useDispatch();
  const { darkMode, toggleDarkMode } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleLogout = async () => {
    await api.post("/auth/logout");
    dispatch(logoutSuccess());
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-dark-bg via-dark-card to-dark-bg' 
        : 'bg-gradient-to-br from-slate-100 via-slate-50 to-white'
    }`}>
      {/* Enhanced Header */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        darkMode 
          ? 'bg-dark-card/95 border-b border-dark-border shadow-xl shadow-black/20' 
          : 'bg-white/95 border-b border-slate-200/50 shadow-lg shadow-slate-200/50'
      } backdrop-blur-xl`}>
        <div className="px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section - Logo & Brand */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-2xl transition-colors ${
                  darkMode ? 'hover:bg-dark-hover text-dark-text' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
              
              <Link to="/admin" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-brand-primary via-brand-secondary to-brand-gold text-white flex items-center justify-center font-bold text-lg shadow-lg group-hover:shadow-brand-primary/30 group-hover:scale-105 transition-all duration-300">
                    SV
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-dark-card animate-pulse"></div>
                </div>
                <div className="hidden sm:block">
                  <p className={`text-[10px] uppercase tracking-[0.3em] font-semibold ${
                    darkMode ? 'text-brand-primary' : 'text-brand-gold'
                  }`}>Admin Panel</p>
                  <h1 className={`text-lg font-bold ${
                    darkMode ? 'text-dark-text' : 'text-brand-dark'
                  }`}>Shri Venkatesan</h1>
                </div>
              </Link>
            </div>

            {/* Center Section - Search (Desktop) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className={`relative w-full group`}>
                <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  darkMode ? 'text-dark-muted group-focus-within:text-brand-primary' : 'text-slate-400 group-focus-within:text-brand-primary'
                }`} sx={{ fontSize: 20 }} />
                <input
                  type="text"
                  placeholder="Search orders, products, users..."
                  className={`w-full pl-12 pr-4 py-2.5 rounded-2xl text-sm transition-all duration-300 ${
                    darkMode 
                      ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20' 
                      : 'bg-slate-50 border-slate-200 text-brand-dark placeholder-slate-400 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 focus:bg-white'
                  } border outline-none`}
                />
              </div>
            </div>

            {/* Right Section - Actions */}
            <div className="flex items-center gap-2 lg:gap-3">
              {/* Mobile Search Button */}
              <button 
                onClick={() => setSearchOpen(!searchOpen)}
                className={`md:hidden p-2.5 rounded-2xl transition-colors ${
                  darkMode ? 'hover:bg-dark-hover text-dark-text' : 'hover:bg-slate-100 text-slate-600'
                }`}
              >
                <SearchIcon sx={{ fontSize: 22 }} />
              </button>

              {/* Notifications */}
              <button className={`relative p-2.5 rounded-2xl transition-all duration-300 ${
                darkMode 
                  ? 'hover:bg-dark-hover text-dark-text' 
                  : 'hover:bg-slate-100 text-slate-600'
              }`}>
                <NotificationsIcon sx={{ fontSize: 22 }} />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-dark-card"></span>
              </button>

              {/* Dark Mode Toggle */}
              <button 
                onClick={toggleDarkMode}
                className={`p-2.5 rounded-2xl transition-all duration-300 ${
                  darkMode 
                    ? 'bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {darkMode ? <LightModeIcon sx={{ fontSize: 22 }} /> : <DarkModeIcon sx={{ fontSize: 22 }} />}
              </button>

              {/* Divider */}
              <div className={`hidden lg:block w-px h-8 ${
                darkMode ? 'bg-dark-border' : 'bg-slate-200'
              }`}></div>

              {/* Back to Store */}
              <Link 
                to="/" 
                className={`hidden lg:flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 ${
                  darkMode 
                    ? 'text-dark-muted hover:text-dark-text hover:bg-dark-hover' 
                    : 'text-brand-slate hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ArrowBackIcon sx={{ fontSize: 18 }} /> 
                <span>Store</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 ${
                  darkMode 
                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <LogoutIcon sx={{ fontSize: 18 }} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {searchOpen && (
            <div className="md:hidden mt-4 animate-fade-in">
              <div className="relative">
                <SearchIcon className={`absolute left-4 top-1/2 -translate-y-1/2 ${
                  darkMode ? 'text-dark-muted' : 'text-slate-400'
                }`} sx={{ fontSize: 20 }} />
                <input
                  type="text"
                  placeholder="Search..."
                  autoFocus
                  className={`w-full pl-12 pr-4 py-3 rounded-2xl text-sm ${
                    darkMode 
                      ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted' 
                      : 'bg-slate-50 border-slate-200 text-brand-dark placeholder-slate-400'
                  } border outline-none focus:ring-2 focus:ring-brand-primary/20`}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-12 gap-6 lg:gap-8 py-6 lg:py-8 px-4">
        {/* Sidebar */}
        <aside className={`${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-30 w-72 lg:w-auto lg:col-span-3 transition-transform duration-300 ease-in-out`}>
          <div className={`h-full lg:h-auto overflow-y-auto lg:overflow-visible pt-20 lg:pt-0 px-4 lg:px-0 ${
            darkMode ? 'bg-dark-card lg:bg-transparent' : 'bg-white lg:bg-transparent'
          }`}>
            <div className={`rounded-2xl lg:rounded-3xl shadow-xl p-5 lg:p-6 sticky top-24 transition-colors duration-300 ${
              darkMode 
                ? 'bg-dark-card border border-dark-border' 
                : 'bg-white/80 backdrop-blur-xl border border-slate-200/50'
            }`}>
              <p className={`text-xs uppercase tracking-[0.3em] font-semibold mb-4 px-4 ${
                darkMode ? 'text-dark-muted' : 'text-slate-400'
              }`}>Navigation</p>
              <nav className="space-y-1.5">
                {adminNav.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-r from-brand-primary to-brand-gold text-white shadow-lg shadow-brand-primary/30"
                            : darkMode 
                              ? "text-dark-text hover:bg-dark-hover hover:translate-x-1" 
                              : "text-slate-600 hover:bg-slate-100 hover:translate-x-1"
                        }`
                      }
                    >
                      <IconComponent sx={{ fontSize: 20 }} />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              {/* Quick Actions */}
              <div className={`mt-6 pt-6 border-t ${
                darkMode ? 'border-dark-border' : 'border-slate-200'
              }`}>
                <p className={`text-xs uppercase tracking-[0.3em] font-semibold mb-4 px-4 ${
                  darkMode ? 'text-dark-muted' : 'text-slate-400'
                }`}>Quick Actions</p>
                <Link
                  to="/admin/products"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    darkMode 
                      ? 'bg-brand-primary/20 text-brand-primary hover:bg-brand-primary/30' 
                      : 'bg-brand-primary/10 text-brand-gold hover:bg-brand-primary/20'
                  }`}
                >
                  <AddCircleIcon sx={{ fontSize: 20 }} />
                  Add Product
                </Link>
              </div>

              {/* Theme Info */}
              <div className={`mt-6 p-4 rounded-2xl ${
                darkMode ? 'bg-dark-bg' : 'bg-brand-cream'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    darkMode ? 'bg-brand-primary/20' : 'bg-brand-primary/10'
                  }`}>
                    {darkMode ? <DarkModeIcon sx={{ fontSize: 20 }} className="text-brand-primary" /> : <LightModeIcon sx={{ fontSize: 20 }} className="text-brand-gold" />}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold ${
                      darkMode ? 'text-dark-text' : 'text-slate-700'
                    }`}>{darkMode ? 'Dark Mode' : 'Light Mode'}</p>
                    <p className={`text-xs ${
                      darkMode ? 'text-dark-muted' : 'text-slate-400'
                    }`}>Current theme</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="col-span-12 lg:col-span-9">
          <div className={`rounded-2xl lg:rounded-3xl shadow-xl min-h-[75vh] overflow-hidden transition-colors duration-300 ${
            darkMode 
              ? 'bg-dark-card border border-dark-border' 
              : 'bg-white/80 backdrop-blur-xl border border-slate-200/50'
          }`}>
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminLayout;

