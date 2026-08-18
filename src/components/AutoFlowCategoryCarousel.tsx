'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, ArrowUpRight, Sparkles, Pause, Play } from 'lucide-react';

export interface CategoryItem {
  num: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  {
    num: 'No - 01',
    name: 'Agriculture',
    slug: 'agriculture',
    description: 'Agritech, sustainable farming, food systems & genomics',
    image: '/categories/agriculture.jpg',
  },
  {
    num: 'No - 02',
    name: 'Education',
    slug: 'education',
    description: 'Edtech, academia, higher education & instructional design',
    image: '/categories/education.jpg',
  },
  {
    num: 'No - 03',
    name: 'Energy',
    slug: 'energy',
    description: 'Clean energy, renewables, power grids, nuclear & battery storage',
    image: '/categories/energy.jpg',
  },
  {
    num: 'No - 04',
    name: 'Engineering',
    slug: 'engineering',
    description: 'Hardware, robotics, mechanical, civil & electrical engineering',
    image: '/categories/engineering.jpg',
  },
  {
    num: 'No - 05',
    name: 'Entrepreneurship',
    slug: 'entrepreneurship',
    description: 'Startup founders, venture builders & angel investors',
    image: '/categories/entrepreneurship.jpg',
  },
];

export const AutoFlowCategoryCarousel: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = CATEGORIES.length;

  // Auto-flow timer: advances by 1 card every 3.5 seconds
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setStartIndex((prev) => (prev + 1) % total);
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, total]);

  const handleNext = () => {
    setStartIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setStartIndex((prev) => (prev - 1 + total) % total);
  };

  // Get the 3 visible cards starting from startIndex with wrap-around
  const visibleCards = [
    CATEGORIES[startIndex % total],
    CATEGORIES[(startIndex + 1) % total],
    CATEGORIES[(startIndex + 2) % total],
  ];

  return (
    <div
      className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Vibrant Royal Blue Card Container from Inspiration */}
      <div className="bg-gradient-to-br from-[#1258E2] via-[#0C46BF] to-[#072F8B] rounded-3xl p-6 sm:p-10 lg:p-14 border border-blue-400/30 text-white shadow-2xl relative overflow-hidden">
        
        {/* Glowing Cobalt / Cyan Ambient Highlights */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-sky-200 text-xs font-bold uppercase tracking-wider mb-3 shadow-2xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>What We Do</span>
              <span>•</span>
              <span>Focus Disciplines</span>
            </div>
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              We Connect Leaders Across<br className="hidden sm:inline" /> High-Impact Fields
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-3 max-w-md">
            <p className="text-xs sm:text-sm text-blue-100/80 leading-relaxed md:text-right">
              Connecting researchers, founders, and technical leaders across global innovation ecosystems.
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white transition-colors group"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 3 Visible Autoflowing Cards Grid */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {visibleCards.map((cat, idx) => (
            <Link
              key={`${cat.slug}-${startIndex}-${idx}`}
              href={`/discover?category=${cat.slug}`}
              className="group relative h-[380px] sm:h-[430px] rounded-3xl overflow-hidden border border-white/20 hover:border-sky-300/70 transition-all duration-500 transform hover:-translate-y-1.5 shadow-xl flex flex-col justify-between p-5 bg-blue-950 animate-in fade-in zoom-in-95 duration-500"
            >
              {/* Background Photography with Smooth Hover Scale */}
              <img
                src={cat.image}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Dark Vignette Overlay for Crisp Typography Contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/30 to-black/20 group-hover:from-slate-950/95 transition-colors" />

              {/* Top Corner Pill: Card Number */}
              <div className="relative z-10 flex justify-end">
                <span className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/25 text-white/95 text-xs font-mono font-bold shadow-md">
                  {cat.num}
                </span>
              </div>

              {/* Bottom Glassmorphic Card Container */}
              <div className="relative z-10 p-4.5 sm:p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-2xl transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-display font-extrabold text-lg sm:text-xl text-white group-hover:text-sky-200 transition-colors tracking-tight">
                    {cat.name}
                  </h3>
                  <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white group-hover:bg-sky-400 group-hover:text-slate-900 transition-all flex-shrink-0 shadow-sm">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-xs text-blue-50/90 line-clamp-2 leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Carousel Footer Controls: Previous, Next & Progress Dots */}
        <div className="relative z-10 mt-8 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Progress Indicator Dots */}
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat, index) => {
              const isActive = index === startIndex % total;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setStartIndex(index)}
                  aria-label={`Go to ${cat.name}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-8 bg-sky-300 shadow-sm'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              );
            })}
            <span className="text-[11px] font-mono font-medium text-sky-200/80 ml-2">
              Showing 3 of {total} (Autoflowing)
            </span>
          </div>

          {/* Nav Buttons (Prev / Next & Pause status) */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-sky-200 text-xs font-semibold flex items-center gap-1.5 border border-white/15 transition-colors"
              title={isPaused ? 'Resume autoflow' : 'Pause autoflow'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Paused' : 'Auto'}</span>
            </button>

            <button
              onClick={handlePrev}
              aria-label="Previous categories"
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 transition-all active:scale-95 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next categories"
              className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 transition-all active:scale-95 shadow-sm"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
