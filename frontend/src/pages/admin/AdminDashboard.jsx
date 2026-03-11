import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from "recharts";
import { fetchDashboard, fetchPayments, updateRealtimeStats } from "../../features/admin/dashboardSlice";
import { useSocket } from "../../context/SocketContext";
import { useTheme } from "../../context/ThemeContext";
import AnimatedBackground from "../../components/common/AnimatedBackground";
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
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PendingIcon from '@mui/icons-material/Pending';
import CancelIcon from '@mui/icons-material/Cancel';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CloseIcon from '@mui/icons-material/Close';
import StorefrontIcon from '@mui/icons-material/Storefront';
import EmailIcon from '@mui/icons-material/Email';
import api from '../../services/api';

// Invoice Modal Component
const InvoiceModal = ({ order, isOpen, onClose, darkMode }) => {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  
  if (!isOpen || !order) return null;

  const invoiceId = `INV-${order._id?.slice(-6)?.toUpperCase()}`;
  const invoiceDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }) : 'N/A';

  // Professional print styles for invoice
  const getPrintStyles = () => `
    @page { 
      size: A4; 
      margin: 15mm 20mm; 
    }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
    * { 
      box-sizing: border-box; 
      margin: 0; 
      padding: 0; 
    }
    body { 
      font-family: 'Segoe UI', 'Roboto', Arial, sans-serif; 
      font-size: 14px; 
      color: #1e293b; 
      line-height: 1.5; 
      background: #fff;
      padding: 0;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: #fff;
    }
    
    /* Header */
    .invoice-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-bottom: 25px;
      border-bottom: 3px solid #f59e0b;
      margin-bottom: 30px;
    }
    .company-info {
      flex: 1;
    }
    .company-logo {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }
    .logo-icon {
      width: 50px;
      height: 50px;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 24px;
      font-weight: bold;
    }
    .company-name {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
    }
    .company-tagline {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }
    .company-contact {
      font-size: 12px;
      color: #64748b;
      margin-top: 8px;
      line-height: 1.6;
    }
    .invoice-meta {
      text-align: right;
    }
    .invoice-title {
      font-size: 36px;
      font-weight: 800;
      color: #f59e0b;
      letter-spacing: 2px;
      margin-bottom: 8px;
    }
    .invoice-number {
      font-size: 14px;
      color: #475569;
      margin-bottom: 4px;
    }
    .invoice-number strong {
      color: #1e293b;
      font-family: 'Courier New', monospace;
    }
    .invoice-date {
      font-size: 13px;
      color: #64748b;
    }
    
    /* Billing Section */
    .billing-section {
      display: flex;
      gap: 40px;
      margin-bottom: 35px;
    }
    .bill-to, .order-details {
      flex: 1;
    }
    .section-label {
      font-size: 11px;
      font-weight: 700;
      color: #f59e0b;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #fef3c7;
    }
    .customer-name {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 6px;
    }
    .customer-detail {
      font-size: 13px;
      color: #64748b;
      line-height: 1.6;
    }
    .order-info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .order-info-item {
      background: #f8fafc;
      padding: 12px 15px;
      border-radius: 8px;
      border-left: 3px solid #f59e0b;
    }
    .order-info-label {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .order-info-value {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin-top: 4px;
    }
    
    /* Items Table */
    .items-section {
      margin-bottom: 30px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }
    .items-table thead tr {
      background: linear-gradient(135deg, #1e293b, #334155);
    }
    .items-table th {
      color: white;
      padding: 14px 16px;
      text-align: left;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .items-table th:first-child {
      border-radius: 8px 0 0 0;
    }
    .items-table th:last-child {
      border-radius: 0 8px 0 0;
      text-align: right;
    }
    .items-table th.text-center {
      text-align: center;
    }
    .items-table th.text-right {
      text-align: right;
    }
    .items-table tbody tr {
      border-bottom: 1px solid #e2e8f0;
    }
    .items-table tbody tr:nth-child(even) {
      background: #f8fafc;
    }
    .items-table td {
      padding: 14px 16px;
      vertical-align: middle;
    }
    .items-table td.text-center {
      text-align: center;
    }
    .items-table td.text-right {
      text-align: right;
    }
    .item-name {
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 2px;
    }
    .item-category {
      font-size: 11px;
      color: #94a3b8;
    }
    .item-price {
      color: #64748b;
    }
    .item-total {
      font-weight: 700;
      color: #f59e0b;
    }
    
    /* Totals Section */
    .totals-row {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 30px;
    }
    .totals-box {
      width: 300px;
      background: #f8fafc;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }
    .total-line {
      display: flex;
      justify-content: space-between;
      padding: 12px 20px;
      font-size: 14px;
      border-bottom: 1px solid #e2e8f0;
    }
    .total-line:last-child {
      border-bottom: none;
    }
    .total-line span:first-child {
      color: #64748b;
    }
    .total-line span:last-child {
      font-weight: 600;
      color: #1e293b;
    }
    .total-line.grand-total {
      background: linear-gradient(135deg, #f59e0b, #d97706);
      color: white;
      font-size: 18px;
      font-weight: 700;
      padding: 16px 20px;
    }
    .total-line.grand-total span:first-child,
    .total-line.grand-total span:last-child {
      color: white;
    }
    
    /* Status Section */
    .status-row {
      display: flex;
      gap: 20px;
      margin-bottom: 35px;
    }
    .status-card {
      flex: 1;
      background: #f8fafc;
      padding: 16px 20px;
      border-radius: 10px;
      border: 1px solid #e2e8f0;
    }
    .status-label {
      font-size: 10px;
      font-weight: 600;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
    }
    .status-paid {
      background: #dcfce7;
      color: #16a34a;
    }
    .status-pending {
      background: #fef3c7;
      color: #d97706;
    }
    .status-processing {
      background: #e0e7ff;
      color: #4f46e5;
    }
    .status-shipped {
      background: #dbeafe;
      color: #2563eb;
    }
    .status-delivered {
      background: #dcfce7;
      color: #16a34a;
    }
    
    /* Footer */
    .invoice-footer {
      text-align: center;
      padding-top: 25px;
      border-top: 2px solid #e2e8f0;
    }
    .thank-you {
      font-size: 20px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 12px;
    }
    .footer-info {
      font-size: 12px;
      color: #64748b;
      line-height: 1.8;
    }
    .footer-brand {
      color: #f59e0b;
      font-weight: 600;
    }
  `;

  const generateInvoiceHTML = () => {
    const items = order.items || [];
    const subtotal = items.reduce((sum, item) => sum + ((item.price || item.product?.price || 0) * item.quantity), 0);
    const shippingCost = order.shippingCost || 0;
    const tax = order.tax || 0;
    const total = order.totalAmount || (subtotal + shippingCost + tax);
    
    const getPaymentStatusClass = () => {
      if (order.paymentStatus === 'paid' || order.paymentStatus === 'completed') return 'status-paid';
      return 'status-pending';
    };
    
    const getOrderStatusClass = () => {
      switch(order.orderStatus) {
        case 'delivered': return 'status-delivered';
        case 'shipped': return 'status-shipped';
        case 'processing': return 'status-processing';
        default: return 'status-pending';
      }
    };
    
    return `
      <div class="invoice-wrapper">
        <!-- Header -->
        <div class="invoice-header">
          <div class="company-info">
            <div class="company-logo">
              <div class="logo-icon">SVT</div>
              <div>
                <div class="company-name">Shri Venkatesan Traders</div>
                <div class="company-tagline">Industrial Supplies & Equipment</div>
              </div>
            </div>
            <div class="company-contact">
              Chennai, Tamil Nadu, India<br>
              Phone: +91 XXXXX XXXXX<br>
              Email: support@shrivenkatesantraders.com
            </div>
          </div>
          <div class="invoice-meta">
            <div class="invoice-title">INVOICE</div>
            <div class="invoice-number">Invoice No: <strong>${invoiceId}</strong></div>
            <div class="invoice-date">Date: ${invoiceDate}</div>
          </div>
        </div>

        <!-- Billing Section -->
        <div class="billing-section">
          <div class="bill-to">
            <div class="section-label">Bill To</div>
            <div class="customer-name">${order.user?.name || 'Customer'}</div>
            <div class="customer-detail">
              ${order.user?.email || 'N/A'}<br>
              ${order.shippingAddress ? `
                ${order.shippingAddress.street || ''}<br>
                ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''}<br>
                PIN: ${order.shippingAddress.pincode || ''}
              ` : 'No address provided'}
            </div>
          </div>
          <div class="order-details">
            <div class="section-label">Order Information</div>
            <div class="order-info-grid">
              <div class="order-info-item">
                <div class="order-info-label">Order ID</div>
                <div class="order-info-value">#${order._id?.slice(-8)?.toUpperCase()}</div>
              </div>
              <div class="order-info-item">
                <div class="order-info-label">Items</div>
                <div class="order-info-value">${items.length} item(s)</div>
              </div>
              <div class="order-info-item">
                <div class="order-info-label">Payment Method</div>
                <div class="order-info-value">${order.paymentMethod || 'N/A'}</div>
              </div>
              <div class="order-info-item">
                <div class="order-info-label">Order Date</div>
                <div class="order-info-value">${invoiceDate}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Items Table -->
        <div class="items-section">
          <table class="items-table">
            <thead>
              <tr>
                <th style="width: 45%">Item Description</th>
                <th class="text-center" style="width: 12%">Qty</th>
                <th class="text-right" style="width: 20%">Unit Price</th>
                <th class="text-right" style="width: 23%">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items.length > 0 ? items.map(item => {
                const price = item.price || item.product?.price || 0;
                const itemTotal = price * item.quantity;
                return `
                  <tr>
                    <td>
                      <div class="item-name">${item.product?.name || item.name || 'Product'}</div>
                      <div class="item-category">${item.product?.category || 'General'}</div>
                    </td>
                    <td class="text-center">${item.quantity}</td>
                    <td class="text-right item-price">₹${price.toLocaleString('en-IN')}</td>
                    <td class="text-right item-total">₹${itemTotal.toLocaleString('en-IN')}</td>
                  </tr>
                `;
              }).join('') : '<tr><td colspan="4" style="text-align: center; padding: 30px; color: #94a3b8;">No items in this order</td></tr>'}
            </tbody>
          </table>
        </div>

        <!-- Totals -->
        <div class="totals-row">
          <div class="totals-box">
            <div class="total-line">
              <span>Subtotal</span>
              <span>₹${subtotal.toLocaleString('en-IN')}</span>
            </div>
            ${shippingCost > 0 ? `
              <div class="total-line">
                <span>Shipping</span>
                <span>₹${shippingCost.toLocaleString('en-IN')}</span>
              </div>
            ` : ''}
            ${tax > 0 ? `
              <div class="total-line">
                <span>Tax</span>
                <span>₹${tax.toLocaleString('en-IN')}</span>
              </div>
            ` : ''}
            <div class="total-line grand-total">
              <span>Total Amount</span>
              <span>₹${total.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        <!-- Status Section -->
        <div class="status-row">
          <div class="status-card">
            <div class="status-label">Payment Status</div>
            <span class="status-badge ${getPaymentStatusClass()}">
              ${order.paymentStatus === 'paid' || order.paymentStatus === 'completed' ? '✓' : '○'} 
              ${order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
            </span>
          </div>
          <div class="status-card">
            <div class="status-label">Order Status</div>
            <span class="status-badge ${getOrderStatusClass()}">
              ${order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Processing'}
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="invoice-footer">
          <div class="thank-you">Thank You for Your Business!</div>
          <div class="footer-info">
            <span class="footer-brand">Shri Venkatesan Traders</span> | ISO 9001:2015 Certified | Established 1998<br>
            For queries, please contact us at support@shrivenkatesantraders.com
          </div>
        </div>
      </div>
    `;
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceId}</title>
          <style>${getPrintStyles()}</style>
        </head>
        <body>${generateInvoiceHTML()}</body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDownload = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceId}</title>
          <style>${getPrintStyles()}</style>
        </head>
        <body>
          ${generateInvoiceHTML()}
          <script>window.onload = function() { window.print(); }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleSendEmail = async () => {
    if (!order.user?.email) {
      setEmailStatus({ success: false, message: 'No email address found for this customer' });
      return;
    }
    
    setSendingEmail(true);
    setEmailStatus(null);
    
    try {
      const response = await api.post(`/orders/${order._id}/send-invoice`);
      if (response.data.success) {
        setEmailStatus({ success: true, message: 'Invoice sent successfully!' });
      } else {
        setEmailStatus({ success: false, message: response.data.message || 'Failed to send invoice' });
      }
    } catch (error) {
      setEmailStatus({ success: false, message: error.response?.data?.message || 'Failed to send invoice email' });
    } finally {
      setSendingEmail(false);
      // Clear status after 3 seconds
      setTimeout(() => setEmailStatus(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`relative w-full max-w-3xl max-h-[90vh] overflow-auto rounded-2xl shadow-2xl ${darkMode ? 'bg-dark-card' : 'bg-white'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`sticky top-0 z-10 flex items-center justify-between p-4 border-b ${darkMode ? 'bg-dark-card border-dark-border' : 'bg-white border-slate-200'}`}>
          <div>
            <h3 className={`text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Invoice Details</h3>
            {emailStatus && (
              <p className={`text-xs mt-1 ${emailStatus.success ? 'text-green-500' : 'text-red-500'}`}>
                {emailStatus.message}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleSendEmail}
              disabled={sendingEmail}
              className={`p-2 rounded-lg transition-all flex items-center gap-1 ${
                sendingEmail 
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                  : 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20'
              }`}
              title="Send Invoice to Customer Email"
            >
              <EmailIcon sx={{ fontSize: 20 }} className={sendingEmail ? 'animate-pulse' : ''} />
              {sendingEmail && <span className="text-xs">Sending...</span>}
            </button>
            <button 
              onClick={handleDownload}
              className="p-2 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-all"
              title="Download Invoice"
            >
              <DownloadIcon sx={{ fontSize: 20 }} />
            </button>
            <button 
              onClick={handlePrint}
              className="p-2 rounded-lg bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 transition-all"
              title="Print Invoice"
            >
              <PrintIcon sx={{ fontSize: 20 }} />
            </button>
            <button 
              onClick={onClose}
              className={`p-2 rounded-lg transition-all ${darkMode ? 'hover:bg-dark-hover text-dark-muted' : 'hover:bg-slate-100 text-slate-700'}`}
            >
              <CloseIcon sx={{ fontSize: 20 }} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div id="invoice-content" className="p-6 lg:p-8">
          {/* Header */}
          <div className="header flex flex-col sm:flex-row justify-between items-start gap-4 mb-8 pb-6 border-b-2 border-brand-primary">
            <div>
              <div className="logo flex items-center gap-2 text-2xl font-bold text-brand-primary mb-2">
                <StorefrontIcon />
                Shri Venkatesan Traders
              </div>
              <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Industrial Supplies & Equipment</p>
              <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Chennai, Tamil Nadu, India</p>
            </div>
            <div className="text-right">
              <h2 className={`invoice-title text-2xl font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>INVOICE</h2>
              <p className="invoice-id text-brand-primary font-mono font-bold text-lg">{invoiceId}</p>
              <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Date: {invoiceDate}</p>
            </div>
          </div>

          {/* Customer Info */}
          <div className="section mb-8">
            <p className={`section-title text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Bill To</p>
            <div className={`customer-info p-4 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <p className={`customer-name text-lg font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{order.user?.name || 'Guest User'}</p>
              <p className={`customer-email text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>{order.user?.email || 'No email provided'}</p>
              {order.shippingAddress && (
                <p className={`text-sm mt-2 ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="section mb-8">
            <p className={`section-title text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Order Items</p>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className={`text-left text-xs uppercase ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
                    <th className={`p-3 rounded-tl-lg ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Item</th>
                    <th className={`p-3 text-center ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Qty</th>
                    <th className={`p-3 text-right ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Price</th>
                    <th className={`p-3 text-right rounded-tr-lg ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Total</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${darkMode ? 'divide-dark-border' : 'divide-slate-100'}`}>
                  {order.items && order.items.length > 0 ? order.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className={`p-3 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
                        <p className="font-semibold">{item.product?.name || item.name || 'Product'}</p>
                        <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>{item.product?.category || 'N/A'}</p>
                      </td>
                      <td className={`p-3 text-center ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{item.quantity}</td>
                      <td className={`p-3 text-right ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>₹{(item.price || item.product?.price || 0).toLocaleString()}</td>
                      <td className="p-3 text-right font-semibold text-brand-primary">₹{((item.price || item.product?.price || 0) * item.quantity).toLocaleString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className={`p-4 text-center ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>No items found</td>
                    </tr>
                  )}
                </tbody>
                <tfoot>
                  <tr className={`${darkMode ? 'bg-brand-primary/10' : 'bg-amber-50'}`}>
                    <td colSpan="3" className={`p-3 text-right font-bold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>Total Amount</td>
                    <td className="p-3 text-right font-bold text-xl text-brand-primary">₹{order.totalAmount?.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payment & Order Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Payment Status</p>
              <span className={`status-badge inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                order.paymentStatus === 'paid' || order.paymentStatus === 'completed'
                  ? 'status-paid bg-green-100 text-green-600'
                  : 'status-pending bg-amber-100 text-amber-600'
              }`}>
                {order.paymentStatus === 'paid' || order.paymentStatus === 'completed' ? <CheckCircleIcon sx={{ fontSize: 14 }} /> : <PendingIcon sx={{ fontSize: 14 }} />}
                {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
              </span>
            </div>
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>Order Status</p>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
                order.orderStatus === 'delivered'
                  ? 'bg-green-100 text-green-600'
                  : order.orderStatus === 'shipped'
                  ? 'bg-blue-100 text-blue-600'
                  : order.orderStatus === 'cancelled'
                  ? 'bg-red-100 text-red-600'
                  : 'bg-amber-100 text-amber-600'
              }`}>
                {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1) || 'Processing'}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className={`footer text-center pt-6 border-t ${darkMode ? 'border-dark-border text-dark-muted' : 'border-slate-200 text-slate-700'}`}>
            <p className="text-sm">Thank you for your business!</p>
            <p className="text-xs mt-1">Shri Venkatesan Traders | ISO 9001:2015 Certified | Since 1998</p>
            <p className="text-xs mt-1">For queries, contact: support@shrivenkatesantraders.com</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, icon, trend, color = "brand", index = 0, isVisible = true, darkMode = false }) => (
  <div className={`group card-hover rounded-2xl p-5 lg:p-6 shadow-lg transition-all duration-700 border ${
    darkMode 
      ? 'bg-dark-card border-dark-border hover:border-brand-primary/40 hover:shadow-brand-primary/10' 
      : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10 hover:border-brand-primary/30 hover:shadow-xl'
  } ${
    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
  }`}
  style={{ transitionDelay: `${index * 100}ms` }}>
    <div className="flex items-start justify-between">
      <div>
        <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
          darkMode ? 'text-dark-muted' : 'text-slate-600'
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
      <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl lg:rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform ${
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
        darkMode ? 'text-dark-muted' : 'text-slate-600'
      }`}>Live data</span>
    </div>
  </div>
);

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div className={`rounded-2xl shadow-xl p-4 border ${
        darkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-white border-brand-primary/10'
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
  const { metrics, orderStatusCounts, revenueSeries, bestSellers, lowStock, recentOrders, topCustomers, loading } = useSelector((state) => state.dashboard);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const handleViewInvoice = (order) => {
    setSelectedInvoice(order);
    setIsInvoiceModalOpen(true);
  };

  const handleCloseInvoice = () => {
    setIsInvoiceModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleDownloadInvoice = (order) => {
    setSelectedInvoice(order);
    setIsInvoiceModalOpen(true);
    // Auto-trigger download after modal opens
    setTimeout(() => {
      const printContent = document.getElementById('invoice-content');
      if (printContent) {
        const invoiceId = `INV-${order._id?.slice(-6)?.toUpperCase()}`;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Invoice ${invoiceId}</title>
              <style>
                body { font-family: 'Segoe UI', sans-serif; padding: 40px; color: #1e293b; }
                .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 40px; border-bottom: 2px solid #f59e0b; padding-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; color: #f59e0b; }
                .invoice-title { font-size: 28px; font-weight: bold; color: #1e293b; }
                .invoice-id { color: #64748b; font-size: 14px; }
                .section { margin-bottom: 30px; }
                .section-title { font-size: 12px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 8px; }
                .customer-info { background: #f8fafc; padding: 15px; border-radius: 8px; }
                .customer-name { font-size: 18px; font-weight: 600; }
                .customer-email { color: #64748b; font-size: 14px; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th { background: #f8fafc; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #64748b; border-bottom: 2px solid #e2e8f0; }
                td { padding: 12px; border-bottom: 1px solid #e2e8f0; }
                .amount { font-weight: 600; color: #f59e0b; }
                .total-row { background: #fef3c7; }
                .total-row td { font-weight: bold; font-size: 16px; }
                .footer { margin-top: 40px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
              <script>window.print();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }, 500);
  };

  const handlePrintInvoice = (order) => {
    handleDownloadInvoice(order);
  };

  useEffect(() => {
    dispatch(fetchDashboard(parseInt(selectedPeriod)));
    dispatch(fetchPayments());
    setIsVisible(true);
  }, [dispatch, selectedPeriod]);

  useEffect(() => {
    if (!socket) return;
    socket.on("admin:dashboard", (payload) => {
      dispatch(updateRealtimeStats(payload));
    });
    return () => socket.off("admin:dashboard");
  }, [socket, dispatch]);

  const handleRefresh = () => {
    dispatch(fetchDashboard(parseInt(selectedPeriod)));
    dispatch(fetchPayments());
  };

  // Pie chart colors
  const ORDER_STATUS_COLORS = {
    pending: '#f59e0b',
    confirmed: '#3b82f6',
    processing: '#8b5cf6',
    shipped: '#f97316',
    delivered: '#22c55e',
    cancelled: '#ef4444',
  };

  // Prepare order status data for pie chart
  const orderStatusData = orderStatusCounts ? Object.entries(orderStatusCounts)
    .filter(([_, count]) => count > 0)
    .map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
      color: ORDER_STATUS_COLORS[status] || '#94a3b8',
    })) : [];

  if (loading || !metrics) {
    return (
      <div className={`min-h-[60vh] flex flex-col items-center justify-center relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
        <AnimatedBackground />
        <div className="z-10 text-center">
          <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className={`mt-4 font-medium font-display ${darkMode ? 'text-dark-text' : 'text-slate-700'}`}>Loading analytics dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
      <AnimatedBackground />
      <div className="p-5 lg:p-8 space-y-6 lg:space-y-8 relative z-10">
      {/* Welcome Header */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-5"
      }`}>
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className={`text-xl lg:text-2xl font-display font-bold ${
              darkMode ? 'text-dark-text' : 'text-brand-dark'
            }`}>Dashboard Overview</h1>
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
              darkMode ? 'bg-brand-primary/20 text-brand-secondary' : 'bg-brand-primary/10 text-brand-primary'
            }`}>Live</span>
          </div>
          <div className="flex items-center gap-4">
            <p className={`text-sm ${
              darkMode ? 'text-dark-muted' : 'text-slate-700'
            }`}>Welcome back! Here's what's happening with your business today.</p>
            <div className={`hidden md:flex items-center gap-2 text-xs ${
              darkMode ? 'text-dark-muted' : 'text-slate-600'
            }`}>
              <CalendarTodayIcon sx={{ fontSize: 14 }} />
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className={`p-2.5 rounded-2xl transition-all duration-300 ${
              darkMode 
                ? 'bg-dark-hover text-dark-text hover:bg-dark-border' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <RefreshIcon sx={{ fontSize: 20 }} />
          </button>
          <Link
            to="/admin/products"
            className="flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-primary to-brand-gold text-white font-semibold shadow-lg hover:shadow-brand-primary/30 hover:scale-105 transition-all duration-300"
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
        <MetricCard label="Customers" value={metrics.totalCustomers || 0} icon={<PeopleIcon sx={{ fontSize: 28 }} className={darkMode ? 'text-dark-muted' : 'text-slate-700'} />} color="slate" trend={5} index={3} isVisible={isVisible} darkMode={darkMode} />
      </div>

      {/* Revenue Chart */}
      <div className={`rounded-2xl lg:rounded-3xl shadow-lg p-5 lg:p-8 transition-all duration-700 border ${
        darkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10'
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`} style={{ transitionDelay: "200ms" }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 lg:mb-8 gap-4">
          <div>
            <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
              darkMode ? 'text-dark-muted' : 'text-slate-600'
            }`}>Revenue Analytics</p>
            <h3 className={`text-xl lg:text-2xl font-bold mt-1 ${
              darkMode ? 'text-dark-text' : 'text-slate-900'
            }`}>Sales Performance</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-primary animate-pulse"></span>
              <span className={`text-sm ${
                darkMode ? 'text-dark-muted' : 'text-slate-700'
              }`}>Revenue</span>
            </div>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className={`px-3 lg:px-4 py-2 rounded-2xl text-sm font-medium transition-all border outline-none ${
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
            : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "300ms" }}>
          <div className="flex items-center justify-between mb-5 lg:mb-6">
            <div>
              <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
                darkMode ? 'text-dark-muted' : 'text-slate-600'
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
              <div key={item._id} className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-2xl lg:rounded-2xl transition-all duration-500 ${
                darkMode 
                  ? 'bg-dark-bg hover:bg-dark-hover' 
                  : 'bg-slate-50 hover:bg-slate-100'
              } ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              }`} style={{ transitionDelay: `${350 + index * 50}ms` }}>
                <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-2xl flex items-center justify-center font-bold text-white text-sm ${
                  index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-500" :
                  index === 1 ? "bg-gradient-to-br from-slate-400 to-slate-500" :
                  index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700" :
                  darkMode ? "bg-dark-border" : "bg-slate-300"
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    darkMode ? 'text-dark-text' : 'text-brand-dark'
                  }`}>{item.name}</p>
                  <p className={`text-xs lg:text-sm truncate ${
                    darkMode ? 'text-dark-muted' : 'text-slate-700'
                  }`}>{item.category || "Product"}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-primary">{item.quantity} units</p>
                  <p className={`text-[10px] lg:text-xs ${
                    darkMode ? 'text-dark-muted' : 'text-slate-600'
                  }`}>sold</p>
                </div>
              </div>
            )) : (
              <p className={`text-center py-8 ${
                darkMode ? 'text-dark-muted' : 'text-slate-700'
              }`}>No sales data yet</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`rounded-2xl lg:rounded-3xl shadow-lg p-5 lg:p-8 transition-all duration-700 border ${
          darkMode 
            ? 'bg-dark-card border-dark-border' 
            : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "400ms" }}>
          <div className="flex items-center justify-between mb-5 lg:mb-6">
            <div>
              <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
                darkMode ? 'text-dark-muted' : 'text-slate-600'
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
              <div key={product._id} className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-4 rounded-2xl lg:rounded-2xl border transition-all duration-500 ${
                darkMode 
                  ? 'bg-red-500/10 border-red-500/20' 
                  : 'bg-red-50 border-red-100'
              } ${
                isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
              }`} style={{ transitionDelay: `${400 + index * 50}ms` }}>
                <div className={`w-9 h-9 lg:w-10 lg:h-10 rounded-lg lg:rounded-2xl flex items-center justify-center hover:scale-110 transition-transform ${
                  darkMode ? 'bg-red-500/20' : 'bg-red-100'
                }`}>
                  <WarningIcon sx={{ fontSize: 20 }} className="text-red-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    darkMode ? 'text-dark-text' : 'text-brand-dark'
                  }`}>{product.name}</p>
                  <p className={`text-xs lg:text-sm truncate ${
                    darkMode ? 'text-dark-muted' : 'text-slate-700'
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
                <p className={darkMode ? 'text-dark-muted' : 'text-slate-700'}>All items are well stocked!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Status & Analytics Row */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Order Status Breakdown */}
        <div className={`rounded-2xl lg:rounded-3xl shadow-lg p-5 lg:p-8 transition-all duration-700 border ${
          darkMode 
            ? 'bg-dark-card border-dark-border' 
            : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "450ms" }}>
          <div className="mb-5 lg:mb-6">
            <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
              darkMode ? 'text-dark-muted' : 'text-slate-600'
            }`}>Order Analytics</p>
            <h4 className={`text-lg lg:text-xl font-bold mt-1 ${
              darkMode ? 'text-dark-text' : 'text-slate-900'
            }`}>Order Status</h4>
          </div>
          
          {orderStatusData.length > 0 ? (
            <>
              <div className="flex justify-center mb-4">
                <ResponsiveContainer width={180} height={180}>
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name) => [`${value} orders`, name]}
                      contentStyle={{
                        backgroundColor: darkMode ? '#1a1a1a' : '#fff',
                        border: `1px solid ${darkMode ? '#2a2a2a' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        color: darkMode ? '#E5E5E5' : '#1e293b',
                      }}
                      itemStyle={{
                        color: darkMode ? '#E5E5E5' : '#1e293b',
                      }}
                      labelStyle={{
                        color: darkMode ? '#A3A3A3' : '#64748b',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {orderStatusData.map((status) => (
                  <div key={status.name} className="flex items-center gap-2 text-sm">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }}></span>
                    <span className={darkMode ? 'text-dark-muted' : 'text-slate-600'}>{status.name}</span>
                    <span className={`font-semibold ml-auto ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>{status.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <PendingIcon sx={{ fontSize: 48 }} className={darkMode ? 'text-dark-muted' : 'text-slate-300'} />
              <p className={`mt-2 ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>No order data yet</p>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className={`lg:col-span-2 rounded-2xl lg:rounded-3xl shadow-lg p-5 lg:p-8 transition-all duration-700 border ${
          darkMode 
            ? 'bg-dark-card border-dark-border' 
            : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10'
        } ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`} style={{ transitionDelay: "500ms" }}>
          <div className="flex items-center justify-between mb-5 lg:mb-6">
            <div>
              <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
                darkMode ? 'text-dark-muted' : 'text-slate-600'
              }`}>Recent Activity</p>
              <h4 className={`text-lg lg:text-xl font-bold mt-1 ${
                darkMode ? 'text-dark-text' : 'text-slate-900'
              }`}>Latest Orders</h4>
            </div>
            <Link to="/admin/orders" className="text-sm font-semibold text-brand-primary hover:text-brand-gold transition-colors">
              View All →
            </Link>
          </div>
          
          <div className="space-y-3">
            {recentOrders && recentOrders.length > 0 ? recentOrders.map((order, index) => (
              <div key={order._id} className={`flex items-center gap-4 p-3 lg:p-4 rounded-2xl lg:rounded-2xl transition-all duration-300 ${
                darkMode 
                  ? 'bg-dark-bg hover:bg-dark-hover' 
                  : 'bg-slate-50 hover:bg-slate-100'
              }`}>
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                  darkMode ? 'bg-brand-primary/20' : 'bg-brand-primary/10'
                }`}>
                  <ReceiptIcon sx={{ fontSize: 20 }} className="text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold truncate ${
                    darkMode ? 'text-dark-text' : 'text-brand-dark'
                  }`}>{order.user?.name || 'Guest'}</p>
                  <p className={`text-xs truncate ${
                    darkMode ? 'text-dark-muted' : 'text-slate-700'
                  }`}>Order #{order._id?.slice(-8)?.toUpperCase()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-brand-primary">₹{order.totalAmount?.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    order.orderStatus === 'delivered' 
                      ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                      : order.orderStatus === 'cancelled'
                      ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                      : order.orderStatus === 'shipped'
                      ? darkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                      : darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {order.orderStatus?.charAt(0).toUpperCase() + order.orderStatus?.slice(1)}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <LocalShippingIcon sx={{ fontSize: 48 }} className={darkMode ? 'text-dark-muted' : 'text-slate-300'} />
                <p className={`mt-2 ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>No recent orders</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Top Customers */}
      <div className={`rounded-2xl lg:rounded-3xl shadow-lg p-5 lg:p-8 transition-all duration-700 border ${
        darkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10'
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`} style={{ transitionDelay: "550ms" }}>
        <div className="flex items-center justify-between mb-5 lg:mb-6">
          <div>
            <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
              darkMode ? 'text-dark-muted' : 'text-slate-600'
            }`}>Customer Insights</p>
            <h4 className={`text-lg lg:text-xl font-bold mt-1 ${
              darkMode ? 'text-dark-text' : 'text-slate-900'
            }`}>Top Customers</h4>
          </div>
          <Link to="/admin/users" className="text-sm font-semibold text-brand-primary hover:text-brand-gold transition-colors">
            View All →
          </Link>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {topCustomers && topCustomers.length > 0 ? topCustomers.map((customer, index) => (
            <div key={customer._id} className={`p-4 rounded-2xl lg:rounded-2xl text-center transition-all duration-300 hover:scale-105 ${
              darkMode 
                ? 'bg-dark-bg hover:bg-dark-hover' 
                : 'bg-slate-50 hover:bg-slate-100'
            }`}>
              <div className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold text-white ${
                index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-500" :
                index === 1 ? "bg-gradient-to-br from-slate-400 to-slate-500" :
                index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-700" :
                "bg-gradient-to-br from-brand-primary to-brand-gold"
              }`}>
                {customer.name?.charAt(0)?.toUpperCase() || <PersonIcon />}
              </div>
              <p className={`font-semibold truncate ${
                darkMode ? 'text-dark-text' : 'text-brand-dark'
              }`}>{customer.name || 'Unknown'}</p>
              <p className="text-brand-primary font-bold mt-1">₹{customer.totalSpent?.toLocaleString()}</p>
              <p className={`text-xs mt-1 ${
                darkMode ? 'text-dark-muted' : 'text-slate-700'
              }`}>{customer.orderCount} orders</p>
            </div>
          )) : (
            <div className="col-span-full text-center py-8">
              <PeopleIcon sx={{ fontSize: 48 }} className={darkMode ? 'text-dark-muted' : 'text-slate-300'} />
              <p className={`mt-2 ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>No customer data yet</p>
            </div>
          )}
        </div>
      </div>

      {/* User Purchase Invoices Section */}
      <div className={`rounded-2xl lg:rounded-3xl shadow-lg p-5 lg:p-8 transition-all duration-700 border ${
        darkMode 
          ? 'bg-dark-card border-dark-border' 
          : 'bg-gradient-to-br from-white to-slate-50 border-brand-primary/10'
      } ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`} style={{ transitionDelay: "600ms" }}>
        <div className="flex items-center justify-between mb-5 lg:mb-6">
          <div>
            <p className={`text-[10px] lg:text-xs uppercase tracking-[0.3em] lg:tracking-[0.4em] font-semibold ${
              darkMode ? 'text-dark-muted' : 'text-slate-600'
            }`}>Purchase Details</p>
            <h4 className={`text-lg lg:text-xl font-bold mt-1 ${
              darkMode ? 'text-dark-text' : 'text-slate-900'
            }`}>User Invoices</h4>
          </div>
          <Link to="/admin/orders" className="text-sm font-semibold text-brand-primary hover:text-brand-gold transition-colors flex items-center gap-1">
            <ReceiptLongIcon sx={{ fontSize: 16 }} />
            All Invoices →
          </Link>
        </div>
        
        {/* Invoice Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={`text-left text-xs uppercase tracking-wider ${
                darkMode ? 'text-dark-muted' : 'text-slate-700'
              }`}>
                <th className="pb-4 font-semibold">Invoice ID</th>
                <th className="pb-4 font-semibold">Customer</th>
                <th className="pb-4 font-semibold">Items</th>
                <th className="pb-4 font-semibold">Date</th>
                <th className="pb-4 font-semibold">Amount</th>
                <th className="pb-4 font-semibold">Status</th>
                <th className="pb-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-dark-border">
              {recentOrders && recentOrders.length > 0 ? recentOrders.slice(0, 5).map((order, index) => (
                <tr key={order._id} className={`transition-all duration-300 ${
                  darkMode ? 'hover:bg-dark-hover' : 'hover:bg-slate-50'
                }`}>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        darkMode ? 'bg-brand-primary/20' : 'bg-brand-primary/10'
                      }`}>
                        <ReceiptLongIcon sx={{ fontSize: 16 }} className="text-brand-primary" />
                      </div>
                      <span className={`font-mono font-semibold ${
                        darkMode ? 'text-dark-text' : 'text-brand-dark'
                      }`}>INV-{order._id?.slice(-6)?.toUpperCase()}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
                        {order.user?.name || 'Guest User'}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>
                        {order.user?.email || 'No email'}
                      </p>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      darkMode ? 'bg-dark-bg text-dark-text' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {order.items?.length || 0} items
                    </span>
                  </td>
                  <td className="py-4">
                    <p className={`text-sm ${darkMode ? 'text-dark-muted' : 'text-slate-600'}`}>
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-brand-primary">₹{order.totalAmount?.toLocaleString()}</p>
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      order.paymentStatus === 'paid' || order.paymentStatus === 'completed'
                        ? darkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'
                        : order.paymentStatus === 'failed'
                        ? darkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'
                        : darkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {order.paymentStatus === 'paid' || order.paymentStatus === 'completed' ? (
                        <CheckCircleIcon sx={{ fontSize: 12 }} />
                      ) : order.paymentStatus === 'failed' ? (
                        <CancelIcon sx={{ fontSize: 12 }} />
                      ) : (
                        <PendingIcon sx={{ fontSize: 12 }} />
                      )}
                      {order.paymentStatus?.charAt(0).toUpperCase() + order.paymentStatus?.slice(1) || 'Pending'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewInvoice(order)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          darkMode 
                            ? 'hover:bg-dark-bg text-dark-muted hover:text-brand-primary' 
                            : 'hover:bg-slate-100 text-slate-600 hover:text-brand-primary'
                        }`}
                        title="View Invoice"
                      >
                        <VisibilityIcon sx={{ fontSize: 18 }} />
                      </button>
                      <button 
                        onClick={() => handleDownloadInvoice(order)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          darkMode 
                            ? 'hover:bg-dark-bg text-dark-muted hover:text-green-400' 
                            : 'hover:bg-slate-100 text-slate-600 hover:text-green-600'
                        }`}
                        title="Download Invoice"
                      >
                        <DownloadIcon sx={{ fontSize: 18 }} />
                      </button>
                      <button 
                        onClick={() => handlePrintInvoice(order)}
                        className={`p-2 rounded-lg transition-all duration-300 ${
                          darkMode 
                            ? 'hover:bg-dark-bg text-dark-muted hover:text-blue-400' 
                            : 'hover:bg-slate-100 text-slate-600 hover:text-blue-600'
                        }`}
                        title="Print Invoice"
                      >
                        <PrintIcon sx={{ fontSize: 18 }} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center">
                    <ReceiptLongIcon sx={{ fontSize: 48 }} className={darkMode ? 'text-dark-muted' : 'text-slate-300'} />
                    <p className={`mt-2 ${darkMode ? 'text-dark-muted' : 'text-slate-700'}`}>No invoices available yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Invoice Summary Stats */}
        {recentOrders && recentOrders.length > 0 && (
          <div className={`mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4 ${
            darkMode ? 'border-dark-border' : 'border-slate-200'
          }`}>
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${
                darkMode ? 'text-dark-muted' : 'text-slate-700'
              }`}>Total Invoices</p>
              <p className={`text-2xl font-bold mt-1 ${darkMode ? 'text-dark-text' : 'text-brand-dark'}`}>
                {metrics.totalOrders || 0}
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${
                darkMode ? 'text-dark-muted' : 'text-slate-700'
              }`}>Paid Invoices</p>
              <p className="text-2xl font-bold mt-1 text-green-500">
                {orderStatusCounts?.delivered || 0}
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${
                darkMode ? 'text-dark-muted' : 'text-slate-700'
              }`}>Pending Payment</p>
              <p className="text-2xl font-bold mt-1 text-amber-500">
                {orderStatusCounts?.pending || 0}
              </p>
            </div>
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-dark-bg' : 'bg-brand-cream'}`}>
              <p className={`text-xs font-semibold uppercase tracking-wider ${
                darkMode ? 'text-dark-muted' : 'text-slate-700'
              }`}>Total Revenue</p>
              <p className="text-2xl font-bold mt-1 text-brand-primary">
                ₹{metrics.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      <InvoiceModal 
        order={selectedInvoice} 
        isOpen={isInvoiceModalOpen} 
        onClose={handleCloseInvoice} 
        darkMode={darkMode} 
      />
      </div>
    </div>
  );
};

export default AdminDashboard;

