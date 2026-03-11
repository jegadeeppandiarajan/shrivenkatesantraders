import { useEffect, useState } from "react";
import api from "../../services/api";
import { useTheme } from "../../context/ThemeContext";
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import RefreshIcon from '@mui/icons-material/Refresh';

const statuses = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

const ManageOrders = () => {
  const { darkMode } = useTheme();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("");

  const loadOrders = async () => {
    const { data } = await api.get("/orders/admin", { params: filter ? { status: filter } : {} });
    setOrders(data.data);
  };

  useEffect(() => {
    loadOrders();
  }, [filter]);

  const handleStatusChange = async (orderId, status) => {
    await api.put(`/orders/${orderId}/status`, { status });
    loadOrders();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return darkMode ? 'text-green-400' : 'text-green-600';
      case 'cancelled': return darkMode ? 'text-red-400' : 'text-red-500';
      case 'shipped':
      case 'out_for_delivery': return darkMode ? 'text-blue-400' : 'text-blue-600';
      default: return darkMode ? 'text-yellow-400' : 'text-yellow-600';
    }
  };

  return (
    <div className="p-4 sm:p-5 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
            darkMode ? 'bg-brand-primary/20' : 'bg-brand-primary/10'
          }`}>
            <LocalShippingIcon className="text-brand-primary" />
          </div>
          <div>
            <h2 className={`text-xl lg:text-2xl font-bold ${
              darkMode ? 'text-dark-text' : 'text-slate-900'
            }`}>Order Management</h2>
            <p className={`text-sm ${
              darkMode ? 'text-dark-muted' : 'text-brand-slate'
            }`}>Track and manage customer orders</p>
          </div>
        </div>
        <button
          onClick={loadOrders}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all self-start sm:self-auto ${
            darkMode
              ? 'bg-dark-hover text-dark-text hover:bg-dark-border'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <RefreshIcon sx={{ fontSize: 18 }} />
          Refresh
        </button>
      </div>

      {/* Filter */}
      <div className={`rounded-2xl p-4 sm:p-5 border ${
        darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-brand-primary/10'
      }`}>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl border-2 outline-none transition-all min-w-[180px] text-sm ${
            darkMode
              ? 'bg-dark-bg border-dark-border text-dark-text focus:border-brand-primary'
              : 'bg-white border-slate-200 text-brand-dark focus:border-brand-primary'
          }`}
        >
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
          ))}
        </select>
      </div>

      {/* Orders */}
      <div className="space-y-3 sm:space-y-4">
        {orders.map((order) => (
          <div key={order._id} className={`rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-colors ${
            darkMode ? 'bg-dark-card border-dark-border hover:border-brand-primary/30' : 'border-slate-200 bg-white hover:border-brand-primary/20'
          }`}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <p className={`text-xs uppercase tracking-[0.3em] sm:tracking-[0.4em] font-medium ${
                  darkMode ? 'text-dark-muted' : 'text-slate-500'
                }`}>{order.orderNumber}</p>
                <h3 className={`text-lg sm:text-xl font-semibold ${
                  darkMode ? 'text-dark-text' : 'text-slate-900'
                }`}>₹ {order.totalAmount.toLocaleString()}</h3>
                <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>{order.user?.name || 'Unknown User'}</p>
                <p className={`text-xs mt-1 font-medium capitalize sm:hidden ${getStatusColor(order.orderStatus)}`}>
                  {order.orderStatus.replace(/_/g, ' ')}
                </p>
              </div>
              <select
                value={order.orderStatus}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className={`w-full sm:w-auto px-3 sm:px-4 py-2 rounded-xl sm:rounded-full border text-sm ${
                  darkMode
                    ? 'bg-dark-bg border-dark-border text-dark-text'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {!orders.length && (
          <div className={`text-center py-12 ${darkMode ? 'text-dark-muted' : 'text-brand-slate'}`}>
            <LocalShippingIcon sx={{ fontSize: 48 }} className="opacity-30 mb-3" />
            <p className="font-medium">No orders in this state.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageOrders;

