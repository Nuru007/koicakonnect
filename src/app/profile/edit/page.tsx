'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Category, Skill, Interest, Language, ProfessionalLink, UserProfile } from '@/lib/types';
import { ProfileCard } from '@/components/ProfileCard';
import { QRCard } from '@/components/QRCard';
import {
  User,
  FileText,
  Award,
  Grid,
  Globe,
  Link as LinkIcon,
  Eye,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  Linkedin,
  Github,
  Save,
  Check,
  Camera,
  AlertCircle,
  ChevronDown,
  Lightbulb,
  Clock,
} from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';

export default function ProfileEditPage() {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Guard to ensure initial state from DB is only populated once per user session
  const loadedUserIdRef = useRef<string | null>(null);

  // Step 1: Basic Information
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [organisation, setOrganisation] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [profileImage, setProfileImage] = useState('');

  // Step 2: About & Bio
  const [bio, setBio] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');

  // Step 3: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Step 4: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterestInput, setCustomInterestInput] = useState('');

  // Step 5: Categories / Focus Disciplines
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Step 6: Languages
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(['en']);

  // Step 7: Professional Links
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [otherUrl, setOtherUrl] = useState('');

  // Status
  const [status, setStatus] = useState<'draft' | 'published' | 'private'>('draft');

  // Taxonomies from DB
  const [availableCategories, setAvailableCategories] = useState<Category[]>([]);
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [availableInterests, setAvailableInterests] = useState<Interest[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);

  // Populate data when user initially loads (Hydration Guard)
  useEffect(() => {
    if (user && loadedUserIdRef.current !== user.id) {
      loadedUserIdRef.current = user.id;
      setName(user.name || '');
      setUsername(user.username || '');
      setRole(user.role || '');
      setOrganisation(user.organisation || '');
      setCountry(user.country || '');
      setCity(user.city || '');
      setProfileImage(user.profileImage || '');
      setBio(user.bio || '');
      setPreferredLanguage(user.preferredLanguage || 'en');
      setStatus(user.status || 'draft');

      if (user.categories && user.categories.length > 0) {
        setSelectedCategoryIds(user.categories.map((c) => c.id));
      }
      if (user.skills && user.skills.length > 0) {
        setSelectedSkills(user.skills.map((s) => s.name));
      }
      if (user.interests && user.interests.length > 0) {
        setSelectedInterests(user.interests.map((i) => i.name));
      }
      if (user.languages && user.languages.length > 0) {
        setSelectedLanguages(user.languages.map((l) => l.code));
      }
      if (user.links && user.links.length > 0) {
        const li = user.links.find((l) => l.platform === 'linkedin');
        const web = user.links.find((l) => l.platform === 'website');
        const gh = user.links.find((l) => l.platform === 'github');
        const port = user.links.find((l) => l.platform === 'portfolio');
        const oth = user.links.find((l) => l.platform === 'other');
        if (li) setLinkedinUrl(li.url);
        if (web) setWebsiteUrl(web.url);
        if (gh) setGithubUrl(gh.url);
        if (port) setPortfolioUrl(port.url);
        if (oth) setOtherUrl(oth.url);
      }

      setIsHydrated(true);
    }
  }, [user]);

  // Load taxonomies
  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const res = await fetch('/api/taxonomies', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setAvailableCategories(data.categories || []);
          setAvailableSkills(data.skills || []);
          setAvailableInterests(data.interests || []);
          setAvailableLanguages(data.languages || []);
        }
      } catch (err) {
        console.error('Failed to load taxonomies:', err);
      }
    }
    loadTaxonomies();
  }, []);

  // Image Upload handler with client-side resize and compression
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (PNG, JPG, JPEG, WEBP).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setError(`Image file is too large (${sizeMB}MB). Maximum file size is 10MB.`);
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 500;
        const width = img.width;
        const height = img.height;
        
        const minSide = Math.min(width, height);
        const startX = (width - minSide) / 2;
        const startY = (height - minSide) / 2;

        const targetDim = Math.min(minSide, maxDim);
        canvas.width = targetDim;
        canvas.height = targetDim;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, startX, startY, minSide, minSide, 0, 0, targetDim, targetDim);
          const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.92);
          setProfileImage(dataUrl);
        } else {
          setProfileImage(event.target?.result as string);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (newStatus?: 'draft' | 'published' | 'private'): Promise<boolean> => {
    if (!isHydrated) return false;

    setError(null);
    setSaveStatus('saving');
    setSaving(true);

    const targetStatus = newStatus || status || 'draft';

    if (targetStatus === 'published') {
      if (!name || !name.trim()) {
        setError('Please provide your Full Name in Step 1 before publishing.');
        setActiveStep(1);
        setSaveStatus('error');
        setSaving(false);
        return false;
      }
      if (!role || !role.trim()) {
        setError('Please provide your Current Role / Profession in Step 1 before publishing.');
        setActiveStep(1);
        setSaveStatus('error');
        setSaving(false);
        return false;
      }
    }

    try {
      const linksPayload: ProfessionalLink[] = [];
      if (linkedinUrl.trim()) linksPayload.push({ platform: 'linkedin', url: linkedinUrl.trim() });
      if (websiteUrl.trim()) linksPayload.push({ platform: 'website', url: websiteUrl.trim() });
      if (githubUrl.trim()) linksPayload.push({ platform: 'github', url: githubUrl.trim() });
      if (portfolioUrl.trim()) linksPayload.push({ platform: 'portfolio', url: portfolioUrl.trim() });
      if (otherUrl.trim()) linksPayload.push({ platform: 'other', url: otherUrl.trim() });

      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          username,
          role,
          organisation,
          country,
          city,
          profileImage,
          bio,
          preferredLanguage,
          status: targetStatus,
          isDiscoverable: targetStatus === 'published',
          categoryIds: selectedCategoryIds,
          skills: selectedSkills,
          interests: selectedInterests,
          languageCodes: selectedLanguages,
          links: linksPayload,
        }),
      });

      const data = await res.json();
      const updatedProfile = data.data?.profile || data.profile;

      if (res.ok && data.success && updatedProfile) {
        setStatus(updatedProfile.status || targetStatus);
        if (updatedProfile.profileImage) {
          setProfileImage(updatedProfile.profileImage);
        }
        setSaveStatus('saved');
        setLastSavedTime(new Date());
        await refreshUser();
        setTimeout(() => {
          setSaveStatus((prev) => (prev === 'saved' ? 'idle' : prev));
        }, 3500);
        return true;
      } else {
        const errorMsg = data.error?.message || data.error || t.profileBuilder.saveError;
        setError(errorMsg);
        setSaveStatus('error');
        return false;
      }
    } catch (err: any) {
      setError(err.message || t.profileBuilder.saveError);
      setSaveStatus('error');
      return false;
    } finally {
      setSaving(false);
    }
  };

  const addCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills(prev => [...prev, customSkillInput.trim()]);
      setCustomSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const addCustomInterest = () => {
    if (customInterestInput.trim() && !selectedInterests.includes(customInterestInput.trim())) {
      setSelectedInterests(prev => [...prev, customInterestInput.trim()]);
      setCustomInterestInput('');
    }
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(prev => prev.filter(i => i !== interest));
  };

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter(l => l !== code) : prev
        : [...prev, code]
    );
  };

  // Preview profile state for Step 8 live simulation
  const previewProfile = useMemo((): UserProfile => ({
    id: user?.id || 'preview',
    username: username || user?.username || 'user',
    email: user?.email || '',
    name: name || user?.name || 'Your Full Name',
    role: role || 'Your Profession',
    organisation: organisation || '',
    country: country || '',
    city: city || '',
    bio: bio || '',
    profileImage: profileImage || '',
    preferredLanguage: preferredLanguage || 'en',
    status: status || 'draft',
    isDiscoverable: status === 'published',
    createdAt: user?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    categories: availableCategories.filter(c => selectedCategoryIds.includes(c.id)),
    skills: selectedSkills.map((s, i) => ({ id: `s_${i}`, name: s, slug: s.toLowerCase() })),
    interests: selectedInterests.map((int, i) => ({ id: `i_${i}`, name: int, slug: int.toLowerCase() })),
    languages: availableLanguages.filter(l => selectedLanguages.includes(l.code)),
    links: [
      linkedinUrl ? { platform: 'linkedin' as const, url: linkedinUrl } : null,
      websiteUrl ? { platform: 'website' as const, url: websiteUrl } : null,
      githubUrl ? { platform: 'github' as const, url: githubUrl } : null,
      portfolioUrl ? { platform: 'portfolio' as const, url: portfolioUrl } : null,
      otherUrl ? { platform: 'other' as const, url: otherUrl } : null,
    ].filter(Boolean) as ProfessionalLink[],
  }), [
    user, name, username, role, organisation, country, city, bio, profileImage,
    preferredLanguage, status, availableCategories, selectedCategoryIds, selectedSkills,
    selectedInterests, availableLanguages, selectedLanguages, linkedinUrl, websiteUrl,
    githubUrl, portfolioUrl, otherUrl,
  ]);

  const steps = [
    { id: 1, title: 'Basic Info', icon: User },
    { id: 2, title: 'About & Bio', icon: FileText },
    { id: 3, title: 'Skills', icon: Award },
    { id: 4, title: 'Interests', icon: Lightbulb },
    { id: 5, title: 'Categories', icon: Grid },
    { id: 6, title: 'Languages', icon: Globe },
    { id: 7, title: 'Links', icon: LinkIcon },
    { id: 8, title: 'Preview & Publish', icon: Eye },
  ];

  if (authLoading || (!isHydrated && user)) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-500">{t.common.loading}</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] py-20 flex flex-col items-center justify-center text-center px-4">
        <div className="surface-card rounded-3xl p-8 max-w-md w-full border border-slate-200 bg-white shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 mb-2">{t.profileBuilder.signInRequiredTitle}</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            {t.profileBuilder.signInRequiredDesc}
          </p>
          <Link href="/signin" className="btn-primary w-full py-3 rounded-xl text-xs font-bold block text-center shadow-brand-sm">
            {t.profileBuilder.signInToBuilderBtn}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              {t.profileBuilder.pageTitle}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {t.profileBuilder.pageSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Draft Status Indicator */}
            <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-xs">
              {saveStatus === 'saving' ? (
                <>
                  <div className="w-3 h-3 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
                  <span>{t.profileBuilder.savingBtn}</span>
                </>
              ) : saveStatus === 'saved' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">{t.common.savedCheck}</span>
                </>
              ) : saveStatus === 'error' ? (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                  <span className="text-rose-600 font-semibold">{t.profileBuilder.saveError}</span>
                </>
              ) : lastSavedTime ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{t.common.lastSaved} {lastSavedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </>
              ) : (
                <span>{t.profileBuilder.draftPrivateBadge}</span>
              )}
            </div>

            {/* Explicit Save Draft Button */}
            <button
              type="button"
              onClick={() => handleSave('draft')}
              disabled={saving || !isHydrated}
              className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? t.profileBuilder.savingBtn : t.profileBuilder.saveDraftBtn}</span>
            </button>

            {status === 'published' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {t.profileBuilder.publishedLiveBadge}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                {t.profileBuilder.draftPrivateBadge}
              </span>
            )}
          </div>
        </div>

        {/* Visibility State Explainer Banner */}
        <div className={`mb-6 p-4 rounded-2xl text-xs font-medium flex items-center justify-between gap-3 border ${
          status === 'published'
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/80 border-amber-200 text-amber-900'
        }`}>
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div>
              <p className="font-bold text-xs">
                {status === 'published' ? t.profileBuilder.publishedBannerTitle : t.profileBuilder.draftBannerTitle}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {status === 'published'
                  ? t.profileBuilder.publishedBannerDesc
                  : t.profileBuilder.draftBannerDesc}
              </p>
            </div>
          </div>

          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/70 border border-current">
            {t.profileBuilder.stepOf.replace('{step}', String(activeStep))}
          </span>
        </div>

        {/* Wizard Card */}
        <div className="surface-card rounded-3xl p-6 sm:p-10 border border-slate-200 bg-white shadow-xs relative">
          
          {/* Stepper Navigation */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-10 pb-6 border-b border-slate-100">
            {steps.map((step) => {
              const Icon = step.icon;
              const isCurrent = activeStep === step.id;
              const isPast = activeStep > step.id;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={async () => {
                    if (isHydrated) {
                      await handleSave('draft');
                    }
                    setActiveStep(step.id);
                  }}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-2xl transition-all text-center ${
                    isCurrent
                      ? 'bg-brand-50 text-brand-600 font-bold ring-1 ring-brand-500/20'
                      : isPast
                      ? 'text-slate-600 hover:bg-slate-50'
                      : 'text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-brand-500 text-white shadow-brand-sm'
                        : isPast
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                  </div>
                  <span className="text-[10px] truncate max-w-full font-semibold">
                    {step.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between gap-3 animate-in fade-in duration-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{error}</span>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="text-rose-500 hover:text-rose-700 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* STEP 1: Basic Information */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">{t.profileBuilder.step1Title}</h3>
                <p className="text-xs text-slate-500">{t.profileBuilder.step1Subtitle}</p>
              </div>

              {/* Headshot Upload */}
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.profileBuilder.headshotLabel}
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative group flex-shrink-0">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Headshot Preview"
                        className="w-24 h-24 rounded-2xl object-cover ring-2 ring-brand-500/40 shadow-xs"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-brand-50 border-2 border-dashed border-brand-200 flex items-center justify-center text-brand-600">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                    {profileImage && (
                      <button
                        type="button"
                        onClick={() => setProfileImage('')}
                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-full shadow-sm hover:bg-rose-600 transition-colors"
                        title="Remove photo"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 text-center sm:text-left">
                    <label className="btn-primary py-2 px-4 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-brand-sm">
                      <Camera className="w-3.5 h-3.5" />
                      <span>{t.profileBuilder.uploadPhotoBtn}</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageFile(file);
                        }}
                      />
                    </label>
                    <p className="text-[11px] text-slate-500">
                      {t.profileBuilder.photoTip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Name & Username */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    {t.profileBuilder.fullNameLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.profileBuilder.fullNamePlaceholder}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    {t.profileBuilder.usernameLabel}
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs font-bold text-slate-400">@</span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ''))}
                      placeholder="username"
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Role & Organisation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    {t.profileBuilder.roleLabel} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder={t.profileBuilder.rolePlaceholder}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    {t.profileBuilder.orgLabel}
                  </label>
                  <input
                    type="text"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    placeholder={t.profileBuilder.orgPlaceholder}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>
              </div>

              {/* Country & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    {t.profileBuilder.countryLabel} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all appearance-none cursor-pointer"
                    >
                      <option value="">{t.profileBuilder.selectCountry}</option>
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    {t.profileBuilder.cityLabel}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder={t.profileBuilder.cityPlaceholder}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: About & Bio */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">{t.profileBuilder.step2Title}</h3>
                <p className="text-xs text-slate-500">{t.profileBuilder.step2Subtitle}</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  {t.profileBuilder.bioLabel}
                </label>
                <textarea
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder={t.profileBuilder.bioPlaceholder}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  {t.profileBuilder.bioTip}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  {t.profileBuilder.preferredLangLabel}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { code: 'en', label: 'English (EN)' },
                    { code: 'fr', label: 'Français (FR)' },
                    { code: 'ko', label: '한국어 (KO)' },
                  ].map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setPreferredLanguage(lang.code)}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        preferredLanguage === lang.code
                          ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Skills & Expertise */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">{t.profileBuilder.step3Title}</h3>
                <p className="text-xs text-slate-500">{t.profileBuilder.step3Subtitle}</p>
              </div>

              {/* Selected Skills Chips */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-[80px]">
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                  {t.profileBuilder.selectedSkillsTitle} ({selectedSkills.length})
                </label>
                {selectedSkills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700 border border-brand-200 animate-in zoom-in-95 duration-150"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="text-brand-400 hover:text-brand-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    {t.profileBuilder.noSkillsYet}
                  </p>
                )}
              </div>

              {/* Custom Skill Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  {t.profileBuilder.addCustomSkillLabel}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomSkill();
                      }
                    }}
                    placeholder={t.profileBuilder.addCustomSkillPlaceholder}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addCustomSkill}
                    disabled={!customSkillInput.trim()}
                    className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.profileBuilder.addBtn}</span>
                  </button>
                </div>
              </div>

              {/* Recommended Taxonomy Skills */}
              {availableSkills.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    {t.profileBuilder.suggestedSkills}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((s) => {
                      const isSelected = selectedSkills.includes(s.name);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) removeSkill(s.name);
                            else setSelectedSkills(prev => [...prev, s.name]);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-brand-500 text-white shadow-brand-sm'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {isSelected ? `✓ ${s.name}` : `+ ${s.name}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Areas of Interest */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">{t.profileBuilder.step4Title}</h3>
                <p className="text-xs text-slate-500">{t.profileBuilder.step4Subtitle}</p>
              </div>

              {/* Selected Interests Chips */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 min-h-[80px]">
                <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                  {t.profileBuilder.selectedInterestsTitle} ({selectedInterests.length})
                </label>
                {selectedInterests.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedInterests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-800 border border-sky-200 animate-in zoom-in-95 duration-150"
                      >
                        <span>{interest}</span>
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="text-sky-400 hover:text-sky-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">
                    {t.profileBuilder.noInterestsYet}
                  </p>
                )}
              </div>

              {/* Custom Interest Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  {t.profileBuilder.addCustomInterestLabel}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customInterestInput}
                    onChange={(e) => setCustomInterestInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomInterest();
                      }
                    }}
                    placeholder={t.profileBuilder.addCustomInterestPlaceholder}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={addCustomInterest}
                    disabled={!customInterestInput.trim()}
                    className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{t.profileBuilder.addBtn}</span>
                  </button>
                </div>
              </div>

              {/* Suggested Interests */}
              {availableInterests.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                    {t.profileBuilder.suggestedInterests}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {availableInterests.map((int) => {
                      const isSelected = selectedInterests.includes(int.name);
                      return (
                        <button
                          key={int.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) removeInterest(int.name);
                            else setSelectedInterests(prev => [...prev, int.name]);
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-sky-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                          }`}
                        >
                          {isSelected ? `✓ ${int.name}` : `+ ${int.name}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Categories / Focus Disciplines */}
          {activeStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">{t.profileBuilder.step5Title}</h3>
                <p className="text-xs text-slate-500">{t.profileBuilder.step5Subtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableCategories.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-brand-900'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <p className="font-display font-bold text-sm">{cat.name}</p>
                        {cat.description && (
                          <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{cat.description}</p>
                        )}
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected ? 'bg-brand-500 text-white' : 'border border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 6: Languages */}
          {activeStep === 6 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">{t.profileBuilder.step6Title}</h3>
                <p className="text-xs text-slate-500">{t.profileBuilder.step6Subtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {availableLanguages.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang.code);
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => toggleLanguage(lang.code)}
                      className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-brand-900 font-bold'
                          : 'bg-slate-50 border-slate-200/80 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        <span className="text-sm">{lang.name}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-brand-500 text-white' : 'border border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 7: Professional Links */}
          {activeStep === 7 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">{t.profileBuilder.step7Title}</h3>
                <p className="text-xs text-slate-500">{t.profileBuilder.step7Subtitle}</p>
              </div>

              <div className="space-y-4">
                {/* LinkedIn */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Linkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
                    <span>{t.profileBuilder.linkedinLabel}</span>
                  </label>
                  <input
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>

                {/* Personal / Company Website */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.profileBuilder.websiteLabel}</span>
                  </label>
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourorganization.org"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>

                {/* GitHub */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <Github className="w-3.5 h-3.5 text-slate-700" />
                    <span>{t.profileBuilder.githubLabel}</span>
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/yourhandle"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>

                {/* Portfolio */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                    <LinkIcon className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t.profileBuilder.portfolioLabel}</span>
                  </label>
                  <input
                    type="url"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    placeholder="https://scholar.google.com/citations?user=..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Preview & Publish */}
          {activeStep === 8 && (
            <div className="space-y-8">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">{t.profileBuilder.step8Title}</h3>
                <p className="text-xs text-slate-500">{t.profileBuilder.step8Subtitle}</p>
              </div>

              {/* Live Preview Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    {t.profileBuilder.discoverCardPreview}
                  </h4>
                  <ProfileCard profile={previewProfile as any} />
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    {t.profileBuilder.qrCardPreview}
                  </h4>
                  <QRCard profile={previewProfile as any} compact />
                </div>
              </div>

              {/* Publish / Visibility Action Banner */}
              <div className="p-6 bg-gradient-to-r from-brand-50 to-cyan-50 rounded-3xl border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900">
                    {t.profileBuilder.readyToPublishTitle}
                  </h4>
                  <p className="text-xs text-slate-600">
                    {t.profileBuilder.readyToPublishDesc}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {status !== 'published' ? (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSave('published')}
                      className="btn-primary px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-brand-sm disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{saving ? t.profileBuilder.savingBtn : t.profileBuilder.publishNowBtn}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> {t.profileBuilder.publishedLiveBadge}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSave('draft')}
                        disabled={saving}
                        className="btn-secondary px-3 py-2 rounded-xl text-xs font-semibold text-slate-600"
                      >
                        {t.profileBuilder.unpublishBtn}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Stepper Navigation Buttons */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-between mt-8">
            {activeStep > 1 ? (
              <button
                type="button"
                onClick={async () => {
                  if (isHydrated) {
                    await handleSave('draft');
                  }
                  setActiveStep(prev => prev - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.profileBuilder.previousStepBtn}</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              {/* Secondary Save Draft Button in footer */}
              <button
                type="button"
                onClick={() => handleSave('draft')}
                disabled={saving || !isHydrated}
                className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{t.profileBuilder.saveDraftBtn}</span>
              </button>

              {activeStep < 8 ? (
                <button
                  type="button"
                  disabled={saving || !isHydrated}
                  onClick={async () => {
                    const success = await handleSave('draft');
                    if (success !== false) {
                      setActiveStep(prev => prev + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-brand-sm disabled:opacity-50"
                >
                  <span>{saving ? t.profileBuilder.savingBtn : t.profileBuilder.saveAndContinueBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <Link
                  href={`/profile/${username || user.username}`}
                  className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-brand-sm"
                >
                  <span>{t.profileBuilder.viewPublicProfileBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
