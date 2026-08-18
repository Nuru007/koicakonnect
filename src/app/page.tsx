'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Category, UserProfile } from '@/lib/types';
import { CategoryIcon } from '@/components/CategoryIcon';
import { ProfileCard } from '@/components/ProfileCard';
import { SwipeProfileDeck } from '@/components/SwipeProfileDeck';
import { AutoFlowCategoryCarousel } from '@/components/AutoFlowCategoryCarousel';
import { HeroToggle } from '@/components/HeroToggle';
import { FloatingFlags } from '@/components/FloatingFlags';
import {
  Search,
  ArrowRight,
  Sparkles,
  Compass,
  ArrowUpRight,
  Globe2,
  Cpu,
  Layers,
  CheckCircle2,
  QrCode,
  ShieldCheck,
} from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [recentUsers, setRecentUsers] = useState<UserProfile[]>([]);
  const [stats, setStats] = useState<{ totalPublished: number; totalCategories: number; totalCountries: number } | null>(null);
  const [loading, setLoading] = useState(true);

  // Toggle starts at 'red' and automatically transitions to 'blue' on refresh/load
  const [toggleColor, setToggleColor] = useState<'blue' | 'red'>('red');
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    // Automatic refresh animation: start in red, smoothly glide to blue
    setToggleColor('red');
    const timer = setTimeout(() => {
      setToggleColor('blue');
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = (clientX - left - width / 2) / (width / 2);
    const y = (clientY - top - height / 2) / (height / 2);
    setMousePos({ x, y });
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const [catRes, userRes, statsRes] = await Promise.all([
          fetch('/api/taxonomies'),
          fetch('/api/users?limit=4'),
          fetch('/api/stats'),
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
    'Semiconductor',
    'Quantum Computing',
    'Product Management',
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      
      {/* Dynamic Atmospheric Radial Glowing Background reacting smoothly to toggle state */}
      <div
        className="hero-glow-bg transition-all duration-700 ease-out pointer-events-none"
        style={{
          background:
            toggleColor === 'blue'
              ? 'radial-gradient(circle, rgba(0, 175, 255, 0.18) 0%, rgba(0, 114, 254, 0.08) 40%, transparent 70%)'
              : 'radial-gradient(circle, rgba(244, 63, 94, 0.16) 0%, rgba(225, 29, 72, 0.07) 40%, transparent 70%)',
        }}
      />
      
      {/* Concentric rings at the bottom of hero */}
      <div className="concentric-rings hidden lg:block">
        <div className="concentric-ring-1" />
        <div className="concentric-ring-2" />
        <div className="concentric-ring-3" />
      </div>

      {/* Hero Section Container with mouse move parallax */}
      <section
        onMouseMove={handleMouseMove}
        className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-16 text-center"
      >
        {/* Floating Country Flags (Nigeria, Ghana, Cameroon, Côte d’Ivoire, Senegal) */}
        <FloatingFlags mousePos={mousePos} />

        {/* Floating Youth Leaders Program pill badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-brand-200/80 shadow-sm text-xs font-semibold text-brand-600 mb-6 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-500 relative z-20">
          <span
            className={`w-2 h-2 rounded-full animate-pulse transition-colors duration-300 ${
              toggleColor === 'blue' ? 'bg-brand-500' : 'bg-rose-500'
            }`}
          />
          <span>KOICA Youth Leaders Program (2026–2027)</span>
        </div>

        {/* Hero Title with integrated automatic/interactive Toggle */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-slate-900 tracking-tight leading-[1.08] mb-5 max-w-5xl mx-auto flex flex-col items-center relative z-20 animate-in fade-in duration-700">
          <span className="inline-flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-2">
            <span className="text-slate-900">Connect</span>
            <span className="inline-flex items-center align-middle my-auto">
              <HeroToggle
                state={toggleColor}
                onToggle={() => setToggleColor((prev) => (prev === 'blue' ? 'red' : 'blue'))}
              />
            </span>
            {/* Discover text transitions from ash to vibrant blue gradient */}
            <span className="relative inline-block select-none">
              <span
                className={`transition-opacity duration-700 ease-out text-slate-400 font-black ${
                  toggleColor === 'blue' ? 'opacity-0' : 'opacity-100'
                }`}
              >
                Discover
              </span>
              <span
                className={`absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-brand-500 via-brand-400 to-brand-600 transition-opacity duration-700 ease-out font-black ${
                  toggleColor === 'blue' ? 'opacity-100' : 'opacity-0'
                }`}
              >
                Discover
              </span>
            </span>
          </span>
          <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-700 tracking-tight mt-2 sm:mt-3 block">
            with your fellow leaders across Africa
          </span>
        </h1>

        {/* Hero Supporting Text */}
        <p className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10 font-normal relative z-20 animate-in fade-in duration-1000">
          Discover the people in your cohort, find shared interests, and build meaningful connections across Africa.
        </p>

        {/* Primary and Secondary CTA buttons - Stack full-width on small mobile */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-10 relative z-20 animate-in fade-in duration-1000 max-w-xs sm:max-w-none mx-auto w-full">
          <Link
            href="/discover"
            className="btn-primary w-full sm:w-auto px-7 sm:px-10 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold inline-flex items-center justify-center gap-2.5 shadow-brand-md hover:scale-[1.02] transition-all"
          >
            <Compass className="w-5 h-5" />
            <span>Explore the Cohort</span>
          </Link>
          <a
            href="#how-it-works"
            className="btn-secondary w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base font-bold inline-flex items-center justify-center gap-2 shadow-sm hover:scale-[1.02] transition-all"
          >
            <span>How It Works</span>
          </a>
        </div>

        {/* Hero Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="max-w-2xl mx-auto relative mb-5 shadow-brand-md rounded-2xl group relative z-20 w-full"
        >
          <div className="flex items-center bg-white rounded-2xl p-1.5 sm:p-2 border-2 border-brand-100 group-focus-within:border-brand-500 transition-all">
            <div className="pl-2 sm:pl-3 pr-1 sm:pr-2 text-slate-400">
              <Search className="w-4 sm:w-5 h-4 sm:h-5 group-focus-within:text-brand-500 transition-colors" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search cohort, skill, interest..."
              className="flex-1 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:outline-none text-xs sm:text-base py-2 sm:py-2.5 px-1.5 sm:px-2 font-medium min-w-0"
            />
            <button
              type="submit"
              className="btn-primary px-4 sm:px-7 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 sm:gap-2 flex-shrink-0"
            >
              <span>Search</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </button>
          </div>
        </form>

        {/* Quick Search Chips */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-3xl mx-auto relative z-20 px-2">
          <span className="text-[11px] sm:text-xs font-semibold text-slate-400 w-full sm:w-auto text-center mb-1 sm:mb-0">
            Popular in Cohort:
          </span>
          {quickKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => handlePillClick(kw)}
              className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium bg-white/90 hover:bg-brand-50 text-slate-700 hover:text-brand-600 border border-slate-200/80 hover:border-brand-200 transition-all shadow-2xs backdrop-blur-sm"
            >
              {kw}
            </button>
          ))}
        </div>
      </section>

      {/* Discovery Layer Section: Shows Real DB Profiles or Honest Empty State */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Discovery Feed</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              {recentUsers.length > 0 ? t.home.recentlyJoinedTitle : 'Discover Experts & Leaders'}
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              {recentUsers.length > 0
                ? t.home.recentlyJoinedSubtitle
                : 'Profiles are indexed directly from our live database with zero fake data.'}
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

        {/* Dynamic Rendering: Swipeable People Showcase or intentional empty state */}
        {recentUsers.length > 0 ? (
          <div className="py-4">
            <SwipeProfileDeck profiles={recentUsers} />
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-10 sm:p-14 text-center max-w-2xl mx-auto border border-brand-200/60 bg-white/90 shadow-sm relative overflow-hidden">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-500 to-brand-400 text-white flex items-center justify-center mx-auto mb-5 shadow-brand-sm">
              <Sparkles className="w-8 h-8" />
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
                className="btn-primary px-7 py-3 rounded-xl text-sm font-bold inline-flex items-center gap-2"
              >
                <span>{t.home.emptyPlatformCta}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/discover"
                className="btn-secondary px-6 py-3 rounded-xl text-sm font-bold"
              >
                Explore Discover Page
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* Category Exploration Section — Royal Electric Blue 3-Card AutoFlow Carousel */}
      <AutoFlowCategoryCarousel />

      {/* Core Philosophy: How KoicaKonnect Works */}
      <section id="how-it-works" className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 scroll-mt-12">
        <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-brand-950 rounded-3xl p-8 sm:p-14 text-white shadow-2xl relative overflow-hidden">
          
          {/* Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-brand-500/20 text-brand-300 border border-brand-400/30 inline-block">
                The Discovery Layer
              </span>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
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
              KoicaKonnect is intentionally not a social network. No endless feeds, no follower counts, no algorithm traps. Simply find authentic talent and connect where it matters.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 font-bold flex items-center justify-center mb-4 text-sm">
                01
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                {t.home.step1Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.home.step1Desc}
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-brand-400/20 text-brand-300 font-bold flex items-center justify-center mb-4 text-sm">
                02
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                {t.home.step2Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.home.step2Desc}
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold flex items-center justify-center mb-4 text-sm">
                03
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-2">
                {t.home.step3Title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {t.home.step3Desc}
              </p>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <QrCode className="w-6 h-6 text-brand-400" />
              <span className="text-xs text-slate-300">
                Every published profile receives a unique, scannable QR Identity Pass.
              </span>
            </div>
            <Link
              href="/signup"
              className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold"
            >
              Get Your Digital Identity
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
