import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../features/orders/orderSlice";
import { setUser } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
import AnimatedBackground from "../../components/common/AnimatedBackground";
import api from "../../services/api";
import PersonIcon from '@mui/icons-material/Person';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';

// Preset avatar options
const avatarOptions = [
  { id: 1, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b6e3f4", name: "Felix" },
  { id: 2, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka&backgroundColor=c0aede", name: "Aneka" },
  { id: 3, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty&backgroundColor=ffdfbf", name: "Dusty" },
  { id: 4, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey&backgroundColor=ffd5dc", name: "Bailey" },
  { id: 5, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Midnight&backgroundColor=d1d4f9", name: "Midnight" },
  { id: 6, url: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie&backgroundColor=c1e1c5", name: "Charlie" },
  { id: 7, url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Oliver&backgroundColor=b6e3f4", name: "Oliver" },
  { id: 8, url: "https://api.dicebear.com/7.x/lorelei/svg?seed=Luna&backgroundColor=ffd5dc", name: "Luna" },
  { id: 9, url: "https://api.dicebear.com/7.x/bottts/svg?seed=Robot1&backgroundColor=c0aede", name: "Robot" },
  { id: 10, url: "https://api.dicebear.com/7.x/fun-emoji/svg?seed=Happy&backgroundColor=ffdfbf", name: "Happy" },
  { id: 11, url: "https://api.dicebear.com/7.x/personas/svg?seed=Max&backgroundColor=d1d4f9", name: "Max" },
  { id: 12, url: "https://api.dicebear.com/7.x/personas/svg?seed=Sophie&backgroundColor=c1e1c5", name: "Sophie" },
];

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { list } = useSelector((state) => state.orders);
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [notification, setNotification] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India"
    }
  });

  useEffect(() => {
    dispatch(fetchMyOrders());
    setIsVisible(true);
  }, [dispatch]);

  // Calculate analytics data
  const analytics = useMemo(() => {
    const totalSpent = list.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
    // Check both orderStatus and status for compatibility
    const deliveredOrders = list.filter(o => (o.orderStatus || o.status) === 'delivered');
    const avgOrderValue = list.length > 0 ? totalSpent / list.length : 0;
    
    // Calculate spending by month (last 6 months)
    const monthlySpending = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = month.toLocaleDateString('en-US', { month: 'short' });
      monthlySpending[monthKey] = 0;
    }
    
    list.forEach(order => {
      const orderDate = new Date(order.createdAt);
      const monthKey = orderDate.toLocaleDateString('en-US', { month: 'short' });
      if (monthlySpending.hasOwnProperty(monthKey)) {
        monthlySpending[monthKey] += order.totalAmount || 0;
      }
    });

    // Calculate category breakdown
    const categoryCount = {};
    list.forEach(order => {
      order.items?.forEach(item => {
        const category = item.product?.category || 'Other';
        categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
      });
    });

    const topCategories = Object.entries(categoryCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    // Loyalty tier calculation
    let tier = 'Bronze';
    let tierColor = 'from-amber-600 to-amber-800';
    let tierBg = 'bg-amber-500/20';
    let discount = 0;
    let nextTierSpend = 10000;
    let progress = (totalSpent / 10000) * 100;

    if (totalSpent >= 50000) {
      tier = 'Platinum';
      tierColor = 'from-slate-300 to-slate-500';
      tierBg = 'bg-slate-400/20';
      discount = 15;
      nextTierSpend = null;
      progress = 100;
    } else if (totalSpent >= 25000) {
      tier = 'Gold';
      tierColor = 'from-yellow-400 to-yellow-600';
      tierBg = 'bg-yellow-500/20';
      discount = 10;
      nextTierSpend = 50000;
      progress = ((totalSpent - 25000) / 25000) * 100;
    } else if (totalSpent >= 10000) {
      tier = 'Silver';
      tierColor = 'from-gray-300 to-gray-500';
      tierBg = 'bg-gray-400/20';
      discount = 5;
      nextTierSpend = 25000;
      progress = ((totalSpent - 10000) / 15000) * 100;
    }

    // Member since
    const memberSince = user?.createdAt 
      ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
      : 'N/A';

    return {
      totalSpent,
      avgOrderValue,
      monthlySpending,
      topCategories,
      tier,
      tierColor,
      tierBg,
      discount,
      nextTierSpend,
      progress: Math.min(progress, 100),
      memberSince,
      deliveredCount: deliveredOrders.length
    };
  }, [list, user]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const openEditModal = () => {
    setEditForm({
      name: user?.name || "",
      phone: user?.phone || "",
      address: {
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        pincode: user?.address?.pincode || "",
        country: user?.address?.country || "India"
      }
    });
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const openAvatarModal = () => {
    setSelectedAvatar(user?.customAvatar || user?.avatar || null);
    setShowAvatarModal(true);
  };

  const closeAvatarModal = () => {
    setShowAvatarModal(false);
    setSelectedAvatar(null);
  };

  const handleAvatarSelect = (avatarUrl) => {
    setSelectedAvatar(avatarUrl);
  };

  const handleAvatarSave = async () => {
    if (!selectedAvatar) return;
    setSavingAvatar(true);
    try {
      const { data } = await api.put("/users/profile", { avatar: selectedAvatar });
      dispatch(setUser(data.data));
      showNotification("Avatar updated successfully!");
      closeAvatarModal();
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to update avatar", "error");
    } finally {
      setSavingAvatar(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEditForm(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setEditForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.put("/users/profile", editForm);
      dispatch(setUser(data.data));
      showNotification("Profile updated successfully!");
      closeEditModal();
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-dark-bg' : 'bg-stone-50'}`}>
      {/* Minimal Industrial Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute inset-0 ${darkMode ? 'bg-gradient-to-br from-dark-bg via-dark-card/30 to-dark-bg' : 'bg-gradient-to-br from-stone-50 via-white to-stone-50'}`}></div>
        <div className={`absolute w-[500px] h-[500px] rounded-full blur-[180px] ${darkMode ? 'bg-brand-primary/5' : 'bg-brand-primary/8'} -top-32 -right-32`}></div>
      </div>
      <div className="relative z-10 p-4 space-y-6 sm:p-5 lg:p-8">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] px-5 py-3 shadow-xl ${
          notification.type === "error" ? "bg-red-500" : "bg-green-500"
        } text-white font-bold flex items-center gap-2`}>
          {notification.type === "error" ? (
            <ErrorIcon sx={{ fontSize: 18 }} />
          ) : (
            <CheckCircleIcon sx={{ fontSize: 18 }} />
          )}
          {notification.message}
        </div>
      )}

      {/* Profile Card - Industrial Style */}
      <div className={`p-5 sm:p-6 lg:p-8 border transition-all duration-500 ${
        darkMode 
          ? 'bg-dark-card border-dark-border hover:border-brand-primary/40' 
          : 'bg-white border-stone-200 hover:border-brand-primary/40 shadow-sm hover:shadow-md'
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}>
        {/* Profile Header */}
        <div className={`flex flex-col lg:flex-row items-center gap-6 pb-6 mb-6 border-b ${
          darkMode ? 'border-dark-border' : 'border-stone-200'
        }`}>
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className={`w-24 h-24 sm:w-28 sm:h-28 overflow-hidden border-2 ${
              darkMode ? 'border-brand-primary/40 bg-dark-bg' : 'border-brand-primary/30 bg-stone-100'
            }`}>
              {user?.customAvatar ? (
                <img src={user.customAvatar} alt={user.name} className="object-cover w-full h-full" />
              ) : user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="object-cover w-full h-full" />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-3xl font-black text-white sm:text-4xl bg-brand-primary">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
              )}
            </div>
            <button
              onClick={openAvatarModal}
              className="absolute flex items-center justify-center w-8 h-8 text-white bg-brand-primary hover:bg-brand-secondary transition-all bottom-0 right-0"
            >
              <CameraAltIcon sx={{ fontSize: 16 }} />
            </button>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className={`text-2xl sm:text-3xl font-black ${darkMode ? 'text-white' : 'text-brand-dark'}`}>{user?.name}</h2>
            <p className={`mt-1 text-sm ${darkMode ? 'text-dark-muted' : 'text-stone-600'}`}>{user?.email}</p>
            <div className="flex flex-wrap justify-center gap-2 mt-3 lg:justify-start">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                darkMode ? 'bg-brand-primary/20 text-brand-primary' : 'bg-brand-primary/10 text-brand-primary'
              }`}>
                {user?.role}
              </span>
              {user?.isEmailVerified && (
                <span className={`flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                  darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                }`}>
                  <CheckCircleIcon sx={{ fontSize: 12 }} />
                  Verified
                </span>
              )}
              <span className={`flex items-center gap-1 px-3 py-1 text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${analytics.tierColor} text-white`}>
                <EmojiEventsIcon sx={{ fontSize: 12 }} />
                {analytics.tier}
              </span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider text-white bg-brand-primary hover:bg-brand-secondary transition-all"
          >
            <EditIcon sx={{ fontSize: 16 }} />
            Edit Profile
          </button>
        </div>

        {/* Profile Details Grid */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={`flex items-center gap-3 p-4 border transition-all ${
            darkMode 
              ? 'bg-dark-bg border-dark-border hover:border-brand-primary/40' 
              : 'bg-stone-50 border-stone-200 hover:border-brand-primary/40'
          }`}>
            <div className="flex items-center justify-center p-3 bg-brand-primary/10 rounded-2xl w-12 h-12">
              <PersonIcon sx={{ fontSize: 24 }} className="text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Name</p>
              <p className={`text-sm font-bold truncate ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{user?.name}</p>
            </div>
          </div>
          
          <div className={`flex items-center gap-3 p-4 transition-all rounded-2xl ${
            darkMode 
              ? 'bg-dark-bg hover:bg-dark-hover' 
              : 'bg-slate-50 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-primary/5'
          }`}>
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${
              darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
            }`}>
              <EmailIcon sx={{ fontSize: 24 }} className="text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Email</p>
              <p className={`text-sm font-bold truncate ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{user?.email}</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-4 transition-all rounded-2xl ${
            darkMode 
              ? 'bg-dark-bg hover:bg-dark-hover' 
              : 'bg-slate-50 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-primary/5'
          }`}>
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${
              darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
            }`}>
              <PhoneIcon sx={{ fontSize: 24 }} className="text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Phone</p>
              <p className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{user?.phone || 'Not set'}</p>
            </div>
          </div>

          <div className={`flex items-center gap-3 p-4 transition-all rounded-2xl ${
            darkMode 
              ? 'bg-dark-bg hover:bg-dark-hover' 
              : 'bg-slate-50 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-primary/5'
          }`}>
            <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${
              darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
            }`}>
              <CalendarTodayIcon sx={{ fontSize: 24 }} className="text-brand-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Member Since</p>
              <p className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{analytics.memberSince}</p>
            </div>
          </div>

          {(user?.address?.city || user?.address?.state) && (
            <div className={`flex items-center gap-3 p-4 transition-all rounded-2xl sm:col-span-2 lg:col-span-4 ${
              darkMode 
                ? 'bg-dark-bg hover:bg-dark-hover' 
                : 'bg-slate-50 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-primary/5'
            }`}>
              <div className={`flex items-center justify-center w-12 h-12 rounded-2xl ${
                darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
              }`}>
                <LocationCityIcon sx={{ fontSize: 24 }} className="text-brand-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Location</p>
                <p className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>
                  {[user?.address?.street, user?.address?.city, user?.address?.state, user?.address?.pincode].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loyalty & Discount Card */}
      <div className={`group rounded-2xl lg:rounded-3xl p-4 sm:p-6 border shadow-lg transition-all duration-700 overflow-hidden relative ${
        darkMode 
          ? 'bg-dark-card border-dark-border hover:border-brand-gold/40' 
          : 'bg-gradient-to-br from-white to-amber-50/30 border-brand-primary/10 hover:shadow-xl hover:border-brand-gold/30'
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`} style={{ transitionDelay: "100ms" }}>
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-64 h-64 translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-brand-gold/10 to-brand-primary/10 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
            {/* Tier Badge */}
            <div className="flex items-center gap-4">
              <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center bg-gradient-to-br ${analytics.tierColor} shadow-lg`}>
                <EmojiEventsIcon sx={{ fontSize: 48 }} className="text-white" />
              </div>
              <div>
                <p className={`text-xs uppercase tracking-[0.3em] font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Your Status</p>
                <h3 className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${analytics.tierColor} bg-clip-text text-transparent`}>
                  {analytics.tier} Member
                </h3>
                <p className={`mt-1 flex items-center gap-2 text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  <LocalOfferIcon sx={{ fontSize: 18 }} />
                  {analytics.discount}% discount on all orders!
                </p>
              </div>
            </div>

            {/* Progress to next tier */}
            <div className="flex-1 lg:max-w-md">
              {analytics.nextTierSpend ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-semibold ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
                      Progress to {analytics.tier === 'Bronze' ? 'Silver' : analytics.tier === 'Silver' ? 'Gold' : 'Platinum'}
                    </span>
                    <span className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>
                      ₹{analytics.totalSpent.toLocaleString()} / ₹{analytics.nextTierSpend.toLocaleString()}
                    </span>
                  </div>
                  <div className={`h-3 rounded-full overflow-hidden ${darkMode ? 'bg-dark-bg' : 'bg-slate-200'}`}>
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${analytics.tierColor} transition-all duration-1000`}
                      style={{ width: `${analytics.progress}%` }}
                    ></div>
                  </div>
                  <p className={`mt-2 text-xs ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
                    Spend ₹{(analytics.nextTierSpend - analytics.totalSpent).toLocaleString()} more to unlock the next tier!
                  </p>
                </div>
              ) : (
                <div className={`p-4 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-gradient-to-r from-slate-100 to-slate-50'}`}>
                  <p className={`flex items-center gap-2 text-sm font-bold ${darkMode ? 'text-brand-gold' : 'text-brand-primary'}`}>
                    <StarIcon sx={{ fontSize: 18 }} />
                    You've reached the highest tier! Enjoy maximum benefits.
                  </p>
                </div>
              )}
            </div>

            {/* Discount Benefit Card */}
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-dark-bg border border-dark-border' : 'bg-white shadow-md'}`}>
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600">
                  <CardGiftcardIcon sx={{ fontSize: 24 }} className="text-white" />
                </div>
                <div>
                  <p className={`text-xs uppercase tracking-wider font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Your Discount</p>
                  <p className="text-2xl font-black text-green-500">{analytics.discount}% OFF</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tier Benefits */}
          <div className="grid grid-cols-2 gap-3 mt-6 sm:grid-cols-4">
            {[
              { tier: 'Bronze', spend: '₹0', discount: '0%', active: analytics.tier === 'Bronze' },
              { tier: 'Silver', spend: '₹10,000+', discount: '5%', active: analytics.tier === 'Silver' },
              { tier: 'Gold', spend: '₹25,000+', discount: '10%', active: analytics.tier === 'Gold' },
              { tier: 'Platinum', spend: '₹50,000+', discount: '15%', active: analytics.tier === 'Platinum' },
            ].map((t) => (
              <div 
                key={t.tier}
                className={`p-3 rounded-2xl text-center transition-all ${
                  t.active 
                    ? 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20 ring-2 ring-brand-primary' 
                    : darkMode ? 'bg-dark-bg' : 'bg-brand-cream'
                }`}
              >
                <p className={`text-xs font-bold ${t.active ? 'text-brand-primary' : darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{t.tier}</p>
                <p className={`text-sm font-bold mt-1 ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{t.discount}</p>
                <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{t.spend}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders Stats Card */}
        <div className={`group rounded-2xl lg:rounded-3xl p-6 border shadow-lg transition-all duration-700 ${
          darkMode 
            ? 'bg-dark-card border-dark-border hover:border-brand-secondary/40' 
            : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10 hover:shadow-xl hover:border-brand-secondary/30'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "150ms" }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Total Orders</p>
              <h2 className={`mt-2 text-4xl sm:text-5xl font-black transition-colors group-hover:text-brand-secondary ${
                darkMode ? 'text-dark-text' : 'text-slate-900'
              }`}>{list.length}</h2>
              <p className={`mt-1 text-sm font-medium ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
                {analytics.deliveredCount} delivered
              </p>
            </div>
            <div className={`flex items-center justify-center transition-transform w-14 h-14 rounded-2xl group-hover:scale-110 ${
              darkMode ? 'bg-brand-secondary/20' : 'bg-gradient-to-br from-brand-secondary/20 to-brand-secondary/5'
            }`}>
              <ShoppingBagIcon sx={{ fontSize: 32 }} className="text-brand-secondary" />
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Pending</p>
              <p className={`mt-1 text-xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                {list.filter(o => (o.orderStatus || o.status) === 'pending' || (o.orderStatus || o.status) === 'processing').length}
              </p>
            </div>
            <div className={`p-3 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Shipped</p>
              <p className={`mt-1 text-xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                {list.filter(o => (o.orderStatus || o.status) === 'shipped').length}
              </p>
            </div>
          </div>
        </div>

        {/* Total Spent Card */}
        <div className={`group rounded-2xl lg:rounded-3xl p-6 border shadow-lg transition-all duration-700 ${
          darkMode 
            ? 'bg-dark-card border-dark-border hover:border-brand-primary/40' 
            : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10 hover:shadow-xl hover:border-brand-primary/30'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "200ms" }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Total Spent</p>
              <h2 className={`mt-2 text-3xl sm:text-4xl font-black transition-colors group-hover:text-brand-primary ${
                darkMode ? 'text-dark-text' : 'text-slate-900'
              }`}>₹{analytics.totalSpent.toLocaleString()}</h2>
              <p className={`mt-1 text-sm font-medium ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
                Avg: ₹{Math.round(analytics.avgOrderValue).toLocaleString()}/order
              </p>
            </div>
            <div className={`flex items-center justify-center transition-transform w-14 h-14 rounded-2xl group-hover:scale-110 ${
              darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
            }`}>
              <TrendingUpIcon sx={{ fontSize: 32 }} className="text-brand-primary" />
            </div>
          </div>

          {/* Mini Spending Chart */}
          <div className="mt-4">
            <p className={`text-xs font-semibold uppercase tracking-wider mb-3 ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Last 6 Months</p>
            <div className="flex items-end h-16 gap-1">
              {Object.entries(analytics.monthlySpending).map(([month, amount], i) => {
                const maxSpend = Math.max(...Object.values(analytics.monthlySpending), 1);
                const height = (amount / maxSpend) * 100;
                return (
                  <div key={month} className="flex flex-col items-center flex-1 gap-1">
                    <div 
                      className="w-full transition-all duration-500 rounded-t-sm bg-gradient-to-t from-brand-primary to-brand-gold"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    ></div>
                    <span className={`text-[10px] font-medium ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{month}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Categories Card */}
        <div className={`group rounded-2xl lg:rounded-3xl p-6 border shadow-lg transition-all duration-700 ${
          darkMode 
            ? 'bg-dark-card border-dark-border hover:border-brand-gold/40' 
            : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10 hover:shadow-xl hover:border-brand-gold/30'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "250ms" }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className={`text-xs uppercase tracking-[0.3em] font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Top Categories</p>
              <h2 className={`mt-2 text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-slate-900'}`}>
                Your Favorites
              </h2>
            </div>
            <div className={`flex items-center justify-center transition-transform w-14 h-14 rounded-2xl group-hover:scale-110 ${
              darkMode ? 'bg-brand-gold/20' : 'bg-gradient-to-br from-brand-gold/20 to-brand-primary/10'
            }`}>
              <CategoryIcon sx={{ fontSize: 32 }} className="text-brand-gold" />
            </div>
          </div>

          <div className="space-y-3">
            {analytics.topCategories.length > 0 ? (
              analytics.topCategories.map(([category, count], index) => (
                <div key={category} className={`flex items-center gap-3 p-3 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${
                    index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                    index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                    'bg-gradient-to-br from-amber-600 to-amber-800'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{category}</p>
                    <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>{count} items purchased</p>
                  </div>
                </div>
              ))
            ) : (
              <div className={`p-4 text-center rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
                <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>No purchases yet</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      {list.length > 0 && (
        <div className={`rounded-2xl lg:rounded-3xl border shadow-lg p-5 lg:p-8 transition-all duration-700 ${
          darkMode 
            ? 'bg-dark-card border-dark-border' 
            : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "200ms" }}>
          <div className="mb-6">
            <p className={`text-xs uppercase tracking-[0.4em] font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>Recent Activity</p>
            <h3 className={`mt-1 text-xl lg:text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-slate-900'}`}>Your Orders</h3>
          </div>
          <div className="space-y-3">
            {list.slice(0, 5).map((order, index) => (
              <div
                key={order._id}
                className={`flex items-center gap-4 p-4 rounded-2xl lg:rounded-2xl transition-all duration-500 border ${
                  darkMode 
                    ? 'bg-dark-bg hover:bg-dark-hover border-dark-border hover:border-brand-primary/30' 
                    : 'bg-slate-50 hover:bg-slate-100 border-brand-primary/10 hover:border-brand-primary/20'
                } ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                }`}
                style={{ transitionDelay: `${200 + index * 50}ms` }}
              >
                <div className={`flex items-center justify-center flex-shrink-0 w-12 h-12 transition-transform rounded-2xl group-hover:scale-110 ${
                  darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
                }`}>
                  <ShoppingBagIcon sx={{ fontSize: 24 }} className="text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Order #{order._id?.slice(-6).toUpperCase()}</p>
                  <p className={`text-sm truncate ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-bold text-brand-primary">₹ {order.totalAmount?.toLocaleString()}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1 ${
                    (order.orderStatus || order.status) === 'delivered' 
                      ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                      : (order.orderStatus || order.status) === 'pending' 
                        ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                        : (order.orderStatus || order.status) === 'shipped' 
                          ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                          : darkMode ? 'bg-dark-hover text-dark-muted' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {(order.orderStatus || order.status)?.charAt(0).toUpperCase() + (order.orderStatus || order.status)?.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-start justify-center overflow-y-auto py-8 px-4" onClick={closeEditModal}>
          <div
            className={`w-full max-w-lg my-auto shadow-2xl rounded-2xl lg:rounded-3xl animate-scale-in ${
              darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`sticky top-0 z-10 flex items-center justify-between px-6 py-5 border-b rounded-t-2xl lg:rounded-t-3xl ${
              darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-brand-primary/10'
            }`}>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Edit Profile</h2>
                <p className={`mt-1 text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Update your personal information</p>
              </div>
              <button
                onClick={closeEditModal}
                className={`p-2 transition-colors rounded-2xl ${
                  darkMode ? 'hover:bg-dark-hover text-dark-muted' : 'hover:bg-slate-100 text-brand-slate'
                }`}
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className={`flex items-center gap-2 mb-2 text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>
                  <PersonIcon sx={{ fontSize: 18 }} />
                  Full Name
                </label>
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-2xl ${
                    darkMode 
                      ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                      : 'bg-white border-slate-200 text-brand-dark placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                  }`}
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`flex items-center gap-2 mb-2 text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>
                  <PhoneIcon sx={{ fontSize: 18 }} />
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={editForm.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-2xl ${
                    darkMode 
                      ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                      : 'bg-white border-slate-200 text-brand-dark placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                  }`}
                />
              </div>

              {/* Address Section */}
              <div className="space-y-4">
                <p className={`flex items-center gap-2 text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>
                  <HomeIcon sx={{ fontSize: 18 }} />
                  Address
                </p>
                
                <input
                  name="address.street"
                  value={editForm.address.street}
                  onChange={handleChange}
                  placeholder="Street address"
                  className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-2xl ${
                    darkMode 
                      ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                      : 'bg-white border-slate-200 text-brand-dark placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                  }`}
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="address.city"
                    value={editForm.address.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-2xl ${
                      darkMode 
                        ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                        : 'bg-white border-slate-200 text-brand-dark placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                    }`}
                  />
                  <input
                    name="address.state"
                    value={editForm.address.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-2xl ${
                      darkMode 
                        ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                        : 'bg-white border-slate-200 text-brand-dark placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="address.pincode"
                    value={editForm.address.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-2xl ${
                      darkMode 
                        ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                        : 'bg-white border-slate-200 text-brand-dark placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                    }`}
                  />
                  <input
                    name="address.country"
                    value={editForm.address.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-2xl ${
                      darkMode 
                        ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                        : 'bg-white border-slate-200 text-brand-dark placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                    }`}
                  />
                </div>
              </div>

              <div className={`flex items-center justify-end gap-4 pt-4 border-t ${darkMode ? 'border-dark-border' : 'border-brand-primary/10'}`}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className={`px-5 py-2.5 font-semibold rounded-2xl transition-colors ${
                    darkMode ? 'text-dark-text hover:bg-dark-hover' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-gold text-white font-semibold rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon sx={{ fontSize: 18 }} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center overflow-y-auto p-4" onClick={closeAvatarModal}>
          <div
            className={`rounded-2xl lg:rounded-3xl shadow-2xl w-full max-w-2xl mx-auto animate-scale-in max-h-[90vh] overflow-hidden ${
              darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-gradient-to-r from-brand-primary to-brand-gold">
              <div className="text-white">
                <h2 className="flex items-center gap-2 text-xl font-extrabold">
                  <AddPhotoAlternateIcon sx={{ fontSize: 24 }} />
                  Choose Your Avatar
                </h2>
                <p className="mt-1 text-sm text-white/80">Select an avatar that represents you</p>
              </div>
              <button
                onClick={closeAvatarModal}
                className="p-2 text-white transition-colors hover:bg-white/20 rounded-2xl"
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className={`p-6 border-b ${
              darkMode 
                ? 'bg-dark-bg border-dark-border' 
                : 'bg-gradient-to-br from-slate-50 to-white border-brand-primary/10'
            }`}>
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <div className="relative">
                  <div className="w-24 h-24 overflow-hidden border-4 rounded-full shadow-xl border-brand-primary/30 bg-gradient-to-br from-brand-primary/20 to-brand-gold/20">
                    {selectedAvatar ? (
                      <img 
                        src={selectedAvatar} 
                        alt="Selected avatar" 
                        className="object-cover w-full h-full"
                      />
                    ) : user?.customAvatar ? (
                      <img 
                        src={user.customAvatar} 
                        alt={user.name} 
                        className="object-cover w-full h-full"
                      />
                    ) : user?.avatar ? (
                      <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-3xl font-extrabold text-white bg-gradient-to-br from-brand-primary to-brand-gold">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  {selectedAvatar && selectedAvatar !== user?.customAvatar && selectedAvatar !== user?.avatar && (
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-500 rounded-full shadow-lg -top-1 -right-1">
                      <CheckCircleIcon sx={{ fontSize: 16 }} className="text-white" />
                    </span>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <p className={`text-sm font-medium ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>Preview</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-slate-900'}`}>{user?.name}</p>
                  {selectedAvatar && selectedAvatar !== user?.customAvatar && selectedAvatar !== user?.avatar && (
                    <p className="mt-1 text-sm font-bold text-brand-primary animate-pulse">New avatar selected!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Avatar Grid */}
            <div className={`p-6 overflow-y-auto max-h-[40vh] ${darkMode ? 'bg-dark-card' : ''}`}>
              <p className={`flex items-center gap-2 mb-4 text-sm font-bold tracking-wider uppercase ${
                darkMode ? 'text-dark-muted' : 'text-slate-600'
              }`}>
                <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                Select an Avatar
              </p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
                {avatarOptions.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => handleAvatarSelect(avatar.url)}
                    className={`relative group rounded-2xl p-2 transition-all duration-300 hover:scale-110 ${
                      selectedAvatar === avatar.url
                        ? "bg-gradient-to-br from-brand-primary/20 to-brand-gold/20 ring-2 ring-brand-primary shadow-lg"
                        : darkMode 
                          ? "bg-dark-bg hover:bg-dark-hover hover:shadow-md" 
                          : "bg-slate-50 hover:bg-slate-100 hover:shadow-md"
                    }`}
                  >
                    <img 
                      src={avatar.url} 
                      alt={avatar.name}
                      className="object-cover w-full aspect-square rounded-2xl"
                    />
                    {selectedAvatar === avatar.url && (
                      <span className="absolute flex items-center justify-center w-5 h-5 rounded-full shadow-lg -top-1 -right-1 bg-brand-primary">
                        <CheckCircleIcon sx={{ fontSize: 14 }} className="text-white" />
                      </span>
                    )}
                    <p className={`mt-1 text-xs font-bold text-center truncate group-hover:text-brand-primary ${
                      darkMode ? 'text-dark-muted' : 'text-slate-600'
                    }`}>{avatar.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className={`sticky bottom-0 flex flex-col items-center justify-end gap-3 px-6 py-4 border-t sm:flex-row ${
              darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-brand-primary/10'
            }`}>
              <button
                type="button"
                onClick={closeAvatarModal}
                className={`w-full sm:w-auto px-6 py-2.5 font-bold rounded-2xl transition-colors ${
                  darkMode ? 'text-dark-text hover:bg-dark-hover' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAvatarSave}
                disabled={savingAvatar || !selectedAvatar || (selectedAvatar === user?.customAvatar || selectedAvatar === user?.avatar)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-gold text-white font-bold rounded-2xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
              >
                {savingAvatar ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <SaveIcon sx={{ fontSize: 18 }} />
                    Save Avatar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default UserDashboard;

