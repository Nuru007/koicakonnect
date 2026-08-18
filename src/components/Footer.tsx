'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Globe, Shield, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 pb-12 text-slate-600 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
          
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center text-white shadow-brand-sm">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">
                KoicaKonnect
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Discover people before you network with them. The global discovery and professional identity layer connecting talent with opportunities worldwide.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                <img
                  src="/koica-logo.png"
                  alt="KOICA"
                  className="h-4.5 w-auto object-contain"
                />
                <span className="text-[11px] font-semibold text-slate-700">Youth Leaders Program</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Discovery Engine
              </span>
            </div>
          </div>

          {/* Discovery Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.nav.discover}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/discover" className="hover:text-brand-500 transition-colors">
                  Search Professionals
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-500 transition-colors">
                  All Categories
                </Link>
              </li>
              <li>
                <Link href="/countries" className="hover:text-brand-500 transition-colors">
                  Global Directory
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/signup" className="hover:text-brand-500 transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-brand-500 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard/qr" className="hover:text-brand-500 transition-colors">
                  QR Identity Card
                </Link>
              </li>
            </ul>
          </div>

          {/* Language & Identity */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Language
            </h4>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setLanguage('en')}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  language === 'en' ? 'bg-brand-50 text-brand-600 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                🇺🇸 English (EN)
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  language === 'fr' ? 'bg-brand-50 text-brand-600 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                🇫🇷 Français (FR)
              </button>
              <button
                onClick={() => setLanguage('ko')}
                className={`text-left text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                  language === 'ko' ? 'bg-brand-50 text-brand-600 font-bold' : 'hover:bg-slate-50'
                }`}
              >
                🇰🇷 한국어 (KO)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 KoicaKonnect. All rights reserved. Designed for pure professional discovery.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-500">
              <Shield className="w-3.5 h-3.5 text-brand-500" />
              Not a social network. No feeds, no followers.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
