import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiMinus, FiPlus, FiTruck, FiShield, FiCheckCircle } from 'react-icons/fi';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const inputCls = 'bg-bg-elevated border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all w-full';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [quantity, setQuantity]     = useState(1);
  const [activeTab, setActiveTab]   = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    productsAPI.getById(id)
      .then(({ data }) => setProduct(data.data))
      .catch(() => toast.error('Product not found'))
      .finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) return toast.error('Please login to leave a review');
    setSubmitting(true);
    try {
      await productsAPI.addReview(id, reviewForm);
      toast.success('Review submitted!');
      setReviewForm({ rating: 5, comment: '' });
      const { data } = await productsAPI.getById(id);
      setProduct(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally { setSubmitting(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-4/5 rounded-xl" />
            <div className="skeleton h-5 w-3/5 rounded-xl" />
            <div className="skeleton h-12 w-2/5 rounded-xl" />
            <div className="skeleton h-28 rounded-xl" />
            <div className="skeleton h-14 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return null;

  const discountPct = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-white/30 mb-8">
          <Link to="/" className="hover:text-primary-light transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-light transition-colors">Products</Link>
          <span>/</span>
          <Link to={`/products?category=${product.category}`} className="hover:text-primary-light transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-white/60 truncate max-w-xs">{product.name}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">

          {/* Images */}
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-bg-card border border-white/[0.08] mb-3 group">
              <img
                src={product.images?.[selectedImg] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {discountPct > 0 && (
                <div className="absolute top-4 left-4 bg-gradient-secondary text-black text-xs font-extrabold px-3 py-1.5 rounded-full">
                  -{discountPct}% OFF
                </div>
              )}
            </div>
            {product.images?.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${selectedImg === i ? 'border-primary shadow-[0_0_0_2px_rgba(108,99,255,0.3)]' : 'border-white/[0.08] hover:border-primary/40'}`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            <div className="text-xs font-bold uppercase tracking-widest text-primary-light">{product.category}</div>
            <h1 className="font-display font-bold text-3xl text-white leading-snug">{product.name}</h1>
            <div className="text-sm text-white/40">by {product.brand}</div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={16} className={i < Math.round(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'} />
                ))}
              </div>
              <span className="text-sm text-white/40">{product.rating.toFixed(1)} ({product.numReviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-gradient">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-base text-white/30 line-through">${product.originalPrice.toFixed(2)}</span>
              )}
              {discountPct > 0 && (
                <span className="bg-accent/20 text-accent text-xs font-bold px-2.5 py-1 rounded-full">Save {discountPct}%</span>
              )}
            </div>

            {/* Stock */}
            <div className={`inline-flex items-center text-sm font-semibold px-4 py-2 rounded-full w-fit ${
              product.stock === 0  ? 'bg-secondary/15 text-secondary' :
              product.stock <= 10 ? 'bg-accent2/15 text-accent2' :
                                    'bg-accent/15 text-accent'
            }`}>
              {product.stock === 0 ? '❌ Out of Stock' : product.stock <= 10 ? `⚡ Only ${product.stock} left!` : '✓ In Stock'}
            </div>

            {/* Qty */}
            {product.stock > 0 && (
              <div>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">Quantity</label>
                <div className="flex items-center border border-white/[0.08] rounded-xl overflow-hidden w-fit">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={quantity <= 1} className="bg-bg-elevated text-white px-4 py-2.5 hover:bg-white/[0.1] disabled:opacity-40 transition-colors">
                    <FiMinus size={14} />
                  </button>
                  <span className="px-5 text-sm font-bold border-x border-white/[0.08] text-white py-2.5">{quantity}</span>
                  <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock} className="bg-bg-elevated text-white px-4 py-2.5 hover:bg-white/[0.1] disabled:opacity-40 transition-colors">
                    <FiPlus size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex gap-3">
              <button
                id="add-to-cart-detail-btn"
                onClick={() => addToCart(product, quantity)}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-primary text-white font-bold py-3.5 rounded-xl shadow-purple hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
              >
                <FiShoppingCart size={18} />
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <Link
                to="/checkout"
                id="buy-now-btn"
                onClick={() => product.stock > 0 && addToCart(product, quantity)}
                className="flex items-center justify-center bg-white/[0.06] border border-white/[0.08] text-white font-semibold px-6 py-3.5 rounded-xl hover:bg-white/[0.1] hover:-translate-y-0.5 transition-all"
              >
                Buy Now
              </Link>
            </div>

            {/* Highlights */}
            <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-4 space-y-2.5">
              {[
                { icon: FiTruck,        text: 'Free shipping on orders over $100' },
                { icon: FiShield,       text: '30-day return policy' },
                { icon: FiCheckCircle, text: 'Authentic & genuine product' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2.5 text-sm text-white/50">
                  <Icon size={15} className="text-primary-light" /> {text}
                </div>
              ))}
            </div>

            {/* Tags */}
            {product.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span key={tag} className="bg-primary/15 text-primary-light text-xs font-semibold px-3 py-1 rounded-full border border-primary/20">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div>
          <div className="flex gap-1 border-b border-white/[0.08] mb-8">
            {[
              { key: 'description', label: 'Description' },
              { key: 'reviews',     label: `Reviews (${product.numReviews})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                id={`tab-${key}`}
                onClick={() => setActiveTab(key)}
                className={`px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-all ${
                  activeTab === key
                    ? 'text-primary-light border-primary'
                    : 'text-white/40 border-transparent hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div className="animate-fade-in">
              <p className="text-white/60 leading-relaxed text-base">{product.description}</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="animate-fade-in">
              {product.reviews?.length > 0 ? (
                <div className="space-y-4 mb-10">
                  {product.reviews.map((r) => (
                    <div key={r._id} className="bg-bg-card border border-white/[0.08] rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 bg-gradient-primary rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0">
                          {r.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-white">{r.name}</div>
                          <div className="flex gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <FiStar key={i} size={11} className={i < r.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'} />
                            ))}
                          </div>
                        </div>
                        <span className="ml-auto text-xs text-white/30">{new Date(r.createdAt).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-white/50 leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-sm mb-8">No reviews yet. Be the first!</p>
              )}

              {user ? (
                <form onSubmit={handleSubmitReview} className="bg-bg-card border border-white/[0.08] rounded-2xl p-6 space-y-4">
                  <h3 className="font-semibold text-white">Write a Review</h3>
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                          className={`text-2xl transition-all hover:scale-110 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-white/20'}`}
                        >
                          <FiStar className={star <= reviewForm.rating ? 'fill-yellow-400' : ''} size={24} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2">Your Review</label>
                    <textarea
                      id="review-comment"
                      rows={4}
                      className={inputCls}
                      placeholder="Share your experience..."
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                      required
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <button
                    id="submit-review-btn"
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-primary text-white text-sm font-semibold rounded-xl shadow-purple hover:-translate-y-0.5 disabled:opacity-50 transition-all"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              ) : (
                <div className="bg-bg-elevated border border-white/[0.08] rounded-xl p-6 text-center text-sm text-white/50">
                  Please <Link to="/login" className="text-primary-light hover:underline">sign in</Link> to leave a review.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
