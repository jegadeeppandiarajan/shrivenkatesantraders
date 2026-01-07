import { useEffect, useState } from "react";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import PersonIcon from '@mui/icons-material/Person';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import GroupIcon from '@mui/icons-material/Group';
import RefreshIcon from '@mui/icons-material/Refresh';

const ManageUsers = () => {
  const { darkMode } = useTheme();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [notification, setNotification] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [stats, setStats] = useState({ total: 0, admins: 0, active: 0 });

  useEffect(() => {
    fetchUsers();
    setIsVisible(true);
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/admin/users");
      const userData = response.data.data || response.data;
      setUsers(userData);
      
      // Calculate stats
      setStats({
        total: userData.length,
        admins: userData.filter(u => u.role === 'admin').length,
        active: userData.filter(u => u.isActive !== false).length,
      });
    } catch (error) {
      showNotification("Failed to fetch users", "error");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      showNotification(`User role updated to ${newRole}`);
      fetchUsers();
      setEditModal(null);
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to update role", "error");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/admin/users/${userId}/status`, { isActive: !currentStatus });
      showNotification(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
      fetchUsers();
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to update status", "error");
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      showNotification("User deleted successfully");
      fetchUsers();
    } catch (error) {
      showNotification(error.response?.data?.message || "Failed to delete user", "error");
    }
    setDeleteConfirm(null);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !filterRole || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

      {/* Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            darkMode ? 'bg-brand-primary/20' : 'bg-brand-primary/10'
          }`}>
            <GroupIcon className="text-brand-primary" />
          </div>
          <div>
            <h1 className={`text-xl lg:text-2xl font-bold ${
              darkMode ? 'text-dark-text' : 'text-slate-900'
            }`}>User Management</h1>
            <p className={`text-sm ${
              darkMode ? 'text-dark-muted' : 'text-slate-500'
            }`}>Manage user accounts, roles, and permissions</p>
          </div>
        </div>
        <button 
          onClick={fetchUsers}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
            darkMode 
              ? 'bg-dark-hover text-dark-text hover:bg-dark-border' 
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <RefreshIcon sx={{ fontSize: 18 }} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`} style={{ transitionDelay: "100ms" }}>
        <div className={`rounded-xl p-5 shadow-lg ${
          darkMode 
            ? 'bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/20' 
            : 'bg-gradient-to-br from-blue-500 to-blue-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-blue-400' : 'text-blue-100'}`}>Total Users</p>
              <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-blue-400' : 'text-white'}`}>{stats.total}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-blue-500/20' : 'bg-white/20'
            }`}>
              <GroupIcon sx={{ fontSize: 24 }} className={darkMode ? 'text-blue-400' : 'text-white'} />
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-5 shadow-lg ${
          darkMode 
            ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/20' 
            : 'bg-gradient-to-br from-purple-500 to-purple-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-100'}`}>Administrators</p>
              <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-purple-400' : 'text-white'}`}>{stats.admins}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-purple-500/20' : 'bg-white/20'
            }`}>
              <AdminPanelSettingsIcon sx={{ fontSize: 24 }} className={darkMode ? 'text-purple-400' : 'text-white'} />
            </div>
          </div>
        </div>
        
        <div className={`rounded-xl p-5 shadow-lg ${
          darkMode 
            ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20' 
            : 'bg-gradient-to-br from-green-500 to-green-600'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-100'}`}>Active Users</p>
              <p className={`text-3xl font-bold mt-1 ${darkMode ? 'text-green-400' : 'text-white'}`}>{stats.active}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              darkMode ? 'bg-green-500/20' : 'bg-white/20'
            }`}>
              <CheckCircleIcon sx={{ fontSize: 24 }} className={darkMode ? 'text-green-400' : 'text-white'} />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className={`rounded-xl p-5 border transition-all duration-700 ${
        darkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-gradient-to-r from-slate-50 to-white border-slate-100'
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`} style={{ transitionDelay: "150ms" }}>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <SearchIcon sx={{ fontSize: 20 }} className={`absolute left-4 top-1/2 -translate-y-1/2 ${
              darkMode ? 'text-dark-muted' : 'text-slate-400'
            }`} />
            <input
              type="search"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 outline-none transition-all ${
                darkMode 
                  ? 'bg-dark-bg border-dark-border text-dark-text placeholder-dark-muted focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                  : 'bg-white border-slate-200 text-slate-800 placeholder-slate-400 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
              }`}
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className={`px-4 py-3 rounded-xl border-2 outline-none transition-all min-w-[180px] ${
              darkMode 
                ? 'bg-dark-bg border-dark-border text-dark-text focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20' 
                : 'bg-white border-slate-200 text-slate-800 focus:border-brand-primary focus:ring-4 focus:ring-brand-primary/20'
            }`}
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className={`rounded-xl border overflow-hidden transition-all duration-700 ${
        darkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-white border-slate-100 shadow-lg'
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
      }`} style={{ transitionDelay: "200ms" }}>
        {loading ? (
          <div className={`p-12 text-center ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>
            <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className={`p-12 text-center ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>
            <GroupIcon sx={{ fontSize: 72 }} className="opacity-30" />
            <p className="mt-4">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`border-b ${
                  darkMode 
                    ? 'bg-dark-bg border-dark-border' 
                    : 'bg-slate-50 border-slate-100'
                }`}>
                  <th className={`text-left py-4 px-4 lg:px-6 font-semibold text-xs uppercase tracking-wider ${
                    darkMode ? 'text-dark-muted' : 'text-slate-600'
                  }`}>User</th>
                  <th className={`text-left py-4 px-4 lg:px-6 font-semibold text-xs uppercase tracking-wider ${
                    darkMode ? 'text-dark-muted' : 'text-slate-600'
                  }`}>Role</th>
                  <th className={`text-left py-4 px-4 lg:px-6 font-semibold text-xs uppercase tracking-wider ${
                    darkMode ? 'text-dark-muted' : 'text-slate-600'
                  }`}>Status</th>
                  <th className={`text-left py-4 px-4 lg:px-6 font-semibold text-xs uppercase tracking-wider hidden md:table-cell ${
                    darkMode ? 'text-dark-muted' : 'text-slate-600'
                  }`}>Joined</th>
                  <th className={`text-right py-4 px-4 lg:px-6 font-semibold text-xs uppercase tracking-wider ${
                    darkMode ? 'text-dark-muted' : 'text-slate-600'
                  }`}>Actions</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-dark-border' : 'divide-slate-100'}`}>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className={`transition-all duration-500 ${
                      darkMode ? 'hover:bg-dark-hover' : 'hover:bg-slate-50/50'
                    } ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
                    }`}
                    style={{ transitionDelay: `${250 + index * 30}ms` }}
                  >
                    <td className="py-4 px-4 lg:px-6">
                      <div className="flex items-center gap-3 lg:gap-4">
                        <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center ${
                          user.role === 'admin' 
                            ? darkMode ? 'bg-purple-500/20' : 'bg-gradient-to-br from-purple-100 to-purple-50'
                            : darkMode ? 'bg-dark-hover' : 'bg-gradient-to-br from-slate-100 to-slate-50'
                        }`}>
                          {user.role === 'admin' ? (
                            <AdminPanelSettingsIcon sx={{ fontSize: 22 }} className={darkMode ? 'text-purple-400' : 'text-purple-600'} />
                          ) : (
                            <PersonIcon sx={{ fontSize: 22 }} className={darkMode ? 'text-dark-muted' : 'text-slate-500'} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className={`font-semibold truncate ${
                            darkMode ? 'text-dark-text' : 'text-slate-800'
                          }`}>{user.name || 'No Name'}</p>
                          <p className={`text-xs lg:text-sm flex items-center gap-1 truncate ${
                            darkMode ? 'text-dark-muted' : 'text-slate-500'
                          }`}>
                            <EmailIcon sx={{ fontSize: 14 }} />
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 lg:px-6">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin'
                          ? darkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                          : darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="py-4 px-4 lg:px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                        user.isActive !== false
                          ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                          : darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                      }`}>
                        {user.isActive !== false ? (
                          <>
                            <CheckCircleIcon sx={{ fontSize: 14 }} />
                            Active
                          </>
                        ) : (
                          <>
                            <BlockIcon sx={{ fontSize: 14 }} />
                            Inactive
                          </>
                        )}
                      </span>
                    </td>
                    <td className={`py-4 px-4 lg:px-6 hidden md:table-cell ${
                      darkMode ? 'text-dark-muted' : 'text-slate-600'
                    }`}>
                      <span className="flex items-center gap-1 text-xs lg:text-sm">
                        <CalendarTodayIcon sx={{ fontSize: 14 }} />
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td className="py-4 px-4 lg:px-6">
                      <div className="flex items-center justify-end gap-1 lg:gap-2">
                        <button
                          onClick={() => setEditModal(user)}
                          className={`p-2 rounded-lg transition-all ${
                            darkMode 
                              ? 'text-dark-muted hover:text-brand-primary hover:bg-brand-primary/10' 
                              : 'text-slate-500 hover:text-brand-primary hover:bg-brand-primary/10'
                          }`}
                          title="Edit role"
                        >
                          <EditIcon sx={{ fontSize: 18 }} />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(user._id, user.isActive !== false)}
                          className={`p-2 rounded-lg transition-all ${
                            user.isActive !== false
                              ? darkMode 
                                ? 'text-dark-muted hover:text-orange-400 hover:bg-orange-500/10' 
                                : 'text-slate-500 hover:text-orange-500 hover:bg-orange-50'
                              : darkMode 
                                ? 'text-dark-muted hover:text-green-400 hover:bg-green-500/10' 
                                : 'text-slate-500 hover:text-green-500 hover:bg-green-50'
                          }`}
                          title={user.isActive !== false ? "Deactivate user" : "Activate user"}
                        >
                          {user.isActive !== false ? (
                            <BlockIcon sx={{ fontSize: 18 }} />
                          ) : (
                            <CheckCircleIcon sx={{ fontSize: 18 }} />
                          )}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(user._id)}
                          className={`p-2 rounded-lg transition-all ${
                            darkMode 
                              ? 'text-dark-muted hover:text-red-400 hover:bg-red-500/10' 
                              : 'text-slate-500 hover:text-red-500 hover:bg-red-50'
                          }`}
                          title="Delete user"
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Role Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setEditModal(null)}>
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-md p-6 lg:p-8 animate-scale-in ${
              darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-slate-800'}`}>Update User Role</h3>
              <button
                onClick={() => setEditModal(null)}
                className={`p-2 rounded-xl transition-colors ${
                  darkMode ? 'hover:bg-dark-hover text-dark-muted' : 'hover:bg-slate-100 text-slate-500'
                }`}
              >
                <CloseIcon sx={{ fontSize: 20 }} />
              </button>
            </div>
            
            <div className="mb-6">
              <div className={`flex items-center gap-3 p-4 rounded-xl ${
                darkMode ? 'bg-dark-bg' : 'bg-slate-50'
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  darkMode ? 'bg-brand-primary/20' : 'bg-brand-primary/10'
                }`}>
                  <PersonIcon sx={{ fontSize: 20 }} className="text-brand-primary" />
                </div>
                <div>
                  <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-slate-800'}`}>{editModal.name || 'No Name'}</p>
                  <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>{editModal.email}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className={`text-sm font-semibold ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>Select Role</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleUpdateRole(editModal._id, 'user')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    editModal.role === 'user'
                      ? darkMode ? 'border-blue-500 bg-blue-500/20' : 'border-blue-500 bg-blue-50'
                      : darkMode ? 'border-dark-border hover:border-blue-500/50' : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <PersonIcon sx={{ fontSize: 24 }} className={editModal.role === 'user' ? 'text-blue-500' : darkMode ? 'text-dark-muted' : 'text-slate-400'} />
                  <p className={`mt-2 font-semibold ${
                    editModal.role === 'user' 
                      ? 'text-blue-500' 
                      : darkMode ? 'text-dark-muted' : 'text-slate-600'
                  }`}>
                    User
                  </p>
                </button>
                <button
                  onClick={() => handleUpdateRole(editModal._id, 'admin')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    editModal.role === 'admin'
                      ? darkMode ? 'border-purple-500 bg-purple-500/20' : 'border-purple-500 bg-purple-50'
                      : darkMode ? 'border-dark-border hover:border-purple-500/50' : 'border-slate-200 hover:border-purple-300'
                  }`}
                >
                  <AdminPanelSettingsIcon sx={{ fontSize: 24 }} className={editModal.role === 'admin' ? 'text-purple-500' : darkMode ? 'text-dark-muted' : 'text-slate-400'} />
                  <p className={`mt-2 font-semibold ${
                    editModal.role === 'admin' 
                      ? 'text-purple-500' 
                      : darkMode ? 'text-dark-muted' : 'text-slate-600'
                  }`}>
                    Admin
                  </p>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-md p-6 lg:p-8 animate-scale-in ${
              darkMode ? 'bg-dark-card border border-dark-border' : 'bg-white'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                darkMode ? 'bg-red-500/20' : 'bg-red-100'
              }`}>
                <DeleteIcon sx={{ fontSize: 32 }} className="text-red-500" />
              </div>
              <h3 className={`text-xl font-bold ${darkMode ? 'text-dark-text' : 'text-slate-800'}`}>Delete User?</h3>
              <p className={`mt-2 ${darkMode ? 'text-dark-muted' : 'text-slate-500'}`}>This action cannot be undone. The user account will be permanently deleted.</p>
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className={`px-6 py-3 font-semibold rounded-xl transition-colors ${
                    darkMode 
                      ? 'text-dark-text hover:bg-dark-hover' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-6 py-3 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 transition-colors"
                >
                  Delete User
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
