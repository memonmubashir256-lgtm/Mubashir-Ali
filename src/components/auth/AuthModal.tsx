import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, ShieldCheck, Lock, UserCheck, ArrowRight } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authModalMode,
    setAuthModalMode,
    login,
    register,
  } = useAuth();
  const { addToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  if (!showAuthModal) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        const res = await login(email, password);
        if (res.success) {
          addToast('success', 'Authenticated', `Welcome back to VYRO.`);
          setShowAuthModal(false);
        }
      } else {
        const res = await register({ email, firstName, lastName, phone });
        if (res.success) {
          addToast('success', 'Account Enrolled', 'Your profile and age verification status have been registered.');
          setShowAuthModal(false);
        }
      }
    } catch {
      addToast('error', 'Authentication Failed', 'Please verify your credentials and retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role: 'admin' | 'customer') => {
    setLoading(true);
    const targetEmail = role === 'admin' ? 'admin@vyro.luxury' : 'alex.vance@example.com';
    await login(targetEmail, 'demopassword');
    addToast(
      'success',
      'Quick Access Granted',
      `Signed in with ${role === 'admin' ? 'Admin Operator' : 'Verified Customer'} privileges.`
    );
    setLoading(false);
    setShowAuthModal(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md bg-[#08090B] border border-[#262A33] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[#262A33] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#C5CBD3]" />
            <h2 className="text-base font-bold text-[#F5F5F3]">
              {authModalMode === 'login' ? 'Access Account' : 'Enroll New Account'}
            </h2>
          </div>
          <button
            onClick={() => setShowAuthModal(false)}
            aria-label="Close modal"
            className="p-1.5 text-[#9298A2] hover:text-[#F5F5F3] rounded-lg hover:bg-[#1A1D23] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 border-b border-[#262A33] text-xs font-medium">
          <button
            onClick={() => setAuthModalMode('login')}
            className={`py-3 text-center transition-colors ${
              authModalMode === 'login'
                ? 'text-[#F5F5F3] border-b-2 border-[#C5CBD3] bg-[#121419]'
                : 'text-[#9298A2] hover:text-[#F5F5F3]'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setAuthModalMode('register')}
            className={`py-3 text-center transition-colors ${
              authModalMode === 'register'
                ? 'text-[#F5F5F3] border-b-2 border-[#C5CBD3] bg-[#121419]'
                : 'text-[#9298A2] hover:text-[#F5F5F3]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {authModalMode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono text-[#9298A2] uppercase mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-mono text-[#9298A2] uppercase mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-mono text-[#9298A2] uppercase mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@domain.com"
              className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-[#9298A2] uppercase mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
              required
            />
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-[11px] font-mono text-[#9298A2] uppercase mb-1">
                Phone Number (Age Check SMS)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="w-full bg-[#121419] border border-[#262A33] rounded px-3 py-2 text-xs text-[#F5F5F3] focus:border-[#C5CBD3] focus:outline-none"
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#F5F5F3] hover:bg-[#C5CBD3] text-[#08090B] font-semibold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98] mt-2"
          >
            <span>{authModalMode === 'login' ? 'Authenticate' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-[#1A1D23] space-y-2">
            <p className="text-[10px] font-mono uppercase tracking-wider text-[#9298A2] text-center">
              Quick Test Environments
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="p-2 bg-[#121419] hover:bg-[#1A1D23] border border-[#262A33] rounded text-[11px] text-[#C5CBD3] flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Console</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                className="p-2 bg-[#121419] hover:bg-[#1A1D23] border border-[#262A33] rounded text-[11px] text-[#C5CBD3] flex items-center justify-center gap-1.5 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5 text-[#C5CBD3]" />
                <span>Verified Customer</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
