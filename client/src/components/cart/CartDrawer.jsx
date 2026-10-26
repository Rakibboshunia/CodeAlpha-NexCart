import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiTrash2, FiShoppingBag, FiMinus, FiPlus, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems, cartCount, cartSubtotal, shippingPrice, taxPrice, cartTotal,
    isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, clearCart,
  } = useCart();
  const drawerRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = isCartOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isCartOpen]);

  useEffect(() => {
    const handleKeydown = (e) => { if (e.key === 'Escape') setIsCartOpen(false); };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        role="dialog"
        aria-label="Shopping cart"
        className="fixed top-0 right-0 bottom-0 w-[420px] max-w-full bg-bg-card border-l border-white/[0.08] z-50 flex flex-col shadow-[−20px_0_60px_rgba(0,0,0,0.5)] animate-slide-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] flex-shrink-0">
          <div className="flex items-center gap-2 font-display font-bold text-lg text-white">
            <FiShoppingBag size={20} />
            Shopping Cart
            {cartCount > 0 && (
              <span className="bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <button
            id="close-cart-btn"
            onClick={() => setIsCartOpen(false)}
            className="bg-bg-elevated border border-white/[0.08] text-white/60 p-2 rounded-xl hover:text-white hover:bg-white/[0.1] transition-all"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Empty */}
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-4 p-8 text-center">
            <span className="text-6xl opacity-40">🛒</span>
            <h3 className="text-lg font-semibold text-white">Your cart is empty</h3>
            <p className="text-sm text-white/40">Add items to get started</p>
            <Link
              to="/products"
              onClick={() => setIsCartOpen(false)}
              className="mt-2 px-6 py-2.5 bg-gradient-primary text-white text-sm font-semibold rounded-xl shadow-purple hover:-translate-y-0.5 transition-all inline-block"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-3">
              {cartItems.map((item) => (
                <div key={item._id} className="grid grid-cols-[70px_1fr_auto] gap-3 bg-bg-elevated border border-white/[0.08] rounded-xl p-3 hover:border-primary/30 transition-all">
                  <img
                    src={item.images?.[0] || 'https://via.placeholder.com/70'}
                    alt={item.name}
                    className="w-[70px] h-[70px] object-cover rounded-lg bg-bg-card"
                  />
                  <div className="flex flex-col gap-1 min-w-0">
                    <Link
                      to={`/products/${item._id}`}
                      onClick={() => setIsCartOpen(false)}
                      className="text-xs font-semibold text-white leading-snug line-clamp-2 hover:text-primary-light transition-colors"
                    >
                      {item.name}
                    </Link>
                    <span className="text-sm font-bold text-gradient">${item.price.toFixed(2)}</span>
                    <div className="flex items-center gap-2 mt-auto">
                      {/* Qty */}
                      <div className="flex items-center border border-white/[0.08] rounded-lg overflow-hidden">
                        <button onClick={() => updateQuantity(item._id, item.quantity - 1)} disabled={item.quantity <= 1} className="bg-bg-card text-white px-2 py-1.5 hover:bg-white/[0.1] disabled:opacity-40 transition-colors">
                          <FiMinus size={11} />
                        </button>
                        <span className="px-3 text-xs font-bold border-x border-white/[0.08] text-white">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item._id, item.quantity + 1)} disabled={item.quantity >= item.stock} className="bg-bg-card text-white px-2 py-1.5 hover:bg-white/[0.1] disabled:opacity-40 transition-colors">
                          <FiPlus size={11} />
                        </button>
                      </div>
                      <button onClick={() => removeFromCart(item._id)} className="text-secondary/60 hover:text-secondary p-1 rounded hover:bg-secondary/10 transition-all">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-white/70 self-center whitespace-nowrap">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="px-5 py-4 border-t border-white/[0.08] bg-bg-secondary flex-shrink-0">
              <button onClick={clearCart} className="text-white/30 text-xs hover:text-secondary transition-colors block ml-auto mb-3">
                Clear Cart
              </button>
              <div className="space-y-1.5 mb-3">
                {[
                  { label: 'Subtotal', value: `$${cartSubtotal.toFixed(2)}` },
                  { label: 'Shipping', value: shippingPrice === 0 ? <span className="text-accent text-xs font-bold">FREE</span> : `$${shippingPrice}` },
                  { label: 'Tax (10%)', value: `$${Number(taxPrice).toFixed(2)}` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-sm text-white/50">
                    <span>{label}</span><span>{value}</span>
                  </div>
                ))}
                <div className="h-px bg-white/[0.08] my-2" />
                <div className="flex justify-between font-bold text-white">
                  <span>Total</span><span>${cartTotal.toFixed(2)}</span>
                </div>
              </div>
              {cartSubtotal < 100 && (
                <div className="bg-accent/10 border border-accent/20 text-accent text-xs text-center rounded-xl py-2 px-3 mb-3">
                  Add <strong>${(100 - cartSubtotal).toFixed(2)}</strong> more for FREE shipping!
                </div>
              )}
              <Link
                to="/checkout"
                id="proceed-to-checkout-btn"
                onClick={() => setIsCartOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-gradient-primary text-white font-semibold py-3 rounded-xl shadow-purple hover:shadow-glow hover:-translate-y-0.5 transition-all text-sm"
              >
                Proceed to Checkout <FiArrowRight />
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="flex items-center justify-center w-full mt-2 py-2.5 text-sm font-semibold text-white/60 bg-white/[0.06] border border-white/[0.08] rounded-xl hover:bg-white/[0.1] hover:text-white transition-all"
              >
                View Full Cart
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
