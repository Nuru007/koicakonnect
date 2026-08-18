'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { UserProfile, ProfessionalLink } from '@/lib/types';
import { QRCard } from '@/components/QRCard';
import { translateProfileText } from '@/lib/translations';
import {
  MapPin,
  Globe,
  Linkedin,
  Github,
  Link as LinkIcon,
  Briefcase,
  Sparkles,
  Languages,
  Check,
  Copy,
  Edit3,
  ShieldCheck,
  ArrowLeft,
  Share2,
  ExternalLink,
  Award,
  Layers,
} from 'lucide-react';

export default function PublicProfilePage() {
  const params = useParams();
  const username = params.username as string;
  const router = useRouter();
  const { user: currentUser } = useAuth();
  const { t, language } = useLanguage();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Translation states
  const [translatedBio, setTranslatedBio] = useState<string | null>(null);
  const [translatedRole, setTranslatedRole] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [activeTranslationLang, setActiveTranslationLang] = useState<string | null>(null);

  // Copy notification
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      if (!username) return;
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/users/${username}`);
        if (res.ok) {
          const data = await res.json();
          setProfile(data.profile);
        } else {
          setError(t.profile.notFoundTitle);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(t.profile.notFoundTitle);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [username, t.profile.notFoundTitle]);

  const handleTranslate = async (targetLang: 'en' | 'fr' | 'ko') => {
    if (!profile) return;
    if (activeTranslationLang === targetLang) {
      // Reset translation
      setTranslatedBio(null);
      setTranslatedRole(null);
      setActiveTranslationLang(null);
      return;
    }

    setIsTranslating(true);
    try {
      const [bioTrans, roleTrans] = await Promise.all([
        translateProfileText(profile.bio || '', targetLang),
        translateProfileText(profile.role || '', targetLang),
      ]);
      setTranslatedBio(bioTrans);
      setTranslatedRole(roleTrans);
      setActiveTranslationLang(targetLang);
    } catch (err) {
      console.error('Translation error:', err);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyProfileLink = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] py-16 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-3 border-brand-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-500">Loading professional profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] py-16 px-4">
        <div className="max-w-md mx-auto text-center glass-card rounded-3xl p-10 shadow-sm border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">
            {t.profile.notFoundTitle}
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            {t.profile.notFoundDesc}
          </p>
          <Link
            href="/discover"
            className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.profile.backToDiscover}</span>
          </Link>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === profile.id;
  const linkedInLink = profile.links?.find((l) => l.platform === 'linkedin');
  const websiteLink = profile.links?.find((l) => l.platform === 'website');
  const githubLink = profile.links?.find((l) => l.platform === 'github');
  const portfolioLink = profile.links?.find((l) => l.platform === 'portfolio');
  const otherLinks = profile.links?.filter(
    (l) => !['linkedin', 'website', 'github', 'portfolio'].includes(l.platform)
  ) || [];

  return (
    <div className="min-h-screen bg-[#FAFBFF] py-10 sm:py-16">
      
      {/* Background ambient subtle glow */}
      <div className="hero-glow-bg opacity-70 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Discover</span>
          </Link>

          <div className="flex items-center gap-2">
            {isOwner && (
              <Link
                href="/profile/edit"
                className="btn-secondary py-1.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
            )}
            <button
              onClick={handleCopyProfileLink}
              className="btn-secondary py-1.5 px-3.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedLink ? 'Copied' : 'Share Profile'}</span>
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 bg-white/95 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
            
            {/* Left: Avatar & Bio Identifiers */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              
              {/* Profile Image */}
              {profile.profileImage ? (
                <div className="relative">
                  <img
                    src={profile.profileImage}
                    alt={profile.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl object-cover ring-4 ring-brand-100 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 ring-4 ring-white flex items-center justify-center text-white" title="Verified Profile">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                </div>
              ) : (
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-brand-500 to-brand-400 text-white flex items-center justify-center font-display font-extrabold text-4xl shadow-brand-md">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Identity Details */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight">
                    {profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-brand-50 text-brand-600 border border-brand-200">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                <p className="font-display font-semibold text-lg text-brand-600">
                  {translatedRole || profile.role || 'Professional'}
                </p>

                {profile.organisation && (
                  <p className="text-sm font-medium text-slate-600 flex items-center justify-center sm:justify-start gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span>{profile.organisation}</span>
                  </p>
                )}

                {(profile.country || profile.city) && (
                  <p className="text-xs text-slate-500 flex items-center justify-center sm:justify-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{[profile.city, profile.country].filter(Boolean).join(', ')}</span>
                  </p>
                )}

                {/* Categories badges */}
                {profile.categories.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-2">
                    {profile.categories.map((cat) => (
                      <span
                        key={cat.id}
                        className="badge-pill bg-slate-100 text-slate-700 text-xs py-0.5 px-2.5"
                      >
                        {cat.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: External Networking CTAs (LinkedIn Primary) */}
            <div className="flex flex-col gap-2.5 w-full md:w-64 flex-shrink-0">
              {linkedInLink ? (
                <a
                  href={linkedInLink.url.startsWith('http') ? linkedInLink.url : `https://${linkedInLink.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary py-3.5 px-5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 shadow-brand-md"
                >
                  <Linkedin className="w-4 h-4 fill-current" />
                  <span>{t.profile.viewLinkedIn}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-auto" />
                </a>
              ) : (
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                  <p className="text-xs font-semibold text-slate-500">No LinkedIn URL linked</p>
                </div>
              )}

              {/* Other external links */}
              {websiteLink && (
                <a
                  href={websiteLink.url.startsWith('http') ? websiteLink.url : `https://${websiteLink.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Globe className="w-4 h-4 text-brand-500" />
                  <span className="truncate">{t.profile.personalWebsite}</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                </a>
              )}

              {githubLink && (
                <a
                  href={githubLink.url.startsWith('http') ? githubLink.url : `https://${githubLink.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <Github className="w-4 h-4 text-slate-800" />
                  <span className="truncate">{t.profile.github}</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                </a>
              )}

              {portfolioLink && (
                <a
                  href={portfolioLink.url.startsWith('http') ? portfolioLink.url : `https://${portfolioLink.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <LinkIcon className="w-4 h-4 text-brand-400" />
                  <span className="truncate">{t.profile.portfolio}</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-slate-400" />
                </a>
              )}

              {otherLinks.map((ol, idx) => (
                <a
                  key={idx}
                  href={ol.url.startsWith('http') ? ol.url : `https://${ol.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4 text-slate-500" />
                  <span className="truncate">{ol.title || ol.url}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Translation Viewer Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Languages className="w-4 h-4 text-brand-500" />
              <span className="font-semibold">{t.profile.translateTitle}:</span>
              <span className="text-slate-400">
                ({t.profile.originalLanguage}: {profile.preferredLanguage?.toUpperCase() || 'EN'})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {(['en', 'fr', 'ko'] as const).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => handleTranslate(langCode)}
                  disabled={isTranslating}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTranslationLang === langCode
                      ? 'bg-brand-500 text-white shadow-brand-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {isTranslating && activeTranslationLang === langCode
                    ? t.profile.translating
                    : langCode.toUpperCase()}
                </button>
              ))}

              {activeTranslationLang && (
                <button
                  onClick={() => {
                    setTranslatedBio(null);
                    setTranslatedRole(null);
                    setActiveTranslationLang(null);
                  }}
                  className="text-xs text-rose-500 hover:underline ml-2 font-semibold"
                >
                  {t.profile.resetTranslation}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Content Grid: Left Column Details + Right Column QR Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Info Columns (2 spans) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Bio / About */}
            <div className="glass-card rounded-3xl p-7 border border-slate-200/80 bg-white/95 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {t.profile.aboutTitle}
                </h3>
                {activeTranslationLang && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {t.profile.translatedBadge} ({activeTranslationLang.toUpperCase()})
                  </span>
                )}
              </div>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed whitespace-pre-line">
                {translatedBio || profile.bio || 'No professional bio provided yet.'}
              </p>
            </div>

            {/* Skills (What they can do) */}
            <div className="glass-card rounded-3xl p-7 border border-slate-200/80 bg-white/95 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-brand-500" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {t.profile.skillsTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Verified functional skills and technical capabilities.
              </p>
              {profile.skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="badge-pill text-xs py-1 px-3 bg-brand-50 text-brand-700 font-semibold"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No skills listed yet.</p>
              )}
            </div>

            {/* Areas of Interest (What they care about) */}
            <div className="glass-card rounded-3xl p-7 border border-slate-200/80 bg-white/95 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-cyan-500" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {t.profile.interestsTitle}
                </h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Domains, emerging technologies, and research topics this person is actively exploring.
              </p>
              {profile.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <span
                      key={interest.id}
                      className="badge-pill badge-interest text-xs py-1 px-3"
                    >
                      {interest.name}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">No areas of interest listed yet.</p>
              )}
            </div>

            {/* Languages */}
            <div className="glass-card rounded-3xl p-7 border border-slate-200/80 bg-white/95 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-slate-700" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  {t.profile.languagesTitle}
                </h3>
              </div>
              {profile.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <span
                      key={lang.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700"
                    >
                      <span>{lang.name}</span>
                      <span className="text-[10px] text-slate-400">({lang.code.toUpperCase()})</span>
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">English (Default)</p>
              )}
            </div>
          </div>

          {/* Right Column: QR Digital Identity Card */}
          <div className="lg:col-span-1 space-y-6 sticky top-24">
            <div className="glass-card rounded-3xl p-6 border border-brand-200/60 bg-white/95 shadow-sm">
              <h3 className="font-display font-bold text-base text-slate-900 mb-1">
                {t.profile.qrTitle}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {t.profile.qrDesc}
              </p>
              <QRCard profile={profile} compact />
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
