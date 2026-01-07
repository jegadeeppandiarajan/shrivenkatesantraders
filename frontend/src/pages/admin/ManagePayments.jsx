import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPayments } from "../../features/admin/dashboardSlice";
import { useTheme } from "../../context/ThemeContext";
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';

const ManagePayments = () => {
  const dispatch = useDispatch();
  const { darkMode } = useTheme();
  const payments = useSelector((state) => state.dashboard.payments);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'succeeded':
        return <CheckCircleIcon sx={{ fontSize: 18 }} className="text-green-500" />;
      case 'pending':
        return <PendingIcon sx={{ fontSize: 18 }} className="text-yellow-500" />;
      case 'failed':
      case 'cancelled':
        return <CancelIcon sx={{ fontSize: 18 }} className="text-red-500" />;
      default:
        return <PendingIcon sx={{ fontSize: 18 }} className="text-slate-400" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'succeeded':
        return darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700';
      case 'pending':
        return darkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-100 text-yellow-700';
      case 'failed':
      case 'cancelled':
        return darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700';
      default:
        return darkMode ? 'bg-dark-hover text-dark-muted' : 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-5 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            darkMode ? 'bg-brand-primary/20' : 'bg-brand-primary/10'
          }`}>
            <PaymentIcon className="text-brand-primary" />
          </div>
          <div>
            <h2 className={`text-xl lg:text-2xl font-bold ${
              darkMode ? 'text-dark-text' : 'text-slate-900'
            }`}>Payment Transactions</h2>
            <p className={`text-sm ${
              darkMode ? 'text-dark-muted' : 'text-slate-500'
            }`}>Latest Stripe payment records</p>
          </div>
        </div>
        <button 
          onClick={() => dispatch(fetchPayments())}
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

      {/* Table */}
      <div className={`rounded-xl border overflow-hidden ${
        darkMode ? 'border-dark-border' : 'border-slate-200'
      }`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className={`text-left text-xs uppercase tracking-wider ${
                darkMode ? 'bg-dark-bg text-dark-muted' : 'bg-slate-50 text-slate-500'
              }`}>
                <th className="px-4 lg:px-6 py-4 font-semibold">Order</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Customer</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Amount</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Status</th>
                <th className="px-4 lg:px-6 py-4 font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${
              darkMode ? 'divide-dark-border' : 'divide-slate-100'
            }`}>
              {payments.map((payment) => (
                <tr key={payment._id} className={`transition-colors ${
                  darkMode ? 'hover:bg-dark-hover' : 'hover:bg-slate-50'
                }`}>
                  <td className={`px-4 lg:px-6 py-4 font-medium ${
                    darkMode ? 'text-dark-text' : 'text-slate-900'
                  }`}>
                    {payment.order?.orderNumber || 'N/A'}
                  </td>
                  <td className={`px-4 lg:px-6 py-4 ${
                    darkMode ? 'text-dark-muted' : 'text-slate-600'
                  }`}>
                    {payment.user?.email || 'Unknown'}
                  </td>
                  <td className={`px-4 lg:px-6 py-4 font-semibold ${
                    darkMode ? 'text-brand-primary' : 'text-brand-gold'
                  }`}>
                    ₹ {payment.amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-4 lg:px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
                      getStatusStyle(payment.status)
                    }`}>
                      {getStatusIcon(payment.status)}
                      {payment.status}
                    </span>
                  </td>
                  <td className={`px-4 lg:px-6 py-4 text-xs ${
                    darkMode ? 'text-dark-muted' : 'text-slate-500'
                  }`}>
                    {new Date(payment.updatedAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {!payments.length && (
          <div className={`text-center py-12 ${
            darkMode ? 'text-dark-muted' : 'text-slate-500'
          }`}>
            <PaymentIcon sx={{ fontSize: 48 }} className="opacity-30 mb-3" />
            <p className="font-medium">No payment records found</p>
            <p className="text-sm mt-1 opacity-70">Transactions will appear here once payments are processed</p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      {payments.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-dark-bg border border-dark-border' : 'bg-slate-50'
          }`}>
            <p className={`text-xs uppercase tracking-wider font-semibold ${
              darkMode ? 'text-dark-muted' : 'text-slate-400'
            }`}>Total Transactions</p>
            <p className={`text-2xl font-bold mt-1 ${
              darkMode ? 'text-dark-text' : 'text-slate-900'
            }`}>{payments.length}</p>
          </div>
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-dark-bg border border-dark-border' : 'bg-slate-50'
          }`}>
            <p className={`text-xs uppercase tracking-wider font-semibold ${
              darkMode ? 'text-dark-muted' : 'text-slate-400'
            }`}>Total Amount</p>
            <p className={`text-2xl font-bold mt-1 ${
              darkMode ? 'text-brand-primary' : 'text-brand-gold'
            }`}>₹ {payments.reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}</p>
          </div>
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-dark-bg border border-dark-border' : 'bg-slate-50'
          }`}>
            <p className={`text-xs uppercase tracking-wider font-semibold ${
              darkMode ? 'text-dark-muted' : 'text-slate-400'
            }`}>Completed</p>
            <p className="text-2xl font-bold mt-1 text-green-500">
              {payments.filter(p => ['completed', 'succeeded'].includes(p.status?.toLowerCase())).length}
            </p>
          </div>
          <div className={`p-4 rounded-xl ${
            darkMode ? 'bg-dark-bg border border-dark-border' : 'bg-slate-50'
          }`}>
            <p className={`text-xs uppercase tracking-wider font-semibold ${
              darkMode ? 'text-dark-muted' : 'text-slate-400'
            }`}>Pending</p>
            <p className="text-2xl font-bold mt-1 text-yellow-500">
              {payments.filter(p => p.status?.toLowerCase() === 'pending').length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagePayments;
