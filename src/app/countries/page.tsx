'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Globe, Users, ArrowRight, Compass, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { PRIMARY_AFRICAN_COUNTRIES, getCountryFlag, getCountryFlagImg, getCountryOption, normalizeCountry } from '@/lib/countries';

export default function CountriesPage() {
  const { t } = useLanguage();
  const [countriesWithCounts, setCountriesWithCounts] = useState<{ country: string; count: number }[]>([]);
  const [totalPublished, setTotalPublished] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCountries() {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCountriesWithCounts(data.countries || []);
          if (data.stats) {
            setTotalPublished(data.stats.totalPublished || 0);
          }
        }
      } catch (err) {
        console.error('Failed to load countries:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCountries();
  }, []);

  // Map of canonical country name (lowercase) -> count
  const countLookup = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const item of countriesWithCounts) {
      const canon = normalizeCountry(item.country).toLowerCase();
      map[canon] = (map[canon] || 0) + item.count;
    }
    return map;
  }, [countriesWithCounts]);

  // Primary 5 African partner countries with their live dynamic counts
  const primaryAfricanCohort = React.useMemo(() => {
    return PRIMARY_AFRICAN_COUNTRIES.map((c) => {
      const key = c.name.toLowerCase();
      const count = countLookup[key] || 0;
      return {
        ...c,
        count,
      };
    });
  }, [countLookup]);

  // Other active countries from live database that are not part of the primary 5 African countries
  const otherActiveCountries = React.useMemo(() => {
    const primaryNames = PRIMARY_AFRICAN_COUNTRIES.map((p) => p.name.toLowerCase());
    return countriesWithCounts
      .filter((item) => {
        const canon = normalizeCountry(item.country).toLowerCase();
        return !primaryNames.includes(canon);
      })
      .map((item) => {
        const opt = getCountryOption(item.country);
        return {
          name: opt ? opt.name : item.country,
          code: opt ? opt.code : item.country.slice(0, 2).toUpperCase(),
          flag: opt ? opt.flag : getCountryFlag(item.country),
          flagImg: opt?.flagImg || getCountryFlagImg(item.country),
          region: opt?.region || 'International',
          count: item.count,
        };
      });
  }, [countriesWithCounts]);

  const activeCountriesCount = countriesWithCounts.filter((c) => c.count > 0).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title & Badges */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-brand-600 text-xs font-bold mb-3 border border-slate-200 shadow-2xs">
            <Globe className="w-3.5 h-3.5" />
            <span>{t.countriesPage.badge}</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight mb-4">
            {t.countriesPage.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {t.countriesPage.subtitle}
          </p>

          {/* Quick Metrics Strip */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-medium text-slate-700">
              <Users className="w-3.5 h-3.5 text-brand-500" />
              <span><strong>{totalPublished}</strong> {t.countriesPage.registeredLeaders}</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 shadow-2xs text-xs font-medium text-slate-700">
              <Compass className="w-3.5 h-3.5 text-brand-500" />
              <span><strong>{activeCountriesCount}</strong> {t.countriesPage.activeNations}</span>
            </div>
          </div>
        </div>

        {/* Section 1: KOICA Focus Partner Countries (The 5 African Nations) */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
            <div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
                <span>{t.countriesPage.primaryCohortTitle}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                {t.countriesPage.primaryCohortSubtitle}
              </p>
            </div>

            <Link
              href="/discover"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              <span>{t.home.discoverBtn}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-44 rounded-3xl bg-white p-5 border border-slate-200 animate-pulse shadow-xs" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
              {primaryAfricanCohort.map((country) => {
                const hasMembers = country.count > 0;
                return (
                  <Link
                    key={country.code}
                    href={`/discover?country=${encodeURIComponent(country.name)}`}
                    className={`surface-card surface-card-hover rounded-3xl p-5 flex flex-col justify-between group border transition-all duration-300 relative overflow-hidden bg-white ${
                      hasMembers
                        ? 'border-slate-200/90 shadow-xs hover:shadow-md hover:border-brand-400'
                        : 'border-slate-200/60 shadow-2xs hover:border-slate-300'
                    }`}
                  >
                    {/* Top flag and region */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3.5">
                        {/* High-res flag container */}
                        <div className="w-12 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0 bg-slate-50">
                          {country.flagImg ? (
                            <img
                              src={country.flagImg}
                              alt={`${country.name} Flag`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-base font-bold bg-brand-50 text-brand-600">
                              {country.flag}
                            </div>
                          )}
                        </div>

                        {/* Region pill */}
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200/60 truncate">
                          {country.region}
                        </span>
                      </div>

                      {/* Country Name */}
                      <h3 className="font-display font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors mb-1">
                        {country.name}
                      </h3>
                    </div>

                    {/* Bottom member count & arrow */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-3">
                      {hasMembers ? (
                        <div className="inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          <span className="text-xs font-bold text-slate-800">
                            {country.count} {country.count === 1 ? 'member' : 'members'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          0 members
                        </span>
                      )}

                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center transition-colors ${
                        hasMembers
                          ? 'bg-brand-50 text-brand-600 group-hover:bg-brand-500 group-hover:text-white'
                          : 'bg-slate-50 text-slate-400 group-hover:text-slate-600'
                      }`}>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Section 2: Other International Hubs & Registered Regions */}
        {otherActiveCountries.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-slate-900 flex items-center gap-2">
                  <span>Other Global Hubs & Regions</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {otherActiveCountries.length} {otherActiveCountries.length === 1 ? 'Country' : 'Countries'}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  International partner hubs and global participants
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {otherActiveCountries.map((country) => (
                <Link
                  key={country.name}
                  href={`/discover?country=${encodeURIComponent(country.name)}`}
                  className="surface-card surface-card-hover rounded-3xl p-5 flex items-center justify-between group border border-slate-200 bg-white shadow-xs hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-8 rounded-lg overflow-hidden border border-slate-200 shadow-2xs group-hover:scale-105 transition-transform flex-shrink-0 bg-slate-50 flex items-center justify-center">
                      {country.flagImg ? (
                        <img
                          src={country.flagImg}
                          alt={`${country.name} Flag`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm">{country.flag}</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display font-bold text-sm text-slate-900 group-hover:text-brand-600 transition-colors truncate">
                        {country.name}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">
                        {country.count} {country.count === 1 ? 'member' : 'members'}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-600 transition-transform group-hover:translate-x-1 flex-shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Global Directory Join CTA */}
        <div className="surface-card rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto border border-slate-200 bg-white shadow-xs relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 border border-brand-100 flex items-center justify-center mx-auto mb-4">
            <Compass className="w-7 h-7" />
          </div>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 mb-2">
            Are you representing your country?
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-md mx-auto leading-relaxed">
            Create your digital identity on KOICA CONNECT and showcase your expertise to fellow leaders across Africa and global partner hubs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/signup"
              className="btn-primary px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center gap-2 shadow-brand-sm"
            >
              <span>Create Your Profile</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/discover"
              className="btn-secondary px-6 py-3 rounded-xl text-xs font-bold"
            >
              Explore Discover Grid
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
