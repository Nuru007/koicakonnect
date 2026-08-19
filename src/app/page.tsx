'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Category, UserProfile } from '@/lib/types';
import { SwipeProfileDeck } from '@/components/SwipeProfileDeck';
import { AutoFlowCategoryCarousel } from '@/components/AutoFlowCategoryCarousel';
import { PRIMARY_AFRICAN_COUNTRIES } from '@/lib/countries';
import {
  Search,
  ArrowRight,
  Compass,
  QrCode,
  Users,
  Shield,
  Layers,
  Globe,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<{ totalPublished: number; totalCategories: number; totalCountries: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, userRes, statsRes] = await Promise.all([
          fetch('/api/taxonomies', { cache: 'no-store' }),
          fetch('/api/users?limit=4', { cache: 'no-store' }),
          fetch('/api/stats', { cache: 'no-store' }),
        ]);

        if (catRes.ok) {
          const data = await catRes.json();
          setCategories(data.categories || []);
        }

        if (userRes.ok) {
          const data = await userRes.json();
          setRecentUsers(data.users || []);
        }

        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data.stats || null);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/discover');
    }
  };

  const handlePillClick = (keyword: string) => {
    router.push(`/discover?q=${encodeURIComponent(keyword)}`);
  };

  const quickKeywords = [
    'AI',
    'Robotics',
    'Healthcare',
    'Fintech',
    'Agriculture',
    'Energy',
    'Entrepreneurship',
  ];

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      
      {/* Hero Section Container */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 sm:pt-20 pb-16 text-center">
        
        {/* Program Identification Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs text-xs font-semibold text-slate-800 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-500" />
          <span>KOICA Youth Leaders Program • 2026–2027</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-900 tracking-tight leading-[1.08] mb-6 max-w-5xl mx-auto">
          Connect & Discover Leaders Across Africa
        </h1>

        {/* Hero Supporting Text */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal">
          Discover the verified researchers, founders, and technical specialists in your cohort. Find shared disciplines and build authentic relationships.
        </p>

        {/* Primary and Secondary CTA buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10 max-w-xs sm:max-w-none mx-auto w-full">
          <Link
            href="/discover"
            className="btn-primary w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2.5 shadow-brand-sm hover:scale-[1.02] transition-all"
          >
            <Compass className="w-4 h-4" />
            <span>Explore the Cohort</span>
          </Link>
          <Link
            href="/signup"
            className="btn-secondary w-full sm:w-auto px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-xs hover:scale-[1.02] transition-all"
          >
            <span>Create Profile</span>
          </Link>
        </div>

        {/* Hero Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto mb-5 shadow-sm rounded-2xl group w-full"
        >
          <div className="flex items-center bg-white rounded-2xl p-1.5 sm:p-2 border border-slate-200 group-focus-within:border-brand-500 group-focus-within:ring-4 group-focus-within:ring-brand-500/10 transition-all">
            <div className="pl-3 pr-2 text-slate-400">
              <Search className="w-4 sm:w-5 h-4 sm:h-5 group-focus-within:text-brand-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, role, skill, or discipline..."
              className="flex-1 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:outline-none text-xs sm:text-sm py-2 sm:py-2.5 px-1.5 sm:px-2 font-medium min-w-0"
            />
            <button
              type="submit"
              className="btn-primary px-5 sm:px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 flex-shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto px-2 mb-10">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 w-full sm:w-auto text-center mb-1 sm:mb-0">
            Popular Tracks:
          </span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => handlePillClick(kw)}
              className="px-3 py-1 rounded-full text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 hover:text-brand-600 border border-slate-200 hover:border-slate-300 transition-all shadow-2xs"
            >
              {kw}
            </button>
          ))}
        </div>

        {/* Grounded Cohort Partner Nations Ribbon */}
        <div className="pt-8 border-t border-slate-200/80 max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
            KOICA African Partner Nations
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
            {PRIMARY_AFRICAN_COUNTRIES.map((c) => (
              <Link
                key={c.code}
                href={`/discover?country=${encodeURIComponent(c.name)}`}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/90 hover:border-brand-400 text-xs font-semibold text-slate-800 hover:text-brand-600 shadow-2xs hover:shadow-xs transition-all group"
              >
                <img
                  src={c.flagImg}
                  alt={c.name}
                  className="w-5 h-3.5 rounded object-cover border border-slate-200"
                />
                <span>{c.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Discovery Feed Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold mb-2 border border-brand-100">
              <Users className="w-3.5 h-3.5" />
              <span>Real-Time Discovery Feed</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              {recentUsers.length > 0 ? t.home.recentlyJoinedTitle : 'Discover Experts & Leaders'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {recentUsers.length > 0
                ? t.home.recentlyJoinedSubtitle
                : 'Profiles are indexed directly from our live database with zero simulated data.'}
            </p>
          </div>

          {recentUsers.length > 0 && (
            <Link
              href="/discover"
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
            >
              <span>View All Registered People</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {/* Dynamic Rendering: Swipeable People Showcase or Clean Empty State */}
        {recentUsers.length > 0 ? (
          <div className="py-4">
            <SwipeProfileDeck profiles={recentUsers} />
          </div>
        ) : (
          <div className="surface-card rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto border border-slate-200 bg-white shadow-xs relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-2xl text-slate-900 mb-2">
              {t.home.emptyPlatformTitle}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
              {t.home.emptyPlatformDesc}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className="btn-primary px-7 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2"
              >
                <span>{t.home.emptyPlatformCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/discover"
                className="btn-secondary px-6 py-3 rounded-xl text-xs font-bold"
              >
                Explore Discover Page
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Focus Disciplines Section */}
      <AutoFlowCategoryCarousel />

      {/* Core Philosophy: How KOICA CONNECT Works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-12">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl border border-slate-800">
          
          <div className="relative z-10 max-w-3xl mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/10 text-slate-300 border border-white/15 inline-block">
                The Discovery Layer
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15">
                <img
                  src="/koica-logo.png"
                  alt="KOICA"
                  className="h-3.5 w-auto object-contain brightness-0 invert"
                />
                <span className="text-[11px] font-semibold text-white/90">
                  KOICA Youth Leaders Program
                </span>
              </div>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mb-3">
              {t.home.howItWorksTitle}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              KOICA CONNECT is built for intentional discovery. No endless feeds, no follower counts, no algorithm noise. Simply find authentic talent and connect where it matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center mb-4 text-xs">
                01
              </div>
              <h3 className="font-display font-bold text-base text-white mb-2">
                {t.home.step1Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.home.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center mb-4 text-xs">
                02
              </div>
              <h3 className="font-display font-bold text-base text-white mb-2">
                {t.home.step2Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.home.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center mb-4 text-xs">
                03
              </div>
              <h3 className="font-display font-bold text-base text-white mb-2">
                {t.home.step3Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.home.step3Desc}
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <QrCode className="w-5 h-5 text-brand-400 flex-shrink-0" />
              <span className="text-xs text-slate-300">
                Every published profile receives a unique, scannable QR Identity Pass.
              </span>
            </div>
            <Link
              href="/signup"
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap"
            >
              Get Your Digital Identity
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
