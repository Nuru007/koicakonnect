'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Sparkles, Mail, Lock, User, Briefcase, MapPin, ArrowRight, Eye, EyeOff, AlertCircle, CheckCircle2, ChevronDown } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';

export default function SignUpPage() {
  const { register } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    organisation: '',
    country: '',
    city: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = formData.email.trim() === '' || emailRegex.test(formData.email.trim());
  const isPasswordLongEnough = formData.password.length >= 8;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) {
      setError(null);
      setErrorCode(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setErrorCode(null);

    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);
    const res = await register(formData);

    if (res.success) {
      setSuccessMsg('Your account has been created. Directing you to the Profile Builder...');
      setTimeout(() => {
        router.push('/profile/edit');
      }, 1200);
    } else {
      setLoading(false);
      setError(res.error || 'Unable to create account. Please try again.');
      setErrorCode(res.code || null);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-[#FAFBFF]">
      
      {/* Background ambient lighting */}
      <div className="hero-glow-bg opacity-75 pointer-events-none" />

      <div className="max-w-xl w-full glass-card rounded-3xl p-8 sm:p-10 border border-slate-200/80 bg-white/95 shadow-xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center text-white shadow-brand-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-display font-extrabold text-2xl text-slate-900">
              KoicaKonnect
            </span>
          </Link>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
            Create Your Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-sm mx-auto">
            Join the discovery network and create your digital professional identity card.
          </p>
        </div>

        {/* Success Banner */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-3 animate-in fade-in duration-300">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-600" />
            <div>
              <p className="font-bold">{successMsg}</p>
              <p className="text-[11px] text-emerald-600 font-normal mt-0.5">Complete your profile to appear on Discover.</p>
            </div>
          </div>
        )}

        {/* Duplicate Email Error Banner */}
        {errorCode === 'EMAIL_ALREADY_EXISTS' && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
              <div>
                <p className="font-bold">An account already exists with this email.</p>
                <p className="text-[11px] text-amber-700">Would you like to sign in instead?</p>
              </div>
            </div>
            <Link
              href="/signin"
              className="btn-primary py-1.5 px-3.5 rounded-xl text-xs font-bold whitespace-nowrap text-center"
            >
              Sign In Instead
            </Link>
          </div>
        )}

        {/* General Error Banner */}
        {error && errorCode !== 'EMAIL_ALREADY_EXISTS' && (
          <div className="mb-6 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Dr. Alex Morgan"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
              />
            </div>
          </div>

          {/* Email & Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:ring-4 transition-all ${
                    !isEmailValid
                      ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/10'
                      : 'border-slate-200 focus:border-brand-500 focus:ring-brand-500/10'
                  }`}
                />
              </div>
              {!isEmailValid ? (
                <p className="text-[11px] text-rose-500 mt-1 font-medium">Please enter a valid email.</p>
              ) : (
                <p className="text-[10px] text-slate-400 mt-1">Stored securely in your verified Supabase account.</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex justify-between">
                <span>Password *</span>
                <span className={`text-[10px] font-normal lowercase ${formData.password.length >= 8 ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>
                  (min 8 chars)
                </span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 8 characters"
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
          </div>

          {/* Role & Organisation Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Current Role / Profession *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. AI Research Scientist"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Organisation
              </label>
              <input
                type="text"
                name="organisation"
                value={formData.organisation}
                onChange={handleChange}
                placeholder="e.g. DeepMind / Stanford"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
              />
            </div>
          </div>

          {/* Country & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Country *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <select
                  required
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full pl-10 pr-9 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select country...</option>
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                City / Location
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. London"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || Boolean(successMsg)}
            className="w-full btn-primary py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-brand-md mt-4 disabled:opacity-50 transition-all"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : successMsg ? (
              <span>Redirecting to Profile Builder...</span>
            ) : (
              <>
                <span>Continue to Profile Builder</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/signin" className="text-brand-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
