import React, { useState } from 'react';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.js';
import { useToast } from '../components/ui/Toast.js';

interface AuthPageProps {
  onSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Forgot password form
  const [forgotEmail, setForgotEmail] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [forgotStep, setForgotStep] = useState<'request' | 'reset'>('request');

  const { login, register, loginWithGoogle } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (mode === 'login') {
      const ok = await login(email, password);
      if (ok) onSuccess();
    } else {
      if (!name || name.trim().length < 2) {
        showToast('Please enter your full name', 'error');
        setIsSubmitting(false);
        return;
      }
      const ok = await register(name, email, password, phone);
      if (ok) onSuccess();
    }

    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const ok = await loginWithGoogle('sahil@example.com', 'Sahil Gangad');
    setIsSubmitting(false);
    if (ok) onSuccess();
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      showToast(data.message, 'info');
      setForgotStep('reset');
    } catch {
      showToast('Error requesting password reset', 'error');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error');
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message, 'success');
        setShowForgotModal(false);
        setForgotStep('request');
        setEmail(forgotEmail);
        setPassword(newPassword);
      } else {
        showToast(data.error || 'Failed to reset password', 'error');
      }
    } catch {
      showToast('Error connecting to reset service', 'error');
    }
  };

  // Quick Demo credentials autofill
  const autofillDemo = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@ayaannx.com');
      setPassword('password123');
      setMode('login');
      showToast('Autofilled Admin credentials', 'info');
    } else {
      setEmail('sahil@example.com');
      setPassword('password123');
      setMode('login');
      showToast('Autofilled Customer credentials', 'info');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full transition-colors">
      <div className="text-center mb-8">
        <span className="font-bebas text-4xl tracking-widest text-neutral-900 dark:text-neutral-100 block">
          AYAAN NX
        </span>
        <span className="text-[11px] font-mono tracking-widest uppercase text-amber-500 font-semibold">
          Client Identity Vault
        </span>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 border border-neutral-300 dark:border-neutral-800 p-1 mb-8 bg-neutral-100 dark:bg-neutral-900">
        <button
          onClick={() => setMode('login')}
          className={`py-2 text-xs font-mono uppercase font-semibold transition-colors ${
            mode === 'login'
              ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-amber-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          onClick={() => setMode('register')}
          className={`py-2 text-xs font-mono uppercase font-semibold transition-colors ${
            mode === 'register'
              ? 'bg-white dark:bg-neutral-800 text-neutral-950 dark:text-amber-400 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Google Express Button */}
      <button
        onClick={handleGoogleLogin}
        disabled={isSubmitting}
        className="w-full py-3 px-4 border border-neutral-300 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 text-neutral-800 dark:text-neutral-200 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-colors mb-6 shadow-xs"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Continue with Google</span>
      </button>

      <div className="relative flex items-center justify-center mb-6">
        <div className="border-t border-neutral-300 dark:border-neutral-800 w-full" />
        <span className="bg-neutral-50 dark:bg-neutral-950 px-3 text-[10px] font-mono uppercase text-neutral-400 absolute">
          Or with Email
        </span>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'register' && (
          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sahil Gangad"
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 pl-10 focus:outline-none focus:border-amber-400"
              />
              <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
            </div>
          </div>
        )}

        <div>
          <label className="block text-[11px] font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sahil@example.com"
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 pl-10 focus:outline-none focus:border-amber-400"
            />
            <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
          </div>
        </div>

        {mode === 'register' && (
          <div>
            <label className="block text-[11px] font-mono uppercase text-neutral-600 dark:text-neutral-400 mb-1">
              Phone Number (Optional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 987-6543"
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 pl-10 focus:outline-none focus:border-amber-400"
              />
              <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-[11px] font-mono uppercase text-neutral-600 dark:text-neutral-400">
              Password *
            </label>
            {mode === 'login' && (
              <button
                type="button"
                onClick={() => {
                  setForgotEmail(email);
                  setShowForgotModal(true);
                }}
                className="text-[11px] font-mono text-amber-500 hover:underline uppercase"
              >
                Forgot Password?
              </button>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 p-3 text-xs text-neutral-900 dark:text-neutral-100 pl-10 focus:outline-none focus:border-amber-400"
            />
            <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-neutral-900 text-white dark:bg-amber-400 dark:text-neutral-950 font-bold text-xs uppercase tracking-widest hover:bg-amber-300 transition-colors flex items-center justify-center gap-2 mt-2 shadow-lg disabled:opacity-50"
        >
          {isSubmitting ? (
            'Verifying...'
          ) : mode === 'login' ? (
            <>
              Sign In to Atelier
              <ArrowRight className="w-4 h-4" />
            </>
          ) : (
            <>
              Create Client Account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Credentials Helpers */}
      <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800">
        <span className="text-[11px] font-mono uppercase text-neutral-400 block mb-3 text-center">
          1-Click Demo Accounts
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => autofillDemo('admin')}
            className="p-2.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-800 dark:text-neutral-200 text-left transition-colors"
          >
            <div className="text-amber-500 font-bold uppercase">Admin Vault</div>
            <div className="text-[10px] text-neutral-400 truncate">admin@ayaannx.com</div>
          </button>
          <button
            type="button"
            onClick={() => autofillDemo('customer')}
            className="p-2.5 bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-[11px] font-mono text-neutral-800 dark:text-neutral-200 text-left transition-colors"
          >
            <div className="text-neutral-900 dark:text-white font-bold uppercase">Client Account</div>
            <div className="text-[10px] text-neutral-400 truncate">sahil@example.com</div>
          </button>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-900 border border-neutral-800 p-6 text-neutral-100 shadow-2xl">
            <div className="flex items-center gap-2 mb-3 text-amber-400">
              <KeyRound className="w-5 h-5" />
              <h3 className="font-bebas text-xl uppercase tracking-wider text-white">
                Reset Account Password
              </h3>
            </div>

            {forgotStep === 'request' ? (
              <form onSubmit={handleForgotSubmit} className="space-y-4 text-xs font-mono">
                <p className="text-neutral-400 text-[11px] leading-relaxed">
                  Enter your registered email address and we will provide password reset instructions.
                </p>
                <div>
                  <label className="block text-neutral-400 text-[10px] uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 text-neutral-400 hover:text-white text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 text-neutral-950 font-bold uppercase hover:bg-amber-300"
                  >
                    Send Instructions
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetSubmit} className="space-y-4 text-xs font-mono">
                <p className="text-amber-400 text-[11px]">
                  Simulated reset code: <strong>RESET-9921</strong>. Enter your new password below.
                </p>
                <div>
                  <label className="block text-neutral-400 text-[10px] uppercase mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-neutral-950 border border-neutral-800 p-2.5 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-2 text-neutral-400 hover:text-white text-xs uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 text-neutral-950 font-bold uppercase hover:bg-amber-300"
                  >
                    Set New Password
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
