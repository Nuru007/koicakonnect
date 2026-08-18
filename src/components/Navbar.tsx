'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageCode } from '@/lib/i18n';
import {
  Compass,
  Grid,
  Globe,
  User,
  QrCode,
  LogOut,
  Settings,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Edit3,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const languages: { code: LanguageCode; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-500 to-brand-400 flex items-center justify-center text-white shadow-brand-sm group-hover:shadow-brand-md transition-all">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1">
              KoicaKonnect
              <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse"></span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            href="/discover"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/discover')
                ? 'text-brand-500 bg-brand-50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Compass className="w-4 h-4" />
            {t.nav.discover}
          </Link>
          <Link
            href="/categories"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/categories')
                ? 'text-brand-500 bg-brand-50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Grid className="w-4 h-4" />
            {t.nav.categories}
          </Link>
          <Link
            href="/countries"
            className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              isActive('/countries')
                ? 'text-brand-500 bg-brand-50 font-semibold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            {t.nav.countries}
          </Link>
        </nav>

        {/* Right Action Bar */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Language Switcher */}
          <div className="relative">
            <button
              onClick={() => {
                setLangDropdownOpen(!langDropdownOpen);
                setUserDropdownOpen(false);
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <span>{currentLang.flag}</span>
              <span>{currentLang.code.toUpperCase()}</span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 hover:bg-slate-50 ${
                      language === l.code ? 'text-brand-500 font-bold bg-brand-50/50' : 'text-slate-700'
                    }`}
                  >
                    <span>{l.flag}</span>
                    <span>{l.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Auth State */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => {
                  setUserDropdownOpen(!userDropdownOpen);
                  setLangDropdownOpen(false);
                }}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-300 transition-all bg-white"
              >
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">@{user.username}</p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t.nav.dashboard}
                    </Link>
                    <Link
                      href={`/profile/${user.username}`}
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <User className="w-4 h-4" />
                      {t.nav.myProfile}
                    </Link>
                    <Link
                      href="/profile/edit"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      Edit Profile
                    </Link>
                    <Link
                      href="/dashboard/qr"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <QrCode className="w-4 h-4" />
                      {t.nav.qrCode}
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      {t.nav.settings}
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.nav.signOut}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                href="/signin"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600 transition-colors"
              >
                {t.nav.signIn}
              </Link>
              <Link
                href="/signup"
                className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold"
              >
                {t.nav.createProfile}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/discover"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Compass className="w-4 h-4 text-brand-500" />
              {t.nav.discover}
            </Link>
            <Link
              href="/categories"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Grid className="w-4 h-4 text-brand-500" />
              {t.nav.categories}
            </Link>
            <Link
              href="/countries"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Globe className="w-4 h-4 text-brand-500" />
              {t.nav.countries}
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Language</span>
            <div className="flex gap-1">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className={`px-2.5 py-1 rounded text-xs font-bold ${
                    language === l.code ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {l.code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="w-full btn-secondary text-center block py-2 rounded-xl text-xs font-semibold"
                >
                  {t.nav.dashboard}
                </Link>
                <Link
                  href={`/profile/${user.username}`}
                  onClick={() => setMobileOpen(false)}
                  className="w-full btn-primary text-center block py-2 rounded-xl text-xs font-semibold"
                >
                  {t.nav.myProfile}
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full text-center py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  {t.nav.signOut}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/signin"
                  onClick={() => setMobileOpen(false)}
                  className="btn-secondary text-center py-2 rounded-xl text-xs font-semibold"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary text-center py-2 rounded-xl text-xs font-semibold"
                >
                  {t.nav.createProfile}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
