import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="relative bg-bg-secondary border-t border-white/[0.08] pt-16 pb-8 overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-[radial-gradient(ellipse_at_center,rgba(108,99,255,0.08)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center font-display font-black text-lg text-white">N</div>
              <span className="font-display font-bold text-xl text-white">Nex<span className="text-gradient">Cart</span></span>
            </Link>
            <p className="text-white/40 text-sm leading-7 max-w-xs mb-6">
              Your premium destination for electronics, fashion, and everything in between. Shop with confidence.
            </p>
            <div className="flex gap-2">
              {[FiGithub, FiTwitter, FiInstagram, FiLinkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-white/[0.06] border border-white/[0.08] rounded-xl flex items-center justify-center text-white/40 hover:bg-primary hover:border-primary hover:text-white hover:-translate-y-1 hover:shadow-purple transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Shop</h4>
            <ul className="space-y-2">
              {[
                { to: '/products', label: 'All Products' },
                { to: '/products?category=Electronics', label: 'Electronics' },
                { to: '/products?category=Clothing', label: 'Fashion' },
                { to: '/products?category=Home & Garden', label: 'Home & Garden' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/40 hover:text-primary-light hover:pl-1 transition-all duration-150">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Account</h4>
            <ul className="space-y-2">
              {[
                { to: '/register', label: 'Create Account' },
                { to: '/login', label: 'Sign In' },
                { to: '/orders', label: 'My Orders' },
                { to: '/cart', label: 'Shopping Cart' },
              ].map(({ to, label }) => (
                <li key={label}>
                  <Link to={to} className="text-sm text-white/40 hover:text-primary-light hover:pl-1 transition-all duration-150">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              {[
                { icon: FiMail, text: 'support@nexcart.com' },
                { icon: FiPhone, text: '+1 (800) 123-4567' },
                { icon: FiMapPin, text: '123 Commerce St, NY 10001' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-2 text-sm text-white/40">
                  <Icon size={14} className="text-primary-light flex-shrink-0" />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.08] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} NexCart. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" className="hover:text-primary-light transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
