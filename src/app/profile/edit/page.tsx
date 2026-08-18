'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Category, Skill, Interest, Language, ProfessionalLink } from '@/lib/types';
import { ProfileCard } from '@/components/ProfileCard';
import { QRCard } from '@/components/QRCard';
import {
  User,
  FileText,
  Award,
  Sparkles,
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
} from 'lucide-react';

export default function ProfileEditPage() {
  const { user, refreshUser, loading: authLoading } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [activeStep, setActiveStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  // Step 3: Categories
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  // Step 4: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // Step 5: Interests
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [customInterestInput, setCustomInterestInput] = useState('');

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

  // Sample avatars
  const sampleAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  ];

  // Populate data when user initially loads (only once per user ID to prevent wiping active edits)
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
        const pf = user.links.find((l) => l.platform === 'portfolio');
        const oth = user.links.find((l) => l.platform === 'other');

        if (li) setLinkedinUrl(li.url);
        if (web) setWebsiteUrl(web.url);
        if (gh) setGithubUrl(gh.url);
        if (pf) setPortfolioUrl(pf.url);
        if (oth) setOtherUrl(oth.url);
      }
    }
  }, [user]);

  // Load taxonomies from DB
  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const res = await fetch('/api/taxonomies');
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

  const handleImageFile = (file: File) => {
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase()) && !file.name.match(/\.(png|jpe?g|webp)$/i)) {
      setError('Please upload a PNG, JPG, or JPEG image format');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Image file must be under 10MB');
      return;
    }

    setError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize and crop to square avatar with high quality
        const canvas = document.createElement('canvas');
        const maxDim = 500;
        const width = img.width;
        const height = img.height;
        
        // Center crop to square
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
    setError(null);
    setSavedSuccess(false);

    const targetStatus = newStatus || status;

    // Client-side validation before publishing
    if (targetStatus === 'published') {
      if (!name || !name.trim()) {
        setError('Please provide your Full Name in Step 1 before publishing.');
        setActiveStep(1);
        return false;
      }
      if (!role || !role.trim()) {
        setError('Please provide your Current Role / Profession in Step 1 before publishing.');
        setActiveStep(1);
        return false;
      }
    }

    setSaving(true);

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
        setSavedSuccess(true);
        await refreshUser();
        setTimeout(() => setSavedSuccess(false), 4000);
        return true;
      } else {
        const errorMsg = data.error?.message || data.error || 'Failed to save changes. Please try again.';
        setError(errorMsg);
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'Network error. Your changes have not been lost, please try again.');
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
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    );
  };

  // Construct preview profile object
  const previewProfile = {
    id: user?.id || 'preview_id',
    name: name || 'Your Name',
    email: user?.email || '',
    username: username || 'your-handle',
    role: role || 'Your Profession / Role',
    organisation: organisation || 'Your Organisation',
    country: country || 'Country',
    city: city || 'City',
    bio: bio || 'Your bio will appear here...',
    profileImage: profileImage || '',
    preferredLanguage: preferredLanguage || 'en',
    status: status,
    createdAt: new Date().toISOString(),
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
    ].filter(Boolean) as ProfessionalLink[],
  };

  const steps = [
    { id: 1, title: 'Basic Info', icon: User },
    { id: 2, title: 'About & Bio', icon: FileText },
    { id: 3, title: 'Skills', icon: Award },
    { id: 4, title: 'Interests', icon: Sparkles },
    { id: 5, title: 'Categories', icon: Grid },
    { id: 6, title: 'Languages', icon: Globe },
    { id: 7, title: 'Links', icon: LinkIcon },
    { id: 8, title: 'Preview & Publish', icon: Eye },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#FAFBFF] py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push('/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAFBFF] py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Profile Builder
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Build your digital identity and make yourself discoverable globally
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="btn-secondary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600">Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? 'Saving...' : 'Save Draft'}</span>
                </>
              )}
            </button>

            {status === 'published' ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Published & Live
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
                Draft (Private)
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
                {status === 'published' ? 'Your profile is live' : 'Your profile is private'}
              </p>
              <p className="text-[11px] opacity-80 mt-0.5">
                {status === 'published'
                  ? 'People can now discover your profile on Koica Connect.'
                  : 'Complete your profile and publish it to appear on Discover.'}
              </p>
            </div>
          </div>
          {status !== 'published' ? (
            <button
              onClick={() => setActiveStep(8)}
              className="btn-primary py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap"
            >
              Publish Now
            </button>
          ) : (
            <Link
              href={`/profile/${username || user?.username}`}
              className="btn-secondary py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1"
            >
              <span>View Live Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              {status === 'published'
                ? 'Profile published successfully! Your profile is now live on Discover.'
                : 'Profile draft saved successfully.'}
            </span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Step Progress Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {steps.map((s) => {
            const Icon = s.icon;
            const isCurrent = activeStep === s.id;
            const isCompleted = activeStep > s.id;

            return (
              <button
                key={s.id}
                onClick={() => setActiveStep(s.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  isCurrent
                    ? 'bg-brand-500 text-white shadow-brand-sm'
                    : isCompleted
                    ? 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{s.id}. {s.title}</span>
              </button>
            );
          })}
        </div>

        {/* Step Form Container */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200/80 bg-white shadow-sm mb-8">
          
          {/* STEP 1: Basic Information */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Step 1 — Basic Information</h3>
                <p className="text-xs text-slate-500">Your core professional identifiers</p>
              </div>

              {/* Headshot PNG / JPG File Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Headshot Photo (PNG, JPG)
                </label>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Avatar Preview */}
                  {profileImage ? (
                    <div className="relative group">
                      <img
                        src={profileImage}
                        alt="Headshot"
                        className="w-28 h-28 rounded-3xl object-cover ring-4 ring-brand-100 shadow-md transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setProfileImage('')}
                        title="Remove Photo"
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-3xl bg-brand-50/80 border-2 border-dashed border-brand-200 flex flex-col items-center justify-center text-brand-500 text-xs font-semibold shadow-inner">
                      <Camera className="w-8 h-8 mb-1 opacity-75" />
                      <span>No photo</span>
                    </div>
                  )}

                  {/* Drag-and-Drop & File Picker Zone */}
                  <div className="flex-1 w-full">
                    <label
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                          handleImageFile(e.dataTransfer.files[0]);
                        }
                      }}
                      className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-brand-500 hover:bg-brand-50/30 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-all bg-slate-50/60 group block"
                    >
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg, image/webp"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageFile(e.target.files[0]);
                          }
                        }}
                      />
                      <div className="w-10 h-10 rounded-2xl bg-white text-brand-500 shadow-sm flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                        <Camera className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 mb-0.5">
                        <span className="text-brand-600">Click to upload</span> or drag & drop photo
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Supports PNG, JPG, or JPEG (Max 10MB)
                      </p>
                    </label>

                    {profileImage && (
                      <p className="text-[11px] text-emerald-600 font-semibold mt-2 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Photo selected and ready
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Username / Handle
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-xs font-mono text-slate-400">
                      @
                    </span>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:bg-white focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center justify-between">
                    <span>Account Email</span>
                    <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user?.email || ''}
                    className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
                    title="Account email stored in Supabase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Current Role / Profession *
                  </label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. AI Research Scientist, Product Lead"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Organisation
                  </label>
                  <input
                    type="text"
                    value={organisation}
                    onChange={(e) => setOrganisation(e.target.value)}
                    placeholder="e.g. DeepMind, Acme Robotics, Stanford"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United Kingdom, United States, France"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. London, San Francisco, Paris, Seoul"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: About / Bio */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Step 2 — Professional Bio</h3>
                <p className="text-xs text-slate-500">Provide a concise summary of your work, background, and what you build</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  About You
                </label>
                <textarea
                  rows={6}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Share your focus area, what problems you solve, recent projects, or technical expertise..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all leading-relaxed"
                />
                <p className="text-[11px] text-slate-400 mt-1">Recommended: 2 to 4 sentences.</p>
              </div>
            </div>
          )}

          {/* STEP 3: Skills */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Step 3 — Functional Skills</h3>
                <p className="text-xs text-slate-500">What you can actually do and deliver (tools, engineering, disciplines)</p>
              </div>

              {/* Add custom skill input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomSkill(); } }}
                  placeholder="Type a skill and press Add (e.g. Python, PCB Design, Robotics)..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Selected skills list */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Your Selected Skills ({selectedSkills.length})
                </label>
                <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {selectedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="badge-pill bg-brand-500 text-white shadow-sm text-xs py-1 px-3 flex items-center gap-1.5"
                    >
                      <span>{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-rose-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {selectedSkills.length === 0 && (
                    <span className="text-xs text-slate-400 italic">No skills selected yet. Choose from below or add custom skills.</span>
                  )}
                </div>
              </div>

              {/* Suggestions from DB Taxonomies */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  Popular Suggestions from Platform
                </label>
                <div className="flex flex-wrap gap-1.5">
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
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-brand-500 text-white shadow-sm font-bold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {isSelected ? `✓ ${s.name}` : `+ ${s.name}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Areas of Interest */}
          {activeStep === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Step 4 — Areas of Interest</h3>
                <p className="text-xs text-slate-500">What you care about, research, or want to explore with others</p>
              </div>

              {/* Add custom interest */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInterestInput}
                  onChange={(e) => setCustomInterestInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomInterest(); } }}
                  placeholder="Type an interest (e.g. Artificial Intelligence, Climate Tech, Quantum Computing)..."
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                />
                <button
                  type="button"
                  onClick={addCustomInterest}
                  className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Selected Interests */}
              <div>
                <label className="block text-xs font-bold text-cyan-700 mb-2 uppercase tracking-wider">
                  Your Selected Areas of Interest ({selectedInterests.length})
                </label>
                <div className="flex flex-wrap gap-2 min-h-[48px] p-3 bg-cyan-50/50 rounded-2xl border border-cyan-100">
                  {selectedInterests.map((interest) => (
                    <span
                      key={interest}
                      className="badge-pill bg-brand-400 text-white shadow-sm text-xs py-1 px-3 flex items-center gap-1.5"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={() => removeInterest(interest)}
                        className="hover:text-rose-200"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                  {selectedInterests.length === 0 && (
                    <span className="text-xs text-cyan-600 italic">No interests selected yet.</span>
                  )}
                </div>
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                  Platform Interest Taxonomies
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableInterests.map((i) => {
                    const isSelected = selectedInterests.includes(i.name);
                    return (
                      <button
                        key={i.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) removeInterest(i.name);
                          else setSelectedInterests(prev => [...prev, i.name]);
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-brand-400 text-white shadow-sm font-bold'
                            : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800'
                        }`}
                      >
                        {isSelected ? `✓ ${i.name}` : `+ ${i.name}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Categories */}
          {activeStep === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Step 5 — Industry Categories</h3>
                <p className="text-xs text-slate-500">Select one or more industries you belong to (stored in relational database)</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableCategories.map((cat) => {
                  const isSelected = selectedCategoryIds.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-brand-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-xs truncate">{cat.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-brand-500 flex-shrink-0" />}
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
                <h3 className="font-display font-bold text-xl text-slate-900">Step 6 — Languages</h3>
                <p className="text-xs text-slate-500">Select languages you speak or write in</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {availableLanguages.map((lang) => {
                  const isSelected = selectedLanguages.includes(lang.code);
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => toggleLanguage(lang.code)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-brand-50 border-brand-500 ring-2 ring-brand-500/20 text-brand-700 font-bold'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-xs font-semibold">{lang.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-brand-500 flex-shrink-0" />}
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
                <h3 className="font-display font-bold text-xl text-slate-900">Step 7 — Professional Links</h3>
                <p className="text-xs text-slate-500">
                  Where people can connect with you externally (LinkedIn is the primary destination)
                </p>
              </div>

              {/* LinkedIn (Highlighted Primary) */}
              <div className="p-4 bg-brand-50/70 rounded-2xl border border-brand-200 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-700 uppercase tracking-wider">
                  <Linkedin className="w-4 h-4 fill-current" />
                  <span>LinkedIn Profile URL (Recommended Primary)</span>
                </div>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="w-full px-4 py-2.5 bg-white border border-brand-300 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              {/* Personal Website */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Personal Website / Blog
                </label>
                <input
                  type="url"
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  placeholder="https://yourname.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                />
              </div>

              {/* GitHub */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  GitHub Profile
                </label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/yourusername"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                />
              </div>

              {/* Portfolio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Portfolio / Behance / Dribbble / Scholar
                </label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://scholar.google.com/... or portfolio link"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* STEP 8: Preview & Publish */}
          {activeStep === 8 && (
            <div className="space-y-8">
              <div>
                <h3 className="font-display font-bold text-xl text-slate-900">Step 8 — Live Profile Preview & Publish</h3>
                <p className="text-xs text-slate-500">Review how your profile and digital pass will appear to the world</p>
              </div>

              {/* Live Preview Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Discover Card Preview
                  </h4>
                  <ProfileCard profile={previewProfile as any} />
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Digital QR Identity Card Preview
                  </h4>
                  <QRCard profile={previewProfile as any} compact />
                </div>
              </div>

              {/* Publish / Visibility Action Banner */}
              <div className="p-6 bg-gradient-to-r from-brand-50 to-cyan-50 rounded-3xl border border-brand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900">
                    Ready to make your profile live?
                  </h4>
                  <p className="text-xs text-slate-600">
                    Publishing immediately makes you discoverable across skills, categories, and keywords.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {status !== 'published' ? (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() => handleSave('published')}
                      className="btn-primary px-6 py-3 rounded-xl text-xs font-bold flex items-center gap-2 shadow-brand-md"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{saving ? 'Publishing...' : 'Publish Profile Now'}</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                        <Check className="w-4 h-4" /> Published & Live
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSave('draft')}
                        className="btn-secondary px-3 py-2 rounded-xl text-xs font-semibold text-slate-600"
                      >
                        Unpublish to Draft
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
                onClick={() => setActiveStep(prev => prev - 1)}
                className="btn-secondary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous Step</span>
              </button>
            ) : (
              <div />
            )}

            {activeStep < 8 ? (
              <button
                type="button"
                disabled={saving}
                onClick={async () => {
                  const success = await handleSave();
                  if (success !== false) {
                    setActiveStep(prev => prev + 1);
                  }
                }}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-brand-sm disabled:opacity-50"
              >
                <span>{saving ? 'Saving...' : 'Save & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <Link
                href={`/profile/${username || user.username}`}
                className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-brand-sm"
              >
                <span>View Public Profile</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
