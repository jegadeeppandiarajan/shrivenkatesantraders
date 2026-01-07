import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { fetchDashboard, fetchPayments, updateRealtimeStats } from "../../features/admin/dashboardSlice";
import { useSocket } from "../../context/SocketContext";
import { useTheme } from "../../context/ThemeContext";
import { Link } from "react-router-dom";
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import AddIcon from '@mui/icons-material/Add';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';

const MetricCard = ({ label, value, icon, trend, color = "brand", index = 0, isVisible = true, darkMode = false }) => (
  <div className={`group card-hover rounded-2xl p-5 lg:p-6 shadow-lg transition-all duration-700 border ${
    darkMode 
      ? 'bg-dark-card border-dark-border hover:border-brand-primary/40 hover:shadow-brand-primary/10' 
      : 'bg-gradient-to-br from-white to-slate-50 border-slate-100 hover:border-brand-primary/30 hover:shadow-xl'
  } ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`}
  style={{ transitionDelay: `${index * 100}ms` }}>
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
          darkMode ? 'text-dark-muted' : 'text-slate-400'
        }`}>{label}</p>
        <p className={`text-2xl lg:text-3xl font-bold mt-2 lg:mt-3 group-hover:text-brand-primary transition-colors ${
          darkMode ? 'text-dark-text' : 'text-slate-900'
        }`}>{value}</p>
        {trend && (
          <p className={`text-xs lg:text-sm font-semibold mt-2 flex items-center gap-1 ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
            {trend > 0 ? <TrendingUpIcon sx={{ fontSize: 16 }} /> : <TrendingDownIcon sx={{ fontSize: 16 }} />}
            {Math.abs(trend)}% from last month
          </p>
        )}
      </div>
      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
        darkMode ? (
          color === "brand" ? "bg-brand-primary/20" :
          color === "secondary" ? "bg-brand-secondary/20" :
          color === "accent" ? "bg-green-500/20" :
          "bg-dark-hover"
        ) : (
          color === "brand" ? "bg-gradient-to-br from-brand-primary/20 to-brand-primary/5" :
          color === "secondary" ? "bg-gradient-to-br from-brand-secondary/20 to-brand-secondary/5" :
          color === "accent" ? "bg-gradient-to-br from-green-500/20 to-green-500/5" :
          "bg-gradient-to-br from-slate-200/50 to-slate-100"
        )
      }`}>
        {icon}
      </div>
    </div>
    <div className="mt-3 lg:mt-4 flex items-center gap-2">
      <FiberManualRecordIcon sx={{ fontSize: 8, color: '#22c55e' }} className="animate-pulse" />
      <span className={`text-[10px] lg:text-xs font-medium ${
        darkMode ? 'text-dark-muted' : 'text-slate-400'
      }`}>Live data</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`rounded-xl shadow-xl p-4 border ${
        darkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-white border-slate-100'
      }`}>
        <p className={`text-sm font-semibold ${
          darkMode ? 'text-dark-muted' : 'text-slate-600'
        }`}>{label}</p>
        <p className="text-lg font-bold text-brand-primary">₹ {payload[0].value?.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const { darkMode } = useTheme();
  const { metrics, revenueSeries, bestSellers, lowStock, loading } = useSelector((state) => state.dashboard);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');

  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchPayments());
    setIsVisible(true);
  }, [dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on("admin:dashboard", (payload) => {
      dispatch(updateRealtimeStats(payload));
    });
    return () => socket.off("admin:dashboard");
  }, [socket, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboard());
    dispatch(fetchPayments());
  };

  if (loading || !metrics) {
    return (
      <div className={`p-10 flex flex-col items-center justify-center min-h-[60vh] ${
        darkMode ? 'text-dark-text' : 'text-slate-500'
      }`}>
        <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 font-medium">Loading analytics dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-5 lg:p-8 space-y-6 lg:space-y-8">
      {/* Welcome Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
      }`}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className={`text-xl lg:text-2xl font-bold ${
              darkMode ? 'text-dark-text' : 'text-slate-800'
            }`}>Dashboard Overview</h1>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
            }`}>Live</span>
          </div>
          <div className="flex items-center gap-4">
            <p className={`text-sm ${
              darkMode ? 'text-dark-muted' : 'text-slate-500'
            }`}>Welcome back! Here's what's happening with your business today.</p>
            <div className={`hidden md:flex items-center gap-2 text-xs ${
              darkMode ? 'text-dark-muted' : 'text-slate-400'
            }`}>
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-xl transition-all duration-300 ${
              darkMode 
                ? 'bg-dark-hover text-dark-text hover:bg-dark-border' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <RefreshIcon sx={{ fontSize: 20 }} />
          </button>
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-primary to-brand-gold text-white font-semibold shadow-lg hover:shadow-brand-primary/30 hover:scale-105 transition-all duration-300"
          >
            <AddIcon sx={{ fontSize: 20 }} />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <MetricCard label="Total Revenue" value={`₹ ${metrics.totalRevenue?.toLocaleString() || 0}`} icon={<AttachMoneyIcon sx={{ fontSize: 28 }} className="text-brand-primary" />} color="brand" trend={12} index={0} isVisible={isVisible} darkMode={darkMode} />
        <MetricCard label="Total Orders" value={metrics.totalOrders || 0} icon={<ShoppingCartIcon sx={{ fontSize: 28 }} className="text-brand-secondary" />} color="secondary" trend={8} index={1} isVisible={isVisible} darkMode={darkMode} />
        <MetricCard label="Products" value={metrics.totalProducts || 0} icon={<InventoryIcon sx={{ fontSize: 28 }} className="text-green-500" />} color="accent" index={2} isVisible={isVisible} darkMode={darkMode} />
        <MetricCard label="Customers" value={metrics.totalCustomers || 0} icon={<PeopleIcon sx={{ fontSize: 28 }} className={darkMode ? 'text-dark-muted' : 'text-slate-500'} />} color="slate" trend={5} index={3} isVisible={isVisible} darkMode={darkMode} />
      </div>

      {/* Revenue Chart */}
      <div className={`rounded-2xl lg:rounded-3xl shadow-lg p-5 lg:p-8 transition-all duration-700 border ${
        darkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-gradient-to-br from-white to-slate-50 border-slate-100'
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`} style={{ transitionDelay: "200ms" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
              darkMode ? 'text-dark-muted' : 'text-slate-400'
            }`}>Revenue Analytics</p>
            <h3 className={`text-xl lg:text-2xl font-bold mt-1 ${
              darkMode ? 'text-dark-text' : 'text-slate-900'
            }`}>Sales Performance</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-primary animate-pulse"></span>
              <span className={`text-sm ${
                darkMode ? 'text-dark-muted' : 'text-slate-500'
              }`}>Revenue</span>
            </div>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all border outline-none ${
                darkMode 
                  ? 'bg-dark-bg border-dark-border text-dark-text focus:border-brand-primary' 
                  : 'bg-slate-50 border-slate-200 text-slate-600 focus:border-brand-primary'
              }`}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
        </div>
        <div className="h-64 lg:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueSeries} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#2A2A2A' : '#e2e8f0'} vertical={false} />
              <XAxis dataKey="_id" stroke={darkMode ? '#A3A3A3' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke={darkMode ? '#A3A3A3' : '#94a3b8'} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#F59E0B"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Best Sellers */}
        <div className={`rounded-2xl lg:rounded-3xl shadow-lg p-5 lg:p-8 transition-all duration-700 border ${
          darkMode 
            ? 'bg-dark-card border-dark-border' 
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-100'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-5 lg:mb-6">
            <div>
              <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
                darkMode ? 'text-dark-muted' : 'text-slate-400'
              }`}>Top Products</p>
              <h4 className={`text-lg lg:text-xl font-bold mt-1 ${
                darkMode ? 'text-dark-text' : 'text-slate-900'
              }`}>Best Sellers</h4>
            </div>
            <Link to="/admin/products" className="text-sm font-semibold text-brand-primary hover:text-brand-gold transition-colors">
              View All →
            </Link>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {bestSellers.length > 0 ? bestSellers.map((item, index) => (
              <div key={item._id} className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl transition-all duration-500 ${
                darkMode 
                  ? 'bg-dark-bg hover:bg-dark-hover' 
                  : 'bg-slate-50 hover:bg-slate-100'
              } ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              }`} style={{ transitionDelay: `${350 + index * 50}ms` }}>
                <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center font-bold text-white text-sm ${
                  index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-500" :
                  index === 1 ? "bg-gradient-to-br from-slate-400 to-slate-500" :
                  index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700" :
                  darkMode ? "bg-dark-border" : "bg-slate-300"
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    darkMode ? 'text-dark-text' : 'text-slate-800'
                  }`}>{item.name}</p>
                  <p className={`text-xs lg:text-sm truncate ${
                    darkMode ? 'text-dark-muted' : 'text-slate-500'
                  }`}>{item.category || "Product"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-primary">{item.quantity} units</p>
                  <p className={`text-[10px] lg:text-xs ${
                    darkMode ? 'text-dark-muted' : 'text-slate-400'
                  }`}>sold</p>
                </div>
              </div>
            )) : (
              <p className={`text-center py-8 ${
                darkMode ? 'text-dark-muted' : 'text-slate-500'
              }`}>No sales data yet</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`rounded-2xl lg:rounded-3xl shadow-lg p-5 lg:p-8 transition-all duration-700 border ${
          darkMode 
            ? 'bg-dark-card border-dark-border' 
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-100'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-5 lg:mb-6">
            <div>
              <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
                darkMode ? 'text-dark-muted' : 'text-slate-400'
              }`}>Inventory</p>
              <h4 className={`text-lg lg:text-xl font-bold mt-1 ${
                darkMode ? 'text-dark-text' : 'text-slate-900'
              }`}>Low Stock Alerts</h4>
            </div>
            <span className={`px-2.5 lg:px-3 py-1 rounded-full text-xs lg:text-sm font-semibold ${
              lowStock.length > 0 
                ? darkMode ? "bg-red-500/20 text-red-400" : "bg-red-100 text-red-600"
                : darkMode ? "bg-green-500/20 text-green-400" : "bg-green-100 text-green-600"
            }`}>
              {lowStock.length > 0 ? `${lowStock.length} items` : "All good!"}
            </span>
          </div>
          <div className="space-y-3 lg:space-y-4">
            {lowStock.length > 0 ? lowStock.map((product, index) => (
              <div key={product._id} className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-xl lg:rounded-2xl border transition-all duration-500 ${
                darkMode 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-red-50 border-red-100'
              } ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              }`} style={{ transitionDelay: `${400 + index * 50}ms` }}>
                <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center hover:scale-110 transition-transform ${
                  darkMode ? 'bg-red-500/20' : 'bg-red-100'
                }`}>
                  <WarningIcon sx={{ fontSize: 20 }} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    darkMode ? 'text-dark-text' : 'text-slate-800'
                  }`}>{product.name}</p>
                  <p className={`text-xs lg:text-sm truncate ${
                    darkMode ? 'text-dark-muted' : 'text-slate-500'
                  }`}>{product.category || "Product"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-red-500">{product.stock} left</p>
                  <Link to="/admin/products" className="text-xs text-brand-primary font-semibold hover:text-brand-gold transition-colors">
                    Restock →
                  </Link>
                </div>
              </div>
            )) : (
              <div className="text-center py-8 animate-fade-in">
                <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce-subtle ${
                  darkMode ? 'bg-green-500/20' : 'bg-green-100'
                }`}>
                  <CheckCircleIcon sx={{ fontSize: 32 }} className="text-green-500" />
                </div>
                <p className={darkMode ? 'text-dark-muted' : 'text-slate-500'}>All items are well stocked!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
