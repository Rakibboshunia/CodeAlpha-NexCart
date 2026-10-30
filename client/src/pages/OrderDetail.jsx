import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FiPackage, FiMapPin, FiCreditCard, FiArrowLeft, FiXCircle, FiCheck } from 'react-icons/fi';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Delivered'];

const statusColors = {
  Pending:    'text-amber-400 bg-amber-400/10 border-amber-400/20',
  Processing: 'text-primary-light bg-primary/10 border-primary/20',
  Shipped:    'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
  Delivered:  'text-accent bg-accent/10 border-accent/20',
  Cancelled:  'text-secondary bg-secondary/10 border-secondary/20',
};

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    ordersAPI.getById(id)
      .then(({ data }) => setOrder(data.data))
      .catch(() => { toast.error('Order not found'); navigate('/orders'); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await ordersAPI.cancel(id);
      toast.success('Order cancelled');
      setOrder({ ...order, orderStatus: 'Cancelled' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot cancel order');
    }
  };

  if (loading) return <div className="min-h-screen bg-bg-primary pt-24 flex items-center justify-center"><div className="spinner" /></div>;
  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.orderStatus);

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <button onClick={() => navigate('/orders')} className="flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
          <FiArrowLeft size={15} /> Back to Orders
        </button>
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-2">
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-white/40">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${statusColors[order.orderStatus] || statusColors.Pending}`}>
              {order.orderStatus}
            </span>
          </div>
        </div>

        {/* Progress Tracker */}
        {order.orderStatus !== 'Cancelled' && (
          <div className="bg-bg-card border border-white/[0.08] rounded-2xl p-6 mb-6">
            <div className="flex items-center">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      i <= currentStep
                        ? 'bg-primary text-white shadow-[0_0_0_4px_rgba(108,99,255,0.2)]'
                        : 'bg-bg-elevated border-2 border-white/[0.08] text-white/30'
                    }`}>
                      {i < currentStep ? <FiCheck size={15} /> : i + 1}
                    </div>
                    <span className={`text-xs font-medium whitespace-nowrap ${i <= currentStep ? 'text-white' : 'text-white/30'}`}>{step}</span>
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-2 mb-5 transition-all ${i < currentStep ? 'bg-primary' : 'bg-white/[0.08]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Left */}
          <div className="space-y-4">
            {/* Items */}
            <div className="bg-bg-card border border-white/[0.08] rounded-2xl p-5">
              <h3 className="flex items-center gap-2 font-semibold text-white mb-4"><FiPackage className="text-primary-light" /> Order Items</h3>
              <div className="space-y-3">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="flex items-center gap-3 pb-3 border-b border-white/[0.08] last:border-0 last:pb-0">
                    <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl bg-bg-elevated border border-white/[0.08]" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/products/${item.product?._id || item.product}`} className="text-sm font-semibold text-white hover:text-primary-light transition-colors block truncate">{item.name}</Link>
                      <span className="text-xs text-white/40">Qty: {item.quantity}</span>
                    </div>
                    <span className="font-bold text-sm text-white whitespace-nowrap">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-bg-card border border-white/[0.08] rounded-2xl p-5">
              <h3 className="flex items-center gap-2 font-semibold text-white mb-3"><FiMapPin className="text-primary-light" /> Shipping Address</h3>
              <div className="text-sm text-white/50 leading-7">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                <p>{order.shippingAddress.country} · 📞 {order.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-bg-card border border-white/[0.08] rounded-2xl p-5">
              <h3 className="flex items-center gap-2 font-semibold text-white mb-3"><FiCreditCard className="text-primary-light" /> Payment</h3>
              <div className="text-sm text-white/50 space-y-1">
                <p>Method: {order.paymentMethod}</p>
                <p>Status: {order.isPaid
                  ? <span className="text-accent font-semibold">✓ Paid</span>
                  : <span className="text-amber-400 font-semibold">Pending</span>}
                </p>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="space-y-4">
            {/* Price Summary */}
            <div className="bg-bg-card border border-white/[0.08] rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">Price Summary</h3>
              <div className="space-y-2">
                {[
                  { label: 'Items', value: `$${order.itemsPrice?.toFixed(2)}` },
                  { label: 'Shipping', value: order.shippingPrice === 0 ? <span className="text-accent text-xs font-bold">FREE</span> : `$${order.shippingPrice}` },
                  { label: 'Tax', value: `$${order.taxPrice?.toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm text-white/50">
                    <span>{label}</span><span>{value}</span>
                  </div>
                ))}
                <div className="h-px bg-white/[0.08]" />
                <div className="flex justify-between font-bold text-white">
                  <span>Total</span><span>${order.totalPrice?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Cancel */}
            {(order.orderStatus === 'Pending' || order.orderStatus === 'Processing') && (
              <button
                id="cancel-order-btn"
                onClick={handleCancel}
                className="w-full flex items-center justify-center gap-2 bg-secondary/10 border border-secondary/20 text-secondary font-semibold py-3 rounded-xl hover:bg-secondary/15 hover:-translate-y-0.5 transition-all text-sm"
              >
                <FiXCircle size={16} /> Cancel Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
