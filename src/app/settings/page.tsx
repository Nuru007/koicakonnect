'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Settings,
  Shield,
  Lock,
  Globe,
  Trash2,
  Check,
  AlertCircle,
  ArrowLeft,
  Eye,
  LogOut,
} from 'lucide-react';

export default function SettingsPage() {
  const { user, refreshUser, logout, loading } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLang, setPreferredLang] = useState(user?.preferredLanguage || 'en');
  const [status, setStatus] = useState(user?.status || 'draft');
  const [isDiscoverable, setIsDiscoverable] = useState(user?.isDiscoverable !== false);

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/signin');
    return null;
  }

  const handleUpdatePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const payload: any = {
        preferredLanguage: preferredLang,
        status: status,
        isDiscoverable: isDiscoverable,
      };

      if (password) {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        payload.password = password;
      }

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccessMsg('Settings updated successfully');
        setPassword('');
        setConfirmPassword('');
        await refreshUser();
      } else {
        setErrorMsg(data.error || 'Failed to update settings');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete' }),
      });

      if (res.ok) {
        window.location.href = '/';
      } else {
        const data = await res.json();
        setErrorMsg(data.error || 'Failed to delete account');
        setShowDeleteModal(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to delete account');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your account security, preferred language, and discovery preferences
          </p>
        </div>

        {successMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleUpdatePreferences} className="space-y-6">
          
          {/* Account Profile Details */}
          <div className="surface-card rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-500" />
              <span>Identity & Account</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Username Slug
                </label>
                <input
                  type="text"
                  disabled
                  value={`@${user.username}`}
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Visibility & Discoverability Preference */}
          <div className="surface-card rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-500" />
                <span>Discovery Visibility & Status</span>
              </h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-brand-200 transition-colors cursor-pointer bg-slate-50/50">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Published (Public)</span>
                  <span className="text-[11px] text-slate-500 block leading-relaxed">
                    Your profile is live and discoverable in global directory search, categories, and country filters.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-brand-200 transition-colors cursor-pointer bg-slate-50/50">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Draft / Unlisted</span>
                  <span className="text-[11px] text-slate-500 block leading-relaxed">
                    Your profile is hidden from the public directory. Only accessible via your direct link.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3.5 rounded-2xl border border-slate-200 hover:border-brand-200 transition-colors cursor-pointer bg-slate-50/50">
                <input
                  type="radio"
                  name="status"
                  value="private"
                  checked={status === 'private'}
                  onChange={() => setStatus('private')}
                  className="mt-1 text-brand-600 focus:ring-brand-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Private</span>
                  <span className="text-[11px] text-slate-500 block leading-relaxed">
                    Your profile is completely private. No one can view your profile except you when logged in.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Preferred Language */}
          <div className="surface-card rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-500" />
              <span>Language Preference</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'en', label: 'English', flag: '🇺🇸' },
                { code: 'fr', label: 'Français', flag: '🇫🇷' },
                { code: 'ko', label: '한국어', flag: '🇰🇷' },
              ].map((l) => (
                <button
                  type="button"
                  key={l.code}
                  onClick={() => {
                    setPreferredLang(l.code);
                    setLanguage(l.code as any);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                    preferredLang === l.code
                      ? 'border-brand-500 bg-brand-50 text-brand-600 shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <span className="text-base">{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div className="surface-card rounded-3xl p-6 sm:p-8 border border-slate-200 bg-white shadow-xs space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-brand-500" />
              <span>Change Password</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-xl text-xs font-medium text-slate-900 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 rounded-xl text-xs font-medium text-slate-900 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary py-3 px-8 rounded-2xl text-xs font-bold shadow-brand-sm flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>

        {/* Danger Zone: Delete Account */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="surface-card rounded-3xl p-6 sm:p-8 border border-rose-200 bg-rose-50/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display font-bold text-base text-rose-700 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-500" />
                <span>Delete Account & Profile</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Permanently delete your profile, credentials, and all uploaded links. This action is irreversible.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-xs flex-shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900">
                Are you absolutely sure?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This will immediately delete your user account (<span className="font-mono text-slate-900 font-bold">{user.email}</span>) and purge your profile from the discovery index.
              </p>
              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Everything'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
