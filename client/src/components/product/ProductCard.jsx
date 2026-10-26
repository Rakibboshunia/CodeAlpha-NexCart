import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const discountPct = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <Link
      to={`/products/${product._id}`}
      id={`product-${product._id}`}
      className="group bg-bg-card border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col cursor-pointer hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-glow transition-all duration-300 animate-fade-in"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-bg-elevated">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {discountPct > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-secondary text-black text-xs font-bold px-2.5 py-1 rounded-full z-10">
            -{discountPct}%
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-secondary/90 text-white text-xs font-bold px-2.5 py-1 rounded-full z-10">
            Out of Stock
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center gap-2 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            id={`add-to-cart-${product._id}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-primary text-white text-xs font-semibold py-2.5 rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <FiShoppingCart size={14} /> Add to Cart
          </button>
          <Link
            to={`/products/${product._id}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/20 border border-white/30 text-white p-2.5 rounded-xl hover:bg-white/30 transition-all"
          >
            <FiEye size={15} />
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-1.5 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-widest text-primary-light">
          {product.category}
        </div>
        <h3 className="text-sm font-semibold text-white leading-snug line-clamp-2">
          {product.name}
        </h3>
        <div className="text-xs text-white/40">{product.brand}</div>

        {/* Stars */}
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <FiStar
                key={i}
                size={11}
                className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}
              />
            ))}
          </div>
          <span className="text-[11px] text-white/30">({product.numReviews})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-lg font-bold text-gradient">${product.price.toFixed(2)}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-white/30 line-through">${product.originalPrice.toFixed(2)}</span>
          )}
        </div>

        {product.stock > 0 && product.stock <= 10 && (
          <div className="text-[11px] font-semibold text-accent2">Only {product.stock} left!</div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
