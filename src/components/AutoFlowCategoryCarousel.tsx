'use client';

import React, { useState, useEffect, useRef } from 'react';
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

// Tripled list to enable continuous smooth circular auto-scrolling
const EXTENDED_CATEGORIES = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

export const AutoFlowCategoryCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(CATEGORIES.length); // Start in middle set
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const total = CATEGORIES.length;

  // Auto-scroll timer: advances by 1 card every 3.2 seconds
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, 3200);

    return () => clearInterval(timer);
  }, [isPaused, currentIndex]);

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  // Seamless wrap-around when reaching boundaries of the tripled array
  const handleTransitionEnd = () => {
    if (currentIndex >= total * 2) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex - total);
    } else if (currentIndex < total) {
      setIsTransitioning(false);
      setCurrentIndex(currentIndex + total);
    }
  };

  const activeDotIndex = ((currentIndex % total) + total) % total;

  return (
    <section
      className="relative z-10 w-full bg-gradient-to-br from-[#1258E2] via-[#0C46BF] to-[#072F8B] py-20 text-white shadow-2xl overflow-hidden border-y border-blue-400/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Glowing Cobalt / Cyan Ambient Highlights */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Prominent Pop-out CTA */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-sky-200 text-xs font-bold uppercase tracking-wider mb-3.5 shadow-2xs backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-sky-300" />
              <span>What We Do</span>
              <span>•</span>
              <span>Focus Disciplines</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              We Connect Leaders Across<br className="hidden sm:inline" /> High-Impact Fields
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 max-w-md">
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed md:text-right">
              Connecting researchers, founders, and technical leaders across global innovation ecosystems.
            </p>
            
            {/* Pop-Out "View All Categories" Button */}
            <Link
              href="/categories"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white text-blue-950 hover:bg-sky-50 font-extrabold text-xs sm:text-sm shadow-xl shadow-blue-950/40 hover:shadow-cyan-300/50 hover:scale-105 transition-all group flex-shrink-0 border-2 border-white"
            >
              <span>View All Categories</span>
              <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center group-hover:bg-blue-700 transition-colors shadow-2xs">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* 3 Visible Cards Viewport with Continuous Auto-Scroll Track */}
        <div className="relative z-10 overflow-hidden py-2">
          <div
            className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`}
            style={{
              transform: `translateX(calc(-${currentIndex} * (100% / 3 + 8px)))`,
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {EXTENDED_CATEGORIES.map((cat, idx) => (
              <div
                key={`${cat.slug}-${idx}`}
                className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] flex-shrink-0"
              >
                <Link
                  href={`/discover?category=${cat.slug}`}
                  className="group relative h-[400px] sm:h-[440px] rounded-3xl overflow-hidden border border-white/20 hover:border-sky-300/80 transition-all duration-500 transform hover:-translate-y-2 shadow-2xl flex flex-col justify-between p-5 bg-blue-950 block"
                >
                  {/* Photography with Subtle Hover Zoom */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Dark Contrast Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/35 to-black/25 group-hover:from-slate-950/98 transition-colors" />

                  {/* Top Corner Pill: Card Number */}
                  <div className="relative z-10 flex justify-end">
                    <span className="px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/25 text-white/95 text-xs font-mono font-bold shadow-md">
                      {cat.num}
                    </span>
                  </div>

                  {/* Bottom Glassmorphic Card Container */}
                  <div className="relative z-10 p-5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 text-white shadow-2xl transition-all duration-300 group-hover:bg-white/20 group-hover:border-white/40">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-white group-hover:text-sky-200 transition-colors tracking-tight">
                        {cat.name}
                      </h3>
                      <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:bg-sky-400 group-hover:text-slate-900 transition-all flex-shrink-0 shadow-sm">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-xs text-blue-50/90 line-clamp-2 leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Footer Controls */}
        <div className="relative z-10 mt-10 pt-6 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Progress Indicator Dots */}
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat, index) => {
              const isActive = index === activeDotIndex;
              return (
                <button
                  key={cat.slug}
                  onClick={() => {
                    setIsTransitioning(true);
                    setCurrentIndex(total + index);
                  }}
                  aria-label={`Go to ${cat.name}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'w-8 bg-sky-300 shadow-md'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              );
            })}
            <span className="text-xs font-mono font-medium text-sky-200/90 ml-2">
              Autoscrolling 3 of {total} focus disciplines
            </span>
          </div>

          {/* Nav Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-3.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-sky-100 text-xs font-bold flex items-center gap-1.5 border border-white/20 transition-all"
              title={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
            >
              {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              <span>{isPaused ? 'Paused' : 'Autoscroll Active'}</span>
            </button>

            <button
              onClick={handlePrev}
              aria-label="Previous category"
              className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 transition-all active:scale-95 shadow-md"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleNext}
              aria-label="Next category"
              className="w-10 h-10 rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center border border-white/20 transition-all active:scale-95 shadow-md"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
