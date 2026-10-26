import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiArrowRight, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cartItems, cartSubtotal, shippingPrice, taxPrice, cartTotal, removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) { toast.error('Please login to checkout'); navigate('/login'); return; }
    navigate('/checkout');
  };

  if (cartItems.length === 0) return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <span className="text-8xl opacity-30">🛒</span>
        <h1 className="font-display font-bold text-2xl text-white">Your cart is empty</h1>
        <p className="text-white/40">Looks like you haven't added any items yet</p>
        <Link to="/products" className="flex items-center gap-2 bg-gradient-primary text-white font-bold px-8 py-3.5 rounded-xl shadow-purple hover:-translate-y-0.5 transition-all mt-2">
          <FiShoppingBag /> Start Shopping
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display font-bold text-3xl text-white">Shopping Cart</h1>
          <button onClick={clearCart} className="flex items-center gap-1.5 text-sm text-secondary/70 hover:text-secondary bg-secondary/10 hover:bg-secondary/15 border border-secondary/20 px-3 py-2 rounded-xl transition-all">
            <FiTrash2 size={14} /> Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 items-start">
          {/* Items */}
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="grid grid-cols-[100px_1fr_auto] gap-4 bg-bg-card border border-white/[0.08] rounded-2xl p-4 hover:border-primary/30 transition-all">
                <Link to={`/products/${item._id}`}>
                  <img src={item.images?.[0]} alt={item.name} className="w-[100px] h-[100px] object-cover rounded-xl bg-bg-elevated" />
                </Link>
                <div className="flex flex-col gap-1.5">
                  <Link to={`/products/${item._id}`} className="font-semibold text-white hover:text-primary-light transition-colors leading-snug">{item.name}</Link>
                  <div className="text-xs text-white/40">{item.brand}</div>
                  <div className="text-lg font-bold text-gradient">${item.price.toFixed(2)}</div>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="flex items-center border border-white/[0.08] rounded-xl overflow-hidden">
                      <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1} className="bg-bg-elevated text-white px-3 py-2 hover:bg-white/[0.1] disabled:opacity-40 transition-colors">
                        <FiMinus size={12} />
                      </button>
                      <span className="px-4 text-sm font-bold border-x border-white/[0.08] text-white">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="bg-bg-elevated text-white px-3 py-2 hover:bg-white/[0.1] disabled:opacity-40 transition-colors">
                        <FiPlus size={12} />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item._id)} className="text-secondary/50 hover:text-secondary p-2 rounded-lg hover:bg-secondary/10 transition-all">
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                </div>
                <div className="font-bold text-white self-center">${(item.price * item.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-bg-card border border-white/[0.08] rounded-2xl p-6 sticky top-24">
            <h3 className="font-display font-bold text-lg text-white mb-4">Order Summary</h3>
            <div className="h-px bg-white/[0.08] mb-4" />
            <div className="space-y-2.5 mb-4">
              {[
                { label: `Subtotal (${cartItems.reduce((a, i) => a + i.quantity, 0)} items)`, value: `$${cartSubtotal.toFixed(2)}` },
                { label: 'Shipping', value: shippingPrice === 0 ? <span className="text-accent text-xs font-bold">FREE</span> : `$${shippingPrice}` },
                { label: 'Tax (10%)', value: `$${taxPrice.toFixed(2)}` },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm text-white/50">
                  <span>{label}</span><span>{value}</span>
                </div>
              ))}
              <div className="h-px bg-white/[0.08]" />
              <div className="flex justify-between font-bold text-white text-base">
                <span>Total</span><span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
            {cartSubtotal < 100 && (
              <div className="bg-accent/10 border border-accent/20 text-accent text-xs rounded-xl px-3 py-2.5 text-center mb-4">
                🚚 Add <strong>${(100 - cartSubtotal).toFixed(2)}</strong> more for FREE shipping!
              </div>
            )}
            <button
              id="checkout-btn"
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white font-bold py-3.5 rounded-xl shadow-purple hover:shadow-glow hover:-translate-y-0.5 transition-all"
            >
              Proceed to Checkout <FiArrowRight />
            </button>
            <Link to="/products" className="flex items-center justify-center w-full mt-3 py-2.5 text-sm text-white/50 bg-white/[0.04] border border-white/[0.08] rounded-xl hover:bg-white/[0.08] hover:text-white transition-all">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
