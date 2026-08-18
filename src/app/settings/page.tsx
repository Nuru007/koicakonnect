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
    <div className="min-h-screen bg-[#FAFBFF] py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
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
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 bg-white shadow-sm space-y-4">
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
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 bg-white shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-500" />
                <span>Discovery Visibility & Status</span>
              </h3>

              {status === 'published' && isDiscoverable ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active on Discover
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                  Hidden from Discover
                </span>
              )}
            </div>

            {/* Discoverability Switch */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Include Profile in Discover Directory</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Allow other professionals to find you across skills, categories, and keyword searches.
                </p>
              </div>

              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDiscoverable}
                  onChange={(e) => setIsDiscoverable(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-500"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {[
                { id: 'published', title: 'Published & Public', desc: 'Live public profile URL & search' },
                { id: 'draft', title: 'Draft Mode', desc: 'Hidden from discovery' },
                { id: 'private', title: 'Private', desc: 'Visible only to you' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setStatus(opt.id as any)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    status === opt.id
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-brand-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-bold mb-0.5">{opt.title}</p>
                  <p className="text-[11px] text-slate-400 font-normal">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Language */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 bg-white shadow-sm space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-brand-500" />
              <span>Preferred Profile Language</span>
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {[
                { code: 'en', label: 'English', flag: '🇺🇸' },
                { code: 'fr', label: 'Français', flag: '🇫🇷' },
                { code: 'ko', label: '한국어', flag: '🇰🇷' },
              ].map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => {
                    setPreferredLang(l.code);
                    setLanguage(l.code as any);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    preferredLang === l.code
                      ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-brand-900 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-base block mb-1">{l.flag}</span>
                  <span className="text-xs">{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Change Password */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200/80 bg-white shadow-sm space-y-4">
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
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
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => logout()}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-8 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-brand-md disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>

        {/* Danger Zone: Account Deletion / Deactivation */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="rounded-3xl p-6 sm:p-8 bg-rose-50/60 border border-rose-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-display font-bold text-sm text-rose-900 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Delete Account</span>
              </h4>
              <p className="text-xs text-rose-700 mt-1 max-w-lg">
                Permanently delete your profile, skills, taxonomies, and digital identity pass. This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-all shadow-sm flex-shrink-0"
            >
              Delete Account
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-150">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <Trash2 className="w-6 h-6" />
              </div>

              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                Are you absolutely sure?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-6">
                This will permanently delete your KoicaKonnect profile and remove you from the global discovery index immediately.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  disabled={deleting}
                  className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete Account'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
