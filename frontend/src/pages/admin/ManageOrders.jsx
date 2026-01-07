import { useEffect, useState } from "react";
import api from "../../services/api";

const statuses = ["pending", "confirmed", "processing", "shipped", "out_for_delivery", "delivered", "cancelled"];

const ManageOrders = () => {
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

  return (
    <div className="p-8 space-y-4">
      <div className="flex items-center gap-4">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="px-4 py-2 rounded-full border border-slate-300">
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <button onClick={loadOrders} className="px-4 py-2 rounded-full border border-slate-300">Refresh</button>
      </div>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="border border-slate-200 rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{order.orderNumber}</p>
                <h3 className="text-xl font-semibold">₹ {order.totalAmount.toLocaleString()}</h3>
                <p className="text-sm text-slate-500">{order.user.name}</p>
              </div>
              <select value={order.orderStatus} onChange={(e) => handleStatusChange(order._id, e.target.value)} className="px-4 py-2 rounded-full border border-slate-300">
                {statuses.map((status) => (
                  <option key={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {!orders.length && <p className="text-slate-500">No orders in this state.</p>}
      </div>
    </div>
  );
};

export default ManageOrders;
