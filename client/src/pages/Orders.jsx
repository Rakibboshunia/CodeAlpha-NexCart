import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiClock, FiCheckCircle, FiTruck, FiXCircle } from 'react-icons/fi';
import { ordersAPI } from '../services/api';

const statusConfig = {
  Pending:    { icon: <FiClock size={13} />,       color: 'text-amber-400',    bg: 'bg-amber-400/10 border-amber-400/20' },
  Processing: { icon: <FiPackage size={13} />,     color: 'text-primary-light', bg: 'bg-primary/10 border-primary/20' },
  Shipped:    { icon: <FiTruck size={13} />,       color: 'text-cyan-400',     bg: 'bg-cyan-400/10 border-cyan-400/20' },
  Delivered:  { icon: <FiCheckCircle size={13} />, color: 'text-accent',       bg: 'bg-accent/10 border-accent/20' },
  Cancelled:  { icon: <FiXCircle size={13} />,     color: 'text-secondary',    bg: 'bg-secondary/10 border-secondary/20' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersAPI.getMyOrders()
      .then(({ data }) => setOrders(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-bg-primary pt-24 flex items-center justify-center">
      <div className="spinner" />
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center gap-3 mb-8">
          <h1 className="font-display font-bold text-3xl text-white">My Orders</h1>
          <span className="bg-primary/20 text-primary-light text-xs font-bold px-3 py-1 rounded-full border border-primary/30">
            {orders.length} Total
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <span className="text-7xl opacity-30">📦</span>
            <h3 className="text-xl font-semibold text-white">No orders yet</h3>
            <p className="text-white/40">You haven't placed any orders. Start shopping!</p>
            <Link to="/products" className="mt-2 bg-gradient-primary text-white font-bold px-8 py-3 rounded-xl shadow-purple hover:-translate-y-0.5 transition-all">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const st = statusConfig[order.orderStatus] || statusConfig.Pending;
              return (
                <Link
                  key={order._id}
                  to={`/orders/${order._id}`}
                  id={`order-${order._id}`}
                  className="flex flex-col gap-4 bg-bg-card border border-white/[0.08] rounded-2xl p-5 hover:border-primary/30 hover:-translate-y-0.5 hover:shadow-glow transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-semibold text-white text-sm">
                      <FiPackage size={15} className="text-white/40" />
                      Order #{order._id.slice(-8).toUpperCase()}
                    </div>
                    <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${st.bg} ${st.color}`}>
                      {st.icon} {order.orderStatus}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.orderItems.slice(0, 4).map((item, i) => (
                      <img key={i} src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-white/[0.08] bg-bg-elevated" />
                    ))}
                    {order.orderItems.length > 4 && (
                      <div className="w-12 h-12 rounded-xl border border-white/[0.08] bg-bg-elevated flex items-center justify-center text-xs text-white/40 font-semibold">
                        +{order.orderItems.length - 4}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-white/[0.08] pt-3">
                    <div className="flex gap-4 text-xs text-white/30">
                      <span>{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      <span>{order.orderItems.reduce((a, i) => a + i.quantity, 0)} items</span>
                    </div>
                    <span className="text-base font-bold text-gradient">${order.totalPrice.toFixed(2)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
