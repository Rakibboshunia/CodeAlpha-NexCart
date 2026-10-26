import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { FiShoppingCart, FiSearch, FiMenu, FiX, FiLogOut, FiPackage, FiSettings, FiUser } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();
  const { cartCount, setIsCartOpen } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 ${
      scrolled ? 'bg-bg-primary/85 backdrop-blur-xl border-b border-white/[0.08] shadow-card py-2' : ''
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center gap-6">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center font-display font-black text-lg text-white shadow-purple">
              N
            </div>
            <span className="font-display font-bold text-xl text-white">
              Nex<span className="text-gradient">Cart</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {[
              { to: '/', label: 'Home', end: true },
              { to: '/products', label: 'Products' },
              { to: '/products?category=Electronics', label: 'Electronics' },
              { to: '/products?category=Clothing', label: 'Fashion' },
            ].map(({ to, label, end }) => (
              <NavLink
                key={label}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? 'text-white bg-white/[0.08]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Search */}
          <form
            className="hidden md:flex flex-1 max-w-xs items-center gap-2 bg-bg-elevated border border-white/[0.08] rounded-full px-4 py-2 focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(108,99,255,0.15)] transition-all duration-200"
            onSubmit={handleSearch}
          >
            <FiSearch className="text-white/40 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none text-white text-sm w-full placeholder-white/30 focus:outline-none"
              id="header-search"
            />
          </form>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-auto lg:ml-0">
            {/* Cart */}
            <button
              id="cart-toggle-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative bg-white/[0.06] border border-white/[0.08] text-white p-2.5 rounded-xl hover:bg-white/[0.1] hover:border-primary/50 transition-all duration-150"
              aria-label="Open cart"
            >
              <FiShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-primary text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-bg-primary min-w-[18px] min-h-[18px]">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User */}
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-menu-btn"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 bg-white/[0.06] border border-white/[0.08] pl-1.5 pr-3 py-1.5 rounded-full hover:border-primary/50 hover:bg-white/[0.1] transition-all duration-150"
                >
                  <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center font-bold text-xs text-white">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-white">
                    {user.name?.split(' ')[0]}
                  </span>
                </button>

                {isUserMenuOpen && (
                  <div className="absolute top-[calc(100%+8px)] right-0 bg-bg-card border border-white/[0.08] rounded-2xl p-2 min-w-[200px] shadow-card animate-scale-in z-50">
                    <div className="px-3 py-2">
                      <p className="font-semibold text-sm text-white">{user.name}</p>
                      <p className="text-xs text-white/40 mt-0.5">{user.email}</p>
                    </div>
                    <div className="h-px bg-white/[0.08] my-1" />
                    {[
                      { to: '/orders', icon: <FiPackage size={15} />, label: 'My Orders' },
                      { to: '/profile', icon: <FiSettings size={15} />, label: 'Profile' },
                    ].map(({ to, icon, label }) => (
                      <Link
                        key={label}
                        to={to}
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all duration-150 w-full"
                      >
                        {icon} {label}
                      </Link>
                    ))}
                    <div className="h-px bg-white/[0.08] my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-secondary hover:bg-secondary/10 transition-all duration-150 w-full"
                    >
                      <FiLogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" id="login-btn" className="px-4 py-2 text-sm font-semibold text-white/70 bg-white/[0.06] border border-white/[0.08] rounded-xl hover:bg-white/[0.1] hover:text-white transition-all duration-150">
                  Sign In
                </Link>
                <Link to="/register" id="register-btn" className="px-4 py-2 text-sm font-semibold text-white bg-gradient-primary rounded-xl shadow-purple hover:shadow-glow hover:-translate-y-0.5 transition-all duration-150">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Toggle */}
            <button
              className="lg:hidden bg-white/[0.06] border border-white/[0.08] text-white p-2 rounded-xl"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-bg-card border border-white/[0.08] rounded-2xl mt-2 p-4 flex flex-col gap-3 animate-fade-in">
            <form className="flex items-center gap-2 bg-bg-elevated border border-white/[0.08] rounded-full px-4 py-2" onSubmit={handleSearch}>
              <FiSearch className="text-white/40" />
              <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="bg-transparent border-none text-white text-sm w-full placeholder-white/30 focus:outline-none" />
            </form>
            <nav className="flex flex-col gap-1">
              {[
                { to: '/', label: 'Home' },
                { to: '/products', label: 'All Products' },
                { to: '/products?category=Electronics', label: 'Electronics' },
                { to: '/products?category=Clothing', label: 'Fashion' },
              ].map(({ to, label }) => (
                <NavLink key={label} to={to} onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all">{label}</NavLink>
              ))}
              {user ? (
                <>
                  <NavLink to="/orders" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.08]">My Orders</NavLink>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="px-3 py-2 rounded-lg text-sm text-secondary text-left hover:bg-secondary/10 transition-all">Sign Out</button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/[0.08]">Sign In</NavLink>
                  <NavLink to="/register" onClick={() => setIsMenuOpen(false)} className="px-3 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-primary text-center mt-1">Sign Up</NavLink>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
