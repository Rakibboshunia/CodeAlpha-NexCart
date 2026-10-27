
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShoppingBag, FiStar, FiTruck, FiShield, FiRefreshCw } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';
import { productsAPI } from '../services/api';

const categories = [
  { name: 'Electronics', icon: '💻', color: '#6C63FF' },
  { name: 'Clothing',    icon: '👗', color: '#FF6584' },
  { name: 'Books',       icon: '📚', color: '#43e97b' },
  { name: 'Home & Garden', icon: '🏡', color: '#f7971e' },
  { name: 'Sports',      icon: '⚽', color: '#38f9d7' },
  { name: 'Beauty',      icon: '💄', color: '#FF6584' },
  { name: 'Toys',        icon: '🎮', color: '#6C63FF' },
  { name: 'Food',        icon: '🍔', color: '#f7971e' },
];

const features = [
  { icon: <FiTruck size={20} />,    title: 'Free Shipping',  desc: 'On orders over $100' },
  { icon: <FiShield size={20} />,   title: 'Secure Payment', desc: '100% secure transactions' },
  { icon: <FiRefreshCw size={20} />, title: 'Easy Returns',  desc: '30-day return policy' },
  { icon: <FiStar size={20} />,     title: 'Top Quality',    desc: 'Curated premium products' },
];

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsAPI.getFeatured()
      .then(({ data }) => setFeaturedProducts(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-bg-primary">

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden">
        {/* Animated orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-20 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(108,99,255,0.15),transparent_70%)] rounded-full animate-float" />
          <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,101,132,0.12),transparent_70%)] rounded-full animate-float [animation-delay:3s]" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-[radial-gradient(circle,rgba(67,233,123,0.08),transparent_70%)] rounded-full animate-float [animation-delay:5s]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-2xl animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/15 border border-primary/30 text-primary-light px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
              <FiShoppingBag size={13} /> Premium E-Commerce Experience
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.1] mb-6 tracking-tight">
              Discover{' '}
              <span className="text-gradient">Premium</span>
              <br />Products You Love
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg">
              Shop thousands of curated products with the best deals, fast delivery, and hassle-free returns.
            </p>

            <div className="flex flex-wrap gap-4 mb-14">
              <Link
                to="/products"
                id="shop-now-btn"
                className="flex items-center gap-2 bg-gradient-primary text-white font-bold px-8 py-4 rounded-2xl shadow-purple hover:shadow-glow hover:-translate-y-1 transition-all duration-200 text-base"
              >
                Shop Now <FiArrowRight />
              </Link>
              <Link
                to="/products?featured=true"
                className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/[0.1] hover:-translate-y-1 transition-all duration-200 text-base"
              >
                Featured Items
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-8">
              {[
                { value: '10K+', label: 'Products' },
                { value: '50K+', label: 'Happy Customers' },
                { value: '4.9★', label: 'Average Rating' },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px h-10 bg-white/[0.1]" />}
                  <div>
                    <div className="font-display font-extrabold text-2xl text-gradient">{value}</div>
                    <div className="text-xs text-white/40 mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bar ── */}
      <div className="bg-bg-secondary border-y border-white/[0.08] py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map(({ icon, title, desc }) => (
              <div key={title} className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary/15 text-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="font-semibold text-sm text-white">{title}</div>
                  <div className="text-xs text-white/40 mt-0.5">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Categories ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="font-display font-bold text-4xl text-white">
              Shop by <span className="text-gradient">Category</span>
            </h2>
            <p className="text-white/50 mt-2">Browse our wide range of product categories</p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <Link
                key={cat.name}
                to={`/products?category=${encodeURIComponent(cat.name)}`}
                id={`category-${cat.name.toLowerCase().replace(/ /g, '-')}`}
                className="flex flex-col items-center gap-2 p-4 bg-bg-card border border-white/[0.08] rounded-2xl hover:border-primary/50 hover:-translate-y-1 hover:shadow-glow transition-all duration-200 text-center group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform"
                  style={{ background: `${cat.color}20`, color: cat.color }}
                >
                  {cat.icon}
                </div>
                <span className="text-[11px] font-semibold text-white/60">{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="font-display font-bold text-4xl text-white">
              Featured <span className="text-gradient">Products</span>
            </h2>
            <p className="text-white/50 mt-2">Handpicked bestsellers just for you</p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="spinner" />
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <span className="text-6xl opacity-30">🛍️</span>
              <h3 className="text-lg font-semibold text-white">No featured products yet</h3>
              <p className="text-white/40 text-sm">Run <code className="text-primary-light">npm run seed</code> in the server directory</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] text-white font-semibold px-8 py-3.5 rounded-2xl hover:bg-white/[0.1] hover:-translate-y-0.5 transition-all"
            >
              View All Products <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="relative py-24 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-secondary/8 border-y border-white/[0.08]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <h2 className="font-display font-bold text-4xl text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-white/50 mb-8">Join thousands of happy customers. Sign up today and get exclusive deals!</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/register"
              id="get-started-btn"
              className="flex items-center gap-2 bg-gradient-primary text-white font-bold px-8 py-4 rounded-2xl shadow-purple hover:shadow-glow hover:-translate-y-0.5 transition-all"
            >
              Get Started Free
            </Link>
            <Link
              to="/products"
              className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/[0.1] hover:-translate-y-0.5 transition-all"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
