'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { QRCard } from '@/components/QRCard';
import { ProfileCard } from '@/components/ProfileCard';
import {
  Edit3,
  QrCode,
  Globe,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ExternalLink,
  Shield,
  Layers,
  ArrowRight,
  User,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, refreshUser, loading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [copied, setCopied] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  React.useEffect(() => {
    if (!loading && !user) {
      router.push('/signin?redirect=/dashboard');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const skills = user.skills || [];
  const interests = user.interests || [];
  const categories = user.categories || [];
  const links = user.links || [];

  // Calculate profile completeness
  const completenessItems = [
    { label: 'Basic Info & Role', isDone: Boolean(user.name && user.role) },
    { label: 'Headshot Photo', isDone: Boolean(user.profileImage) },
    { label: 'Professional Bio', isDone: Boolean(user.bio && user.bio.length > 20) },
    { label: 'At least 3 Skills', isDone: Boolean(skills.length >= 3) },
    { label: 'Areas of Interest', isDone: Boolean(interests.length >= 1) },
    { label: 'Industry Categories', isDone: Boolean(categories.length >= 1) },
    { label: 'LinkedIn Profile Link', isDone: Boolean(links.some(l => l.platform === 'linkedin')) },
  ];

  const completedCount = completenessItems.filter(i => i.isDone).length;
  const completenessPercentage = Math.round((completedCount / completenessItems.length) * 100);

  const missingItems = completenessItems.filter(i => !i.isDone);

  const handleStatusChange = async (newStatus: 'draft' | 'published' | 'private') => {
    setUpdatingStatus(true);
    try {
      await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      await refreshUser();
    } catch (err) {
      console.error('Failed to update profile status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://koicakonnect.com';
  const publicProfileUrl = `${origin}/profile/${user.username}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(publicProfileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Professional Dashboard
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500"></span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900">
              {t.dashboard.welcome}, {user.name.split(' ')[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your discovery visibility, digital identity, and external connections.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/profile/${user.username}`}
              className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{t.dashboard.viewPublicProfile}</span>
            </Link>
            <Link
              href="/profile/edit"
              className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-brand-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t.dashboard.editProfile}</span>
            </Link>
          </div>
        </div>

        {/* Status & Completeness Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Profile Visibility State */}
          <div className="surface-card rounded-3xl p-6 border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.dashboard.statusTitle}
                </span>
                {user.status === 'published' ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Live
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Draft
                  </span>
                )}
              </div>

              <h3 className="font-display font-bold text-xl text-slate-900 mb-1">
                {user.status === 'published'
                  ? t.dashboard.statusPublished
                  : user.status === 'private'
                  ? t.dashboard.statusPrivate
                  : t.dashboard.statusDraft}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {user.status === 'published'
                  ? 'Your profile is discoverable in search queries, industry categories, and skill filters.'
                  : 'Your profile is hidden from the Discover page. Only you can view it.'}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center gap-2 mt-4">
              {user.status !== 'published' ? (
                <button
                  onClick={() => handleStatusChange('published')}
                  disabled={updatingStatus}
                  className="w-full btn-primary py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-brand-sm"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{updatingStatus ? 'Updating...' : t.dashboard.publishNow}</span>
                </button>
              ) : (
                <button
                  onClick={() => handleStatusChange('draft')}
                  disabled={updatingStatus}
                  className="w-full btn-secondary py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  {t.dashboard.unpublish}
                </button>
              )}
            </div>
          </div>

          {/* Profile Completeness Score */}
          <div className="md:col-span-2 surface-card rounded-3xl p-6 border border-slate-200 bg-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {t.dashboard.completenessTitle}
                </span>
                <span className="font-display font-extrabold text-lg text-brand-600">
                  {completenessPercentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: `${completenessPercentage}%` }}
                />
              </div>

              {/* Actionable Tips */}
              {missingItems.length > 0 ? (
                <div className="space-y-1.5">
                  <span className="text-xs font-bold text-slate-700 block">
                    Recommended steps to improve discoverability:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {missingItems.slice(0, 3).map((item, idx) => (
                      <Link
                        key={idx}
                        href="/profile/edit"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
                      >
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Add {item.label}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center gap-2 text-emerald-800 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>Your profile is 100% complete! You are primed for maximum discovery.</span>
                </div>
              )}
            </div>

            {/* Public Link Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2 mt-4">
              <div className="flex items-center gap-2 min-w-0">
                <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-xs font-mono text-slate-600 truncate">
                  {publicProfileUrl}
                </span>
              </div>
              <button
                onClick={handleCopyLink}
                className="btn-secondary px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 flex-shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Link'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section: Profile Preview & QR Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Public Profile Live Preview (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900">
                Your Public Profile Preview
              </h3>
              <Link
                href="/profile/edit"
                className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>Edit Info</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="max-w-md">
              <ProfileCard profile={user} />
            </div>
          </div>

          {/* QR Identity Pass Card (1 column) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-slate-900">
                {t.dashboard.qrCodeCard}
              </h3>
              <Link
                href="/dashboard/qr"
                className="text-xs font-bold text-brand-600 hover:underline flex items-center gap-1"
              >
                <span>Full Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <QRCard profile={user} compact />
          </div>

        </div>

      </div>
    </div>
  );
}
