import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const inputCls = 'bg-bg-elevated border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all w-full';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return toast.error('Please fill all fields');
    setLoading(true);
    const result = await login(formData.email, formData.password);
    setLoading(false);
    if (result.success) { toast.success('Welcome back! 🎉'); navigate('/'); }
    else toast.error(result.message);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 relative overflow-hidden">
      {/* Orbs */}
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(108,99,255,0.2),transparent_70%)] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,101,132,0.15),transparent_70%)] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-bg-card border border-white/[0.08] rounded-3xl p-8 shadow-card animate-scale-in relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center font-display font-black text-xl text-white shadow-purple">N</div>
            <span className="font-display font-bold text-xl text-white">Nex<span className="text-gradient">Cart</span></span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Welcome Back</h1>
          <p className="text-white/40 text-sm mt-2">Sign in to your account to continue shopping</p>
        </div>

        <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="login-email">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input id="login-email" type="email" name="email" className={inputCls} placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required autoComplete="email" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="login-password">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input id="login-password" type={showPwd ? 'text' : 'password'} name="password" className={`${inputCls} pr-11`} placeholder="Enter your password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required autoComplete="current-password" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
          </div>

          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white font-bold py-3.5 rounded-xl shadow-purple hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all mt-2"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing In...</>
            ) : (
              <>Sign In <FiArrowRight /></>
            )}
          </button>
        </form>

        {/* Demo */}
        <div className="mt-5 bg-primary/[0.08] border border-primary/20 rounded-xl p-3 text-xs text-white/50">
          <p className="mb-1 font-medium">Demo credentials:</p>
          <code className="text-primary-light block">admin@nexcart.com / admin123</code>
          <code className="text-primary-light block">john@nexcart.com / test123</code>
        </div>

        <p className="text-center text-sm text-white/40 mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-light font-medium hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
