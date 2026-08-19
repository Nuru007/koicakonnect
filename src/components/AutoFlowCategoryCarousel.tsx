'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';

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
  const total = CATEGORIES.length;

  // Continuous uninterrupted Auto-scroll timer: advances smoothly by 1 card every 1.8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }, 1800);

    return () => clearInterval(timer);
  }, []);

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
    <section className="relative z-10 w-full bg-slate-900 py-20 text-white shadow-lg overflow-hidden border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-sky-300 text-xs font-bold uppercase tracking-wider mb-3.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Focus Disciplines</span>
            </div>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Connect Leaders Across<br className="hidden sm:inline" /> High-Impact Fields
            </h2>
          </div>

          <div className="flex flex-col items-start md:items-end gap-4 max-w-md">
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed md:text-right">
              Connecting researchers, founders, and technical specialists across priority economic and innovation tracks.
            </p>
            
            <Link
              href="/categories"
              className="inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition-all group flex-shrink-0"
            >
              <span>View All Categories</span>
              <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center group-hover:bg-brand-600 transition-colors">
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </div>
        </div>

        {/* 3 Visible Cards Viewport with Fast Smooth Auto-Scroll Track */}
        <div className="relative z-10 overflow-hidden py-2">
          <div
            className={`flex gap-6 ${isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''}`}
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
                  className="group relative h-[400px] sm:h-[440px] rounded-3xl overflow-hidden border border-white/15 hover:border-brand-400 transition-all duration-300 transform hover:-translate-y-1.5 shadow-lg flex flex-col justify-between p-5 bg-slate-950 block"
                >
                  {/* Photography */}
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out opacity-85 group-hover:opacity-95"
                  />

                  {/* Clean Dark Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30 group-hover:from-slate-950/90 transition-colors" />

                  {/* Top Corner Pill: Card Number */}
                  <div className="relative z-10 flex justify-end">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-mono font-bold">
                      {cat.num}
                    </span>
                  </div>

                  {/* Bottom Card Content Container */}
                  <div className="relative z-10 p-5 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-white/15 text-white shadow-lg transition-all duration-300 group-hover:border-brand-400/50">
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <h3 className="font-display font-extrabold text-lg sm:text-xl text-white group-hover:text-brand-300 transition-colors tracking-tight">
                        {cat.name}
                      </h3>
                      <div className="w-8 h-8 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-white group-hover:bg-brand-500 group-hover:border-brand-500 transition-all duration-300 flex-shrink-0">
                        <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                      </div>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-medium">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Footer: Continuous Auto-Flow Indicator */}
        <div className="relative z-10 mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          
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
                      ? 'w-8 bg-brand-400'
                      : 'w-2 bg-white/30 hover:bg-white/50'
                  }`}
                />
              );
            })}
            <span className="text-xs font-mono font-medium text-slate-300 ml-2">
              Autoscrolling 3 of {total} focus disciplines
            </span>
          </div>

          {/* Continuous Live Motion Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-white/10 text-slate-200 text-xs font-semibold flex items-center gap-2 border border-white/15">
              <span className="w-2 h-2 rounded-full bg-brand-400" />
              <span>Live Continuous Flow</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
