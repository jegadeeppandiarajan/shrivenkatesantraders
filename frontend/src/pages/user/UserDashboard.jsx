import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../features/orders/orderSlice";
import { setUser } from "../../features/auth/authSlice";
import { useTheme } from "../../context/ThemeContext";
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
    setSelectedAvatar(user?.avatar || null);
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
    <div className="p-5 lg:p-8 space-y-6">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-[100] px-6 py-4 rounded-2xl shadow-2xl animate-slide-in-right ${
          notification.type === "error" ? "bg-red-500" : "bg-green-500"
        } text-white font-semibold flex items-center gap-3`}>
          {notification.type === "error" ? (
            <ErrorIcon sx={{ fontSize: 20 }} />
          ) : (
            <CheckCircleIcon sx={{ fontSize: 20 }} />
          )}
          {notification.message}
        </div>
      )}

      {/* Profile and Orders Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Profile Card */}
        <div className={`group rounded-2xl lg:rounded-3xl p-4 sm:p-6 border shadow-lg transition-all duration-700 h-full ${
          darkMode 
            ? 'bg-dark-card border-dark-border hover:border-brand-primary/40' 
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-100 hover:shadow-xl hover:border-brand-primary/30'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          {/* Profile Header with Avatar */}
          <div className={`flex flex-col items-center gap-4 pb-6 mb-6 border-b sm:flex-row ${
            darkMode ? 'border-dark-border' : 'border-slate-100'
          }`}>
            {/* Avatar with Edit Button */}
            <div className="relative group/avatar">
              <div className={`w-24 h-24 overflow-hidden border-4 rounded-full shadow-xl sm:w-28 sm:h-28 ${
                darkMode ? 'border-brand-primary/40' : 'border-brand-primary/30'
              } bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20`}>
                {user?.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-3xl font-extrabold text-white bg-gradient-to-br from-brand-primary via-brand-gold to-brand-secondary sm:text-4xl">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>
              {/* Camera Icon Overlay */}
              <button
                onClick={openAvatarModal}
                className="absolute flex items-center justify-center text-white transition-all duration-300 border-2 border-white rounded-full shadow-lg bottom-1 right-1 w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-r from-brand-primary via-brand-gold to-brand-secondary hover:scale-110"
              >
                <CameraAltIcon sx={{ fontSize: 18 }} />
              </button>
            </div>
            
            {/* User Info Header */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className={`text-xl font-extrabold sm:text-2xl ${
                darkMode ? 'text-dark-text' : 'text-transparent bg-gradient-to-r from-slate-900 via-brand-primary to-brand-gold bg-clip-text'
              }`}>{user?.name}</h2>
              <p className={`mt-1 text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>{user?.email}</p>
              <div className="flex flex-wrap justify-center gap-2 mt-2 sm:justify-start">
                <span className={`px-3 py-1 text-xs font-bold capitalize border rounded-full ${
                  darkMode 
                    ? 'bg-brand-primary/20 text-brand-primary border-brand-primary/30' 
                    : 'bg-gradient-to-r from-brand-primary/10 to-brand-gold/10 text-brand-primary border-brand-primary/20'
                }`}>
                  {user?.role}
                </span>
                {user?.isEmailVerified && (
                  <span className={`flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full ${
                    darkMode 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'text-green-600 border border-green-200 bg-green-50'
                  }`}>
                    <CheckCircleIcon sx={{ fontSize: 12 }} />
                    Verified
                  </span>
                )}
              </div>
            </div>

            {/* Edit Button */}
            <button
              onClick={openEditModal}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-brand-primary via-brand-gold to-brand-secondary hover:shadow-lg hover:scale-105 rounded-xl transition-all"
            >
              <EditIcon sx={{ fontSize: 16 }} />
              Edit Profile
            </button>
          </div>

          {/* Profile Details */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className={`flex items-center gap-3 p-3 transition-all rounded-xl ${
              darkMode 
                ? 'bg-dark-bg hover:bg-dark-hover' 
                : 'bg-slate-50 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-primary/5'
            }`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
              }`}>
                <PersonIcon sx={{ fontSize: 20 }} className="text-brand-primary" />
              </div>
              <div>
                <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Name</p>
                <p className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{user?.name}</p>
              </div>
            </div>
            
            <div className={`flex items-center gap-3 p-3 transition-all rounded-xl ${
              darkMode 
                ? 'bg-dark-bg hover:bg-dark-hover' 
                : 'bg-slate-50 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-primary/5'
            }`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
              }`}>
                <EmailIcon sx={{ fontSize: 20 }} className="text-brand-primary" />
              </div>
              <div className="min-w-0">
                <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Email</p>
                <p className={`text-sm font-bold truncate ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{user?.email}</p>
              </div>
            </div>

            {user?.phone && (
              <div className={`flex items-center gap-3 p-3 transition-all rounded-xl ${
                darkMode 
                  ? 'bg-dark-bg hover:bg-dark-hover' 
                  : 'bg-slate-50 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-primary/5'
              }`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                  darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
                }`}>
                  <PhoneIcon sx={{ fontSize: 20 }} className="text-brand-primary" />
                </div>
                <div>
                  <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Phone</p>
                  <p className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{user?.phone}</p>
                </div>
              </div>
            )}

            <div className={`flex items-center gap-3 p-3 transition-all rounded-xl ${
              darkMode 
                ? 'bg-dark-bg hover:bg-dark-hover' 
                : 'bg-slate-50 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-primary/5'
            }`}>
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
              }`}>
                <BadgeIcon sx={{ fontSize: 20 }} className="text-brand-primary" />
              </div>
              <div>
                <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Role</p>
                <p className={`text-sm font-bold capitalize ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>{user?.role}</p>
              </div>
            </div>

            {(user?.address?.city || user?.address?.state) && (
              <div className={`flex items-center gap-3 p-3 transition-all rounded-xl sm:col-span-2 ${
                darkMode 
                  ? 'bg-dark-bg hover:bg-dark-hover' 
                  : 'bg-slate-50 hover:bg-gradient-to-r hover:from-brand-light hover:to-brand-primary/5'
              }`}>
                <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${
                  darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
                }`}>
                  <LocationCityIcon sx={{ fontSize: 20 }} className="text-brand-primary" />
                </div>
                <div>
                  <p className={`text-xs font-bold tracking-wider uppercase ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Location</p>
                  <p className={`text-sm font-bold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>
                    {[user?.address?.street, user?.address?.city, user?.address?.state, user?.address?.pincode].filter(Boolean).join(", ")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Orders Stats Card */}
        <div className={`group rounded-2xl lg:rounded-3xl p-6 border shadow-lg transition-all duration-700 h-full flex flex-col ${
          darkMode 
            ? 'bg-dark-card border-dark-border hover:border-brand-secondary/40' 
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-100 hover:shadow-xl hover:border-brand-secondary/30'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "100ms" }}>
          <div className="flex items-start justify-between mb-6">
            <div>
              <p className={`text-xs uppercase tracking-[0.4em] font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Orders</p>
              <h2 className={`mt-3 text-5xl font-black transition-colors group-hover:text-brand-secondary ${
                darkMode ? 'text-dark-text' : 'text-slate-900'
              }`}>{list.length}</h2>
              <p className={`mt-2 text-sm font-medium ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>Total orders placed</p>
            </div>
            <div className={`flex items-center justify-center transition-transform w-16 h-16 rounded-2xl group-hover:scale-110 ${
              darkMode ? 'bg-brand-secondary/20' : 'bg-gradient-to-br from-brand-secondary/20 to-brand-secondary/5'
            }`}>
              <ShoppingBagIcon sx={{ fontSize: 36 }} className="text-brand-secondary" />
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="flex-1">
            <div className="grid grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-dark-bg' : 'bg-slate-50'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Pending</p>
                <p className={`mt-1 text-2xl font-bold ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                  {list.filter(o => o.status === 'pending' || o.status === 'processing').length}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-dark-bg' : 'bg-slate-50'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Delivered</p>
                <p className={`mt-1 text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {list.filter(o => o.status === 'delivered').length}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-dark-bg' : 'bg-slate-50'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Shipped</p>
                <p className={`mt-1 text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {list.filter(o => o.status === 'shipped').length}
                </p>
              </div>
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-dark-bg' : 'bg-slate-50'}`}>
                <p className={`text-xs font-semibold uppercase tracking-wider ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Total Spent</p>
                <p className={`mt-1 text-lg font-bold text-brand-primary`}>
                  ₹{list.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      {list.length > 0 && (
        <div className={`rounded-2xl lg:rounded-3xl border shadow-lg p-5 lg:p-8 transition-all duration-700 ${
          darkMode 
            ? 'bg-dark-card border-dark-border' 
            : 'bg-gradient-to-br from-white to-slate-50 border-slate-100'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "200ms" }}>
          <div className="mb-6">
            <p className={`text-xs uppercase tracking-[0.4em] font-semibold ${darkMode ? 'text-dark-muted' : 'text-slate-400'}`}>Recent Activity</p>
            <h3 className={`mt-1 text-xl lg:text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-slate-900'}`}>Your Orders</h3>
          </div>
          <div className="space-y-3">
            {list.slice(0, 5).map((order, index) => (
              <div
                key={order._id}
                className={`flex items-center gap-4 p-4 rounded-xl lg:rounded-2xl transition-all duration-500 border ${
                  darkMode 
                    ? 'bg-dark-bg hover:bg-dark-hover border-dark-border hover:border-brand-primary/30' 
                    : 'bg-slate-50 hover:bg-slate-100 border-slate-100 hover:border-brand-primary/20'
                } ${
                  isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                }`}
                style={{ transitionDelay: `${200 + index * 50}ms` }}
              >
                <div className={`flex items-center justify-center flex-shrink-0 w-12 h-12 transition-transform rounded-xl group-hover:scale-110 ${
                  darkMode ? 'bg-brand-primary/20' : 'bg-gradient-to-br from-brand-primary/20 to-brand-gold/20'
                }`}>
                  <ShoppingBagIcon sx={{ fontSize: 24 }} className="text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-slate-800'}`}>Order #{order._id?.slice(-6).toUpperCase()}</p>
                  <p className={`text-sm truncate ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>
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
                    order.status === 'delivered' 
                      ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                      : order.status === 'pending' 
                        ? darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-600'
                        : order.status === 'shipped' 
                          ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                          : darkMode ? 'bg-dark-hover text-dark-muted' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
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
              darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-slate-100'
            }`}>
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-slate-800'}`}>Edit Profile</h2>
                <p className={`mt-1 text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>Update your personal information</p>
              </div>
              <button
                onClick={closeEditModal}
                className={`p-2 transition-colors rounded-xl ${
                  darkMode ? 'hover:bg-dark-hover text-dark-muted' : 'hover:bg-slate-100 text-slate-500'
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
                  className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-xl ${
                    darkMode 
                      ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
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
                  className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-xl ${
                    darkMode 
                      ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
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
                  className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-xl ${
                    darkMode 
                      ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                      : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                  }`}
                />

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="address.city"
                    value={editForm.address.city}
                    onChange={handleChange}
                    placeholder="City"
                    className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-xl ${
                      darkMode 
                        ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                    }`}
                  />
                  <input
                    name="address.state"
                    value={editForm.address.state}
                    onChange={handleChange}
                    placeholder="State"
                    className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-xl ${
                      darkMode 
                        ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    name="address.pincode"
                    value={editForm.address.pincode}
                    onChange={handleChange}
                    placeholder="Pincode"
                    className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-xl ${
                      darkMode 
                        ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                    }`}
                  />
                  <input
                    name="address.country"
                    value={editForm.address.country}
                    onChange={handleChange}
                    placeholder="Country"
                    className={`w-full px-4 py-3 transition-all border-2 outline-none rounded-xl ${
                      darkMode 
                        ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                        : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
                    }`}
                  />
                </div>
              </div>

              <div className={`flex items-center justify-end gap-4 pt-4 border-t ${darkMode ? 'border-dark-border' : 'border-slate-100'}`}>
                <button
                  type="button"
                  onClick={closeEditModal}
                  className={`px-5 py-2.5 font-semibold rounded-xl transition-colors ${
                    darkMode ? 'text-dark-text hover:bg-dark-hover' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-gold text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="p-2 text-white transition-colors hover:bg-white/20 rounded-xl"
              >
                <CloseIcon sx={{ fontSize: 24 }} />
              </button>
            </div>

            {/* Current Avatar Preview */}
            <div className={`p-6 border-b ${
              darkMode 
                ? 'bg-dark-bg border-dark-border' 
                : 'bg-gradient-to-br from-slate-50 to-white border-slate-100'
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
                  {selectedAvatar && selectedAvatar !== user?.avatar && (
                    <span className="absolute flex items-center justify-center w-6 h-6 bg-green-500 rounded-full shadow-lg -top-1 -right-1">
                      <CheckCircleIcon sx={{ fontSize: 16 }} className="text-white" />
                    </span>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <p className={`text-sm font-medium ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>Preview</p>
                  <p className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-slate-900'}`}>{user?.name}</p>
                  {selectedAvatar && selectedAvatar !== user?.avatar && (
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
                      className="object-cover w-full aspect-square rounded-xl"
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
              darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-slate-100'
            }`}>
              <button
                type="button"
                onClick={closeAvatarModal}
                className={`w-full sm:w-auto px-6 py-2.5 font-bold rounded-xl transition-colors ${
                  darkMode ? 'text-dark-text hover:bg-dark-hover' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleAvatarSave}
                disabled={savingAvatar || !selectedAvatar || selectedAvatar === user?.avatar}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-brand-primary to-brand-gold text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none"
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
  );
};

export default UserDashboard;
