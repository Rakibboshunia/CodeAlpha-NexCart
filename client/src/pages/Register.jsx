import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const inputCls = 'bg-bg-elevated border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder-white/30 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all w-full';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const ch = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const strength = (() => {
    const p = formData.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 6) s++;
    if (p.length >= 10) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-secondary', 'bg-accent2', 'bg-accent2', 'bg-accent', 'bg-accent'][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) return toast.error('Please fill all fields');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    setLoading(true);
    const result = await register(formData.name, formData.email, formData.password);
    setLoading(false);
    if (result.success) { toast.success('Account created! 🎉'); navigate('/'); }
    else toast.error(result.message);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute -top-40 -right-20 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(108,99,255,0.2),transparent_70%)] rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -left-20 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,101,132,0.15),transparent_70%)] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-bg-card border border-white/[0.08] rounded-3xl p-8 shadow-card animate-scale-in relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center font-display font-black text-xl text-white shadow-purple">N</div>
            <span className="font-display font-bold text-xl text-white">Nex<span className="text-gradient">Cart</span></span>
          </Link>
          <h1 className="font-display font-bold text-2xl text-white">Create Account</h1>
          <p className="text-white/40 text-sm mt-2">Join NexCart and start shopping premium products</p>
        </div>

        <form id="register-form" onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="register-name">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input id="register-name" type="text" name="name" className={inputCls} placeholder="John Doe" value={formData.name} onChange={ch} required autoComplete="name" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="register-email">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input id="register-email" type="email" name="email" className={inputCls} placeholder="you@example.com" value={formData.email} onChange={ch} required autoComplete="email" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="register-password">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input id="register-password" type={showPwd ? 'text' : 'password'} name="password" className={`${inputCls} pr-11`} placeholder="Min. 6 characters" value={formData.password} onChange={ch} required autoComplete="new-password" />
              <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                {showPwd ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {formData.password && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex gap-1 flex-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < strength ? strengthColor : 'bg-white/10'}`} />
                  ))}
                </div>
                <span className="text-xs text-white/40">{strengthLabel}</span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-1.5" htmlFor="register-confirm-password">Confirm Password</label>
            <div className="relative">
              <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input id="register-confirm-password" type={showPwd ? 'text' : 'password'} name="confirmPassword" className={`${inputCls} pr-11`} placeholder="Repeat your password" value={formData.confirmPassword} onChange={ch} required autoComplete="new-password" />
            </div>
            {formData.confirmPassword && formData.password !== formData.confirmPassword && (
              <p className="text-secondary text-xs mt-1.5">Passwords don't match</p>
            )}
          </div>

          <button
            id="register-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-primary text-white font-bold py-3.5 rounded-xl shadow-purple hover:shadow-glow hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none transition-all mt-2"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
            ) : (
              <>Create Account <FiArrowRight /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-white/40 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-light font-medium hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
