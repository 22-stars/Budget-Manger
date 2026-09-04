import React, { useState } from 'react';
import { Eye, EyeOff, Loader2, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const { signIn, signUp, loading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes('already exists')) {
            setError('Account already exists. Please sign in instead.');
            setIsSignUp(false);
          } else {
            setError(error.message);
          }
        } else {
          // Supabase auto-confirms when email confirmation is disabled
          onLoginSuccess();
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          setError('Invalid email or password.');
        } else {
          onLoginSuccess();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <Loader2 size={40} className="animate-spin text-stone-600 dark:text-stone-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-950 dark:to-stone-900 px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-stone-900 dark:bg-stone-100 mb-4">
            <Wallet size={28} className="text-white dark:text-stone-900" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Budget Manager
          </h1>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            {isSignUp ? 'Create your account to get started' : 'Sign in to manage your budget'}
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-base focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-stone-700 dark:text-stone-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-stone-300 dark:border-stone-700 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 text-base focus:ring-2 focus:ring-stone-500 dark:focus:ring-stone-400 focus:border-transparent outline-none pr-12"
                  placeholder="••••••••"
                  minLength={6}
                  required
                  autoComplete={isSignUp ? 'new-password' : 'current-password'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 p-1"
                  style={{ minWidth: '44px', minHeight: '44px' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-xl">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-xl font-semibold text-base hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 active:scale-[0.98]"
              style={{ minHeight: '52px' }}
            >
              {submitting ? <Loader2 size={20} className="animate-spin" /> : null}
              {isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
            <span className="text-xs text-stone-400">or</span>
            <div className="flex-1 h-px bg-stone-200 dark:bg-stone-800" />
          </div>

          {/* Toggle */}
          <p className="text-center text-sm text-stone-600 dark:text-stone-400">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
              className="font-semibold text-stone-900 dark:text-stone-100 underline underline-offset-4"
            >
              {isSignUp ? 'Sign in' : 'Sign up'}
            </button>
          </p>
        </div>

        <p className="mt-6 text-center text-xs text-stone-400 dark:text-stone-600">
          Your data is synced securely to the cloud
        </p>
      </div>
    </div>
  );
};
