'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile } from '@/lib/types';
import { MapPin, ArrowUpRight, Globe, Linkedin, Briefcase, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import {
  getLocalizedCategoryName,
  getLocalizedSkillName,
  getLocalizedInterestName,
} from '@/lib/taxonomy-translations';

interface ProfileCardProps {
  profile: UserProfile;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile }) => {
  const { t, language } = useLanguage();
  const { user: currentUser } = useAuth();

  if (!profile) return null;

  const isOwnCard = currentUser?.id === profile.id || currentUser?.username === profile.username;
  const profileHref = profile.username ? `/profile/${profile.username}` : `/profile/${profile.id}`;

  const categories = profile.categories || [];
  const skills = profile.skills || [];
  const interests = profile.interests || [];
  const languages = profile.languages || [];
  const links = profile.links || [];

  const getInitials = (name: string) => {
    const parts = (name || '').trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (name || 'U').slice(0, 2).toUpperCase();
  };

  const locationText = (() => {
    const city = profile.city?.trim();
    const country = profile.country?.trim();
    if (city && country) {
      if (city.toLowerCase().includes(country.toLowerCase())) return city;
      return `${city}, ${country}`;
    }
    return city || country;
  })();

  return (
    <Link
      href={profileHref}
      className="surface-card surface-card-hover rounded-3xl p-6 flex flex-col justify-between relative group bg-white border border-slate-200/90 hover:border-brand-500/60 cursor-pointer block transition-all shadow-xs hover:shadow-md"
    >
      {/* Top Header: Avatar & Main Identifiers */}
      <div>
        <div className="flex items-start gap-4 mb-4">
          {profile.profileImage ? (
            <div className="relative flex-shrink-0">
              <img
                src={profile.profileImage}
                alt={profile.name || 'User'}
                className="w-16 h-16 rounded-2xl object-cover ring-1 ring-slate-200 group-hover:ring-brand-500 group-hover:scale-105 transition-all duration-300 shadow-xs"
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs" title="Verified Profile" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 border border-brand-200 flex items-center justify-center font-display font-bold text-lg shadow-xs group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
              {getInitials(profile.name)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3 className="font-display font-bold text-lg text-slate-900 truncate group-hover:text-brand-600 transition-colors">
                {profile.name}
              </h3>

              {isOwnCard && (
                <span className="px-2 py-0.5 rounded-full bg-brand-50 text-brand-600 text-[10px] font-bold border border-brand-200 flex-shrink-0">
                  {t.common.you}
                </span>
              )}
            </div>
            
            <p className="text-xs font-semibold text-brand-600 truncate mt-0.5">
              {profile.role || 'Professional'}
            </p>

            {profile.organisation && (
              <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                <Briefcase className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{profile.organisation}</span>
              </p>
            )}

            {locationText && (
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1 truncate">
                <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{locationText}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bio preview if available */}
        {profile.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-4 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100 group-hover:border-brand-100 transition-colors">
            {profile.bio}
          </p>
        )}

        {/* Categories Badges */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {categories.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200/80 group-hover:border-brand-200 transition-colors"
              >
                {getLocalizedCategoryName(cat.name, language)}
              </span>
            ))}
            {categories.length > 2 && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-50 text-slate-500">
                +{categories.length - 2}
              </span>
            )}
          </div>
        )}

        {/* Skills Chips */}
        {skills.length > 0 && (
          <div className="mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
              {t.discover.skills}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 3).map((skill) => (
                <span
                  key={skill.id}
                  className="badge-pill text-[11px] py-0.5 px-2 font-medium"
                >
                  {getLocalizedSkillName(skill.name, language)}
                </span>
              ))}
              {skills.length > 3 && (
                <span className="text-[10px] text-slate-500 self-center font-medium">
                  +{skills.length - 3} {t.common.more}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Areas of Interest Chips */}
        {interests.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 block mb-1.5">
              {t.discover.interests}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {interests.slice(0, 2).map((interest) => (
                <span
                  key={interest.id}
                  className="badge-pill badge-interest text-[11px] py-0.5 px-2 font-medium"
                >
                  {getLocalizedInterestName(interest.name, language)}
                </span>
              ))}
              {interests.length > 2 && (
                <span className="text-[10px] text-sky-700 self-center font-medium">
                  +{interests.length - 2}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Languages & Socials */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {languages.length > 0
                ? languages.map((l) => l.code.toUpperCase()).join(', ')
                : 'EN'}
            </span>
          </div>

          {links.find((l) => l.platform === 'linkedin' && l.url) && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const rawUrl = links.find((l) => l.platform === 'linkedin')?.url || '';
                const url = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              className="p-1 rounded-md text-slate-400 hover:text-[#0A66C2] hover:bg-slate-100 transition-colors"
              title={t.profile.viewLinkedIn}
            >
              <Linkedin className="w-3.5 h-3.5 fill-current" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 group-hover:text-brand-600 transition-colors">
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>
    </Link>
  );
};
