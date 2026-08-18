'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Users, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getCountryFlag } from '@/lib/countries';

export default function CountriesPage() {
  const { t } = useLanguage();
  const [countries, setCountries] = useState<{ country: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch('/api/stats');
        if (res.ok) {
          const data = await res.json();
          setCountries(data.countries || []);
        }
      } catch (err) {
        console.error('Failed to load countries:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCountries();
  }, []);

  return (
    <div className="min-h-screen bg-[#FAFBFF] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-bold mb-3 border border-brand-100">
            <Globe className="w-3.5 h-3.5" />
            <span>Global Directory</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight mb-4">
            Discover by Country & Region
          </h1>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Find talent, researchers, and specialists globally. Explore people by geographic hub and international presence.
          </p>
        </div>

        {/* Countries Grid or Empty State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-32 rounded-3xl bg-white p-6 border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : countries.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {countries.map(({ country, count }) => (
              <Link
                key={country}
                href={`/discover?country=${encodeURIComponent(country)}`}
                className="glass-card glass-card-hover rounded-3xl p-6 flex items-center justify-between group border border-slate-200/80 bg-white/95 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 group-hover:bg-brand-500 text-xl flex items-center justify-center transition-colors shadow-2xs">
                    <span>{getCountryFlag(country)}</span>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                      {country}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {count} {count === 1 ? 'member' : 'members'}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-12 text-center max-w-xl mx-auto border border-brand-200/60 bg-white/90 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="font-display font-bold text-xl text-slate-900 mb-2">
              Global directory is expanding
            </h3>
            <p className="text-sm text-slate-500 mb-6 leading-relaxed">
              Be the first expert from your country to create and publish a KoicaKonnect profile.
            </p>
            <Link
              href="/signup"
              className="btn-primary px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2"
            >
              <span>Create Your Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
