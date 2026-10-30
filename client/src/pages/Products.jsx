import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter, FiX } from 'react-icons/fi';
import ProductCard from '../components/product/ProductCard';
import { productsAPI } from '../services/api';

const CATEGORIES = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty', 'Toys', 'Food'];
const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'rating', label: 'Top Rated' },
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [totalProducts, setTotal] = useState(0);
  const [totalPages, setPages]    = useState(1);
  const [currentPage, setPage]    = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [search,   setSearch]   = useState(searchParams.get('search')   || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort,     setSort]     = useState(searchParams.get('sort')     || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  useEffect(() => { fetchProducts(); }, [searchParams, currentPage]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await productsAPI.getAll({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        sort: searchParams.get('sort') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        page: currentPage, limit: 12,
      });
      setProducts(data.data || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch {}
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    const params = {};
    if (search)   params.search   = search;
    if (category) params.category = category;
    if (sort)     params.sort     = sort;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    setSearchParams(params);
    setPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearch(''); setCategory(''); setSort(''); setMinPrice(''); setMaxPrice('');
    setSearchParams({});
    setPage(1);
  };

  const hasFilters = search || category || sort || minPrice || maxPrice;

  const inputCls = 'bg-bg-elevated border border-white/[0.08] rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all w-full';

  return (
    <div className="min-h-screen bg-bg-primary pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">
              {category ? category : search ? `"${search}"` : 'All Products'}
            </h1>
            <p className="text-white/40 mt-1 text-sm">{totalProducts} products found</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="toggle-filters-btn"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                showFilters
                  ? 'bg-primary/15 border-primary/40 text-primary-light'
                  : 'bg-white/[0.06] border-white/[0.08] text-white/70 hover:bg-white/[0.1] hover:text-white'
              }`}
            >
              <FiFilter size={15} /> Filters
              {hasFilters && <span className="w-2 h-2 bg-primary rounded-full" />}
            </button>
            <select
              id="sort-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className={`${inputCls} min-w-[170px] cursor-pointer`}
            >
              {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-bg-card border border-white/[0.08] rounded-2xl p-6 mb-6 animate-fade-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={15} />
                <input id="filter-search" type="text" className={`${inputCls} pl-9`} placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && applyFilters()} />
              </div>
              {/* Category */}
              <select id="filter-category" className={`${inputCls} cursor-pointer`} value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {/* Min Price */}
              <input id="filter-min-price" type="number" className={inputCls} placeholder="Min Price ($)" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              {/* Max Price */}
              <input id="filter-max-price" type="number" className={inputCls} placeholder="Max Price ($)" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <button onClick={applyFilters} className="px-6 py-2.5 bg-gradient-primary text-white text-sm font-semibold rounded-xl shadow-purple hover:-translate-y-0.5 transition-all">
                Apply Filters
              </button>
              {hasFilters && (
                <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-2.5 bg-white/[0.06] border border-white/[0.08] text-white/60 text-sm rounded-xl hover:bg-white/[0.1] hover:text-white transition-all">
                  <FiX size={14} /> Clear All
                </button>
              )}
            </div>
          </div>
        )}

        {/* Active Filters */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {[
              category && { label: category, clear: () => { setCategory(''); applyFilters(); } },
              search && { label: `"${search}"`, clear: () => { setSearch(''); applyFilters(); } },
              (minPrice || maxPrice) && { label: `$${minPrice || 0} - $${maxPrice || '∞'}`, clear: () => { setMinPrice(''); setMaxPrice(''); applyFilters(); } },
            ].filter(Boolean).map((f, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 bg-primary/15 text-primary-light text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20">
                {f.label}
                <button onClick={f.clear} className="opacity-70 hover:opacity-100"><FiX size={11} /></button>
              </span>
            ))}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="bg-bg-card border border-white/[0.08] rounded-2xl p-4">
                <div className="skeleton aspect-square mb-3 rounded-xl" />
                <div className="skeleton h-3.5 mb-2 w-4/5 rounded-lg" />
                <div className="skeleton h-3 mb-2 w-3/5 rounded-lg" />
                <div className="skeleton h-5 w-2/5 rounded-lg" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((product) => <ProductCard key={product._id} product={product} />)}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <span className="text-6xl opacity-30">🔍</span>
            <h3 className="text-lg font-semibold text-white">No products found</h3>
            <p className="text-white/40 text-sm">Try adjusting your search or filters</p>
            <button onClick={clearFilters} className="px-6 py-2.5 bg-white/[0.06] border border-white/[0.08] text-white text-sm font-semibold rounded-xl hover:bg-white/[0.1] transition-all">
              Clear Filters
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-12">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={currentPage === 1}
              className="px-5 py-2.5 bg-white/[0.06] border border-white/[0.08] text-white text-sm font-semibold rounded-xl hover:bg-white/[0.1] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${
                    currentPage === i + 1
                      ? 'bg-primary text-white shadow-purple'
                      : 'bg-bg-elevated border border-white/[0.08] text-white/60 hover:bg-white/[0.1] hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={currentPage === totalPages}
              className="px-5 py-2.5 bg-white/[0.06] border border-white/[0.08] text-white text-sm font-semibold rounded-xl hover:bg-white/[0.1] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
