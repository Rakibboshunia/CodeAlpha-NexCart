import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiPackage, FiCreditCard, FiMapPin, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';
import toast from 'react-hot-toast';

const inputCls = 'bg-bg-elevated border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all w-full';

const Checkout = () => {
  const { cartItems, cartSubtotal, shippingPrice, taxPrice, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep]     = useState(1);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPay] = useState('Cash on Delivery');

  const [ship, setShip] = useState({
    fullName: user?.name || '', address: '', city: '', postalCode: '', country: '', phone: '',
  });

  const handleShipSubmit = (e) => {
    e.preventDefault();
    const { fullName, address, city, postalCode, country, phone } = ship;
    if (!fullName || !address || !city || !postalCode || !country || !phone) return toast.error('Please fill all fields');
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await ordersAPI.create({
        orderItems: cartItems.map((i) => ({ product: i._id, name: i.name, image: i.images?.[0] || '', price: i.price, quantity: i.quantity })),
        shippingAddress: ship,
        paymentMethod,
        itemsPrice: cartSubtotal,
        shippingPrice,
        taxPrice,
        totalPrice: cartTotal,
      });
      clearCart();
      toast.success('Order placed! 🎉');
      navigate(`/orders/${data.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally { setLoading(false); }
  };

  const STEPS = [
    { num: 1, label: 'Shipping', icon: <FiMapPin size={16} /> },
    { num: 2, label: 'Payment', icon: <FiCreditCard size={16} /> },
    { num: 3, label: 'Review',  icon: <FiPackage size={16} /> },
  ];

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-bg-primary pt-24 flex items-center justify-center">
      <div className="text-center">
        <span className="text-6xl block mb-4 opacity-30">🛒</span>
        <h3 className="text-xl font-semibold text-white mb-3">Your cart is empty</h3>
        <Link to="/products" className="inline-block bg-gradient-primary text-white font-bold px-6 py-3 rounded-xl shadow-purple">Shop Now</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-display font-bold text-3xl text-white mb-8">Checkout</h1>

        {/* Stepper */}
        <div className="flex items-center mb-10">
          {STEPS.map(({ num, label, icon }, i) => (
            <div key={num} className="flex items-center flex-1 last:flex-none">
              <div className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > num  ? 'bg-primary text-white shadow-[0_0_0_4px_rgba(108,99,255,0.2)]' :
                  step === num ? 'bg-primary/15 border-2 border-primary text-primary-light' :
                                 'bg-bg-elevated border-2 border-white/[0.08] text-white/30'
                }`}>
                  {step > num ? <FiCheck size={16} /> : icon}
                </div>
                
                <span className={`text-sm font-medium hidden sm:block ${step >= num ? 'text-white' : 'text-white/30'}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-3 transition-all ${step > num ? 'bg-primary' : 'bg-white/[0.08]'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">
          {/* Main */}
          <div className="bg-bg-card border border-white/[0.08] rounded-2xl p-6">

            {/* Step 1 */}
            {step === 1 && (
              <div className="animate-fade-in">
                <h2 className="flex items-center gap-2 font-display font-bold text-xl text-white mb-6"><FiMapPin className="text-primary-light" /> Shipping Address</h2>
                <form id="shipping-form" onSubmit={handleShipSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    
                    <div>
                      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5" htmlFor="ship-fullname">Full Name</label>
                      <input id="ship-fullname" type="text" className={inputCls} value={ship.fullName} onChange={(e) => setShip({ ...ship, fullName: e.target.value })} required />
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5" htmlFor="ship-phone">Phone</label>
                      <input id="ship-phone" type="tel" className={inputCls} placeholder="+1 234 567 8900" value={ship.phone} onChange={(e) => setShip({ ...ship, phone: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5" htmlFor="ship-address">Street Address</label>
                    <input id="ship-address" type="text" className={inputCls} placeholder="123 Main St, Apt 4B" value={ship.address} onChange={(e) => setShip({ ...ship, address: e.target.value })} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5" htmlFor="ship-city">City</label>
                      <input id="ship-city" type="text" className={inputCls} value={ship.city} onChange={(e) => setShip({ ...ship, city: e.target.value })} required />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5" htmlFor="ship-postal">Postal Code</label>
                      <input id="ship-postal" type="text" className={inputCls} value={ship.postalCode} onChange={(e) => setShip({ ...ship, postalCode: e.target.value })} required />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-wider block mb-1.5" htmlFor="ship-country">Country</label>
                    <input id="ship-country" type="text" className={inputCls} placeholder="United States" value={ship.country} onChange={(e) => setShip({ ...ship, country: e.target.value })} required />
                  </div>
                  <button type="submit" id="continue-to-payment-btn" className="w-full bg-gradient-primary text-white font-bold py-3.5 rounded-xl shadow-purple hover:-translate-y-0.5 transition-all mt-2">
                    Continue to Payment
                  </button>
                </form>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="animate-fade-in">
                <h2 className="flex items-center gap-2 font-display font-bold text-xl text-white mb-6"><FiCreditCard className="text-primary-light" /> Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {['Cash on Delivery', 'Credit/Debit Card', 'PayPal'].map((method) => (
                    <label key={method} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === method ? 'border-primary bg-primary/[0.08]' : 'border-white/[0.08] bg-bg-elevated hover:border-primary/30'}`}>
                      <input type="radio" className="hidden" value={method} checked={paymentMethod === method} onChange={() => setPay(method)} />
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method ? 'border-primary' : 'border-white/30'}`}>
                        {paymentMethod === method && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                      <div>
                        <div className="font-semibold text-sm text-white">{method}</div>
                        <div className="text-xs text-white/40 mt-0.5">
                          {method === 'Cash on Delivery' && 'Pay when you receive your order'}
                          {method === 'Credit/Debit Card' && 'Visa, Mastercard, American Express'}
                          {method === 'PayPal' && 'Fast and secure PayPal payment'}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-6 py-3 bg-white/[0.06] border border-white/[0.08] text-white text-sm font-semibold rounded-xl hover:bg-white/[0.1] transition-all">Back</button>
                  <button id="continue-to-review-btn" onClick={() => setStep(3)} className="flex-1 bg-gradient-primary text-white font-bold py-3 rounded-xl shadow-purple hover:-translate-y-0.5 transition-all">Continue to Review</button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="animate-fade-in">
                <h2 className="flex items-center gap-2 font-display font-bold text-xl text-white mb-6"><FiPackage className="text-primary-light" /> Order Review</h2>
                {/* Shipping summary */}
                <div className="mb-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Shipping To</p>
                  <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-4 text-sm text-white/60 leading-7">
                    <p>{ship.fullName}</p>
                    <p>{ship.address}, {ship.city}, {ship.postalCode}</p>
                    <p>{ship.country} · 📞 {ship.phone}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Payment</p>
                  <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-4 text-sm text-white/60">{paymentMethod}</div>
                </div>
                <div className="mb-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/40 mb-2">Items</p>
                  <div className="space-y-2">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center gap-3 p-3 bg-bg-elevated border border-white/[0.08] rounded-xl">
                        <img src={item.images?.[0]} alt={item.name} className="w-12 h-12 object-cover rounded-lg bg-bg-card" />
                        <div className="flex-1 text-sm text-white/60 min-w-0">
                          <div className="truncate">{item.name}</div>
                          <div className="text-xs text-white/30">×{item.quantity}</div>
                        </div>
                        <span className="text-sm font-bold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="px-6 py-3 bg-white/[0.06] border border-white/[0.08] text-white text-sm font-semibold rounded-xl hover:bg-white/[0.1] transition-all">Back</button>
                  <button
                    id="place-order-btn"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-primary text-white font-bold py-3 rounded-xl shadow-purple hover:-translate-y-0.5 disabled:opacity-60 disabled:transform-none transition-all"
                  >
                    {loading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Placing...</> : '🎉 Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="bg-bg-card border border-white/[0.08] rounded-2xl p-6 sticky top-24">
            <h3 className="font-display font-bold text-lg text-white mb-3">Order Summary</h3>
            <div className="h-px bg-white/[0.08] mb-4" />
            <div className="space-y-2 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex items-center gap-2 text-xs text-white/50">
                  <span className="flex-1 truncate">{item.name}</span>
                  <span>×{item.quantity}</span>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-white/[0.08] mb-3" />
            <div className="space-y-2">
              {[
                { label: 'Subtotal', value: `$${cartSubtotal.toFixed(2)}` },
                { label: 'Shipping', value: shippingPrice === 0 ? <span className="text-accent text-xs font-bold">FREE</span> : `$${shippingPrice}` },
                { label: 'Tax', value: `$${taxPrice.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm text-white/50">
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
              <div className="h-px bg-white/[0.08]" />
              <div className="flex justify-between font-bold text-white">
                <span>Total</span><span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
