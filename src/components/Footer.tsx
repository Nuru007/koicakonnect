'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, Shield, ArrowUpRight, Network } from 'lucide-react';
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
              <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center shadow-brand-sm">
                <Network className="w-4 h-4 stroke-[2.2]" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-slate-900">
                KOICA CONNECT
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed max-w-sm">
              Discover people before you network with them. The dedicated discovery and professional identity layer connecting leaders across Africa and global partner hubs.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
                <span className="font-display font-black text-xs text-brand-600 tracking-tight">KOICA</span>
                <span className="text-[11px] font-semibold text-slate-700">Youth Leaders Program</span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Live Directory
              </span>
            </div>
          </div>

          {/* Discovery Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              {t.nav.discover}
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/discover" className="hover:text-brand-600 transition-colors">
                  Search Directory
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-brand-600 transition-colors">
                  Focus Disciplines
                </Link>
              </li>
              <li>
                <Link href="/countries" className="hover:text-brand-600 transition-colors">
                  Partner Nations
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link href="/signup" className="hover:text-brand-600 transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-brand-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard/qr" className="hover:text-brand-600 transition-colors">
                  Digital Pass & QR
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
                className={`text-left text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  language === 'en' ? 'bg-brand-50 text-brand-600 font-bold border border-brand-100' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                🇺🇸 English (EN)
              </button>
              <button
                onClick={() => setLanguage('fr')}
                className={`text-left text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  language === 'fr' ? 'bg-brand-50 text-brand-600 font-bold border border-brand-100' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                🇫🇷 Français (FR)
              </button>
              <button
                onClick={() => setLanguage('ko')}
                className={`text-left text-xs px-3 py-1.5 rounded-xl font-medium transition-colors ${
                  language === 'ko' ? 'bg-brand-50 text-brand-600 font-bold border border-brand-100' : 'hover:bg-slate-50 text-slate-600'
                }`}
              >
                🇰🇷 한국어 (KO)
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 KOICA CONNECT. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-500">
              <Shield className="w-3.5 h-3.5 text-brand-500" />
              Not a social network. No feeds or algorithms.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
