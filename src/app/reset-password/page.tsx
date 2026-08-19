'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Network, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetPassword } = useAuth();
  const { t } = useLanguage();

  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!token) {
      setError('Invalid or missing password reset token.');
      return;
    }

    if (password.length < 8) {
      setError(t.auth.passwordRequirements);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    const res = await resetPassword(token, password, confirmPassword);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || t.common.saveFailed);
    }
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-500" />
          <span>Invalid or missing reset token.</span>
        </div>
        <Link href="/forgot-password" className="btn-primary py-2.5 px-4 rounded-xl text-xs font-bold inline-block shadow-brand-sm">
          {t.auth.forgotPasswordTitle}
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="space-y-6 text-center animate-in fade-in duration-300">
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-start gap-3 text-left">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600 mt-0.5" />
          <div>
            <p className="font-bold">{t.auth.passwordResetSuccess}</p>
          </div>
        </div>

        <Link
          href="/signin"
          className="w-full btn-primary py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-brand-sm"
        >
          <span>{t.auth.signInBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          {t.auth.passwordLabel}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Min. 8 characters"
            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
          {t.auth.resetPasswordTitle}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-brand-sm mt-6 disabled:opacity-50 transition-all"
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <span>{t.common.save}</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#F8FAFC]">
      <div className="max-w-md w-full surface-card rounded-3xl p-8 sm:p-10 border border-slate-200 bg-white shadow-xs relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-2xl bg-brand-500 flex items-center justify-center text-white shadow-brand-sm">
              <Network className="w-5 h-5 stroke-[2.2]" />
            </div>
            <span className="font-display font-extrabold text-2xl text-slate-900">
              KOICA CONNECT
            </span>
          </Link>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
            {t.auth.resetPasswordTitle}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t.auth.resetPasswordSubtitle}
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-8 text-xs text-slate-400">{t.common.loading}</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </div>
  );
}
