'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { CategoryIcon } from '@/components/CategoryIcon';
import { Sparkles, ArrowRight, Users, Compass } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function CategoriesPage() {
  const { t } = useLanguage();
  const [categoriesWithStats, setCategoriesWithStats] = useState<{ category: Category; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setCategoriesWithStats(data.categoryStats || []);
        }
      } catch (err) {
        console.error('Failed to load category stats:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFBFF] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold mb-3 border border-brand-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Taxonomy Directory</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight mb-4">
            Browse by Industry & Field
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Discover professionals, domain researchers, and technical leaders organized across database-backed industry categories.
          </p>
        </div>

        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-44 rounded-3xl bg-white p-6 border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoriesWithStats.map(({ category, count }) => (
              <Link
                key={category.id}
                href={`/discover?category=${category.slug}`}
                className="glass-card glass-card-hover rounded-3xl p-6 flex flex-col justify-between group border border-slate-200/80 bg-white/95"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 group-hover:bg-brand-500 text-brand-600 group-hover:text-white flex items-center justify-center transition-colors shadow-2xs">
                      <CategoryIcon nameOrIcon={category.icon || category.slug} className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 group-hover:bg-brand-100 group-hover:text-brand-700 transition-colors">
                      <Users className="w-3 h-3" />
                      <span>{count}</span>
                    </span>
                  </div>

                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors mb-1.5">
                    {category.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {category.description || 'Explore verified professionals in this field.'}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-600 mt-4">
                  <span>Explore talent</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
