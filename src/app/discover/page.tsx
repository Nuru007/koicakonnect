'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { UserProfile, Category, Skill, Interest, Language } from '@/lib/types';
import { ProfileCard } from '@/components/ProfileCard';
import { EmptyState } from '@/components/EmptyState';
import { getCountryFlag, getCountryFlagImg, normalizeCountry } from '@/lib/countries';
import {
  Search,
  Filter,
  X,
  RotateCcw,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Compass,
  Users,
  Check,
} from 'lucide-react';

function DiscoverContent() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search & Filter state
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    searchParams.get('category') ? searchParams.get('category')!.split(',').filter(Boolean) : []
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    searchParams.get('skill') ? searchParams.get('skill')!.split(',').filter(Boolean) : []
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    searchParams.get('interest') ? searchParams.get('interest')!.split(',').filter(Boolean) : []
  );
  const [selectedCountries, setSelectedCountries] = useState<string[]>(
    searchParams.get('country') ? searchParams.get('country')!.split(',').filter(Boolean) : []
  );
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(
    searchParams.get('language') ? searchParams.get('language')!.split(',').filter(Boolean) : []
  );

  // Synchronize filter state whenever searchParams in the URL change
  useEffect(() => {
    const qParam = searchParams.get('q') || '';
    const catParam = searchParams.get('category');
    const skillParam = searchParams.get('skill');
    const intParam = searchParams.get('interest');
    const countryParam = searchParams.get('country');
    const langParam = searchParams.get('language');

    setQuery(qParam);
    setSelectedCategories(catParam ? catParam.split(',').filter(Boolean) : []);
    setSelectedSkills(skillParam ? skillParam.split(',').filter(Boolean) : []);
    setSelectedInterests(intParam ? intParam.split(',').filter(Boolean) : []);
    setSelectedCountries(countryParam ? countryParam.split(',').filter(Boolean) : []);
    setSelectedLanguages(langParam ? langParam.split(',').filter(Boolean) : []);
  }, [searchParams]);

  // Filter drawer mobile state
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  // Taxonomy states for filter controls
  const [categories, setCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [availableCountries, setAvailableCountries] = useState<{ country: string; count: number }[]>([]);

  // Results state
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [hasAnyUsersInDB, setHasAnyUsersInDB] = useState(true);

  // Collapsible filter sections
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    skills: true,
    interests: true,
    country: true,
    language: true,
  });

  const toggleSection = (key: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Load taxonomies
  useEffect(() => {
    async function loadTaxonomies() {
      try {
        const res = await fetch('/api/taxonomies', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
          setSkills(data.skills || []);
          setInterests(data.interests || []);
          setLanguages(data.languages || []);
          setAvailableCountries(data.countries || []);
        }
      } catch (err) {
        console.error('Failed to load taxonomies:', err);
      }
    }
    loadTaxonomies();
  }, []);

  // Fetch users based on live database queries
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set('q', query.trim());
      if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
      if (selectedSkills.length > 0) params.set('skill', selectedSkills.join(','));
      if (selectedInterests.length > 0) params.set('interest', selectedInterests.join(','));
      if (selectedCountries.length > 0) params.set('country', selectedCountries.join(','));
      if (selectedLanguages.length > 0) params.set('language', selectedLanguages.join(','));

      const res = await fetch(`/api/users?${params.toString()}`, {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotalCount(data.total || 0);

        // Check if there are any users in DB at all (if no filters applied)
        if (
          !query &&
          selectedCategories.length === 0 &&
          selectedSkills.length === 0 &&
          selectedInterests.length === 0 &&
          selectedCountries.length === 0 &&
          selectedLanguages.length === 0
        ) {
          setHasAnyUsersInDB(data.total > 0);
        }
      }
    } catch (err) {
      console.error('Error querying discover profiles:', err);
      setUsers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    query,
    selectedCategories,
    selectedSkills,
    selectedInterests,
    selectedCountries,
    selectedLanguages,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleClearFilters = () => {
    setQuery('');
    setSelectedCategories([]);
    setSelectedSkills([]);
    setSelectedInterests([]);
    setSelectedCountries([]);
    setSelectedLanguages([]);
    router.replace('/discover');
  };

  const hasActiveFilters =
    query.trim() !== '' ||
    selectedCategories.length > 0 ||
    selectedSkills.length > 0 ||
    selectedInterests.length > 0 ||
    selectedCountries.length > 0 ||
    selectedLanguages.length > 0;

  const toggleCategory = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const toggleSkill = (name: string) => {
    setSelectedSkills(prev =>
      prev.includes(name) ? prev.filter(s => s !== name) : [...prev, name]
    );
  };

  const toggleInterest = (name: string) => {
    setSelectedInterests(prev =>
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const toggleCountry = (country: string) => {
    setSelectedCountries(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code) ? prev.filter(l => l !== code) : [...prev, code]
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white text-brand-600 text-xs font-bold mb-3 border border-slate-200 shadow-2xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Cohort Directory & Discovery</span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight mb-3">
            {t.discover.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
            {t.discover.subtitle}
          </p>
        </div>

        {/* Prominent Search Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.discover.searchPlaceholder}
                className="w-full pl-11 pr-10 py-3.5 bg-white rounded-2xl border border-slate-200 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all text-sm font-medium text-slate-900 shadow-sm"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
              className="lg:hidden btn-secondary px-4 py-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 relative flex-shrink-0"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>{t.discover.filterButton}</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-brand-500 absolute top-2 right-2"></span>
              )}
            </button>
          </div>

          {/* Active filter badges bar */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-3 pt-2">
              <span className="text-xs font-semibold text-slate-400">Active filters:</span>
              
              {selectedCategories.map(cat => (
                <span key={cat} className="badge-pill bg-brand-100 text-brand-700 text-xs py-0.5 px-2.5 flex items-center gap-1">
                  Category: {cat}
                  <button onClick={() => toggleCategory(cat)}><X className="w-3 h-3" /></button>
                </span>
              ))}

              {selectedSkills.map(skill => (
                <span key={skill} className="badge-pill bg-brand-100 text-brand-700 text-xs py-0.5 px-2.5 flex items-center gap-1">
                  Skill: {skill}
                  <button onClick={() => toggleSkill(skill)}><X className="w-3 h-3" /></button>
                </span>
              ))}

              {selectedInterests.map(interest => (
                <span key={interest} className="badge-pill badge-interest text-xs py-0.5 px-2.5 flex items-center gap-1">
                  Interest: {interest}
                  <button onClick={() => toggleInterest(interest)}><X className="w-3 h-3" /></button>
                </span>
              ))}

              {selectedCountries.map(c => (
                <span key={c} className="badge-pill bg-slate-100 text-slate-700 text-xs py-0.5 px-2.5 flex items-center gap-1">
                  Country: {c}
                  <button onClick={() => toggleCountry(c)}><X className="w-3 h-3" /></button>
                </span>
              ))}

              {selectedLanguages.map(l => (
                <span key={l} className="badge-pill bg-slate-100 text-slate-700 text-xs py-0.5 px-2.5 flex items-center gap-1">
                  Lang: {l.toUpperCase()}
                  <button onClick={() => toggleLanguage(l)}><X className="w-3 h-3" /></button>
                </span>
              ))}

              <button
                onClick={handleClearFilters}
                className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 ml-2"
              >
                <RotateCcw className="w-3 h-3" />
                {t.discover.clearFilters}
              </button>
            </div>
          )}
        </div>

        {/* Main Content Layout: Sidebar Filters + Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm sticky top-24 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                <Filter className="w-4 h-4 text-brand-500" />
                <span>Filters</span>
              </h3>
              {hasActiveFilters && (
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-rose-500 hover:underline"
                >
                  {t.discover.clearFilters}
                </button>
              )}
            </div>

            {/* Categories Multi-Select */}
            <div>
              <button
                onClick={() => toggleSection('categories')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5"
              >
                <span>{t.discover.categories}</span>
                {expandedSections.categories ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {expandedSections.categories && (
                <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
                  {categories.map((cat) => {
                    const isSelected = selectedCategories.includes(cat.slug);
                    return (
                      <button
                        key={cat.id}
                        onClick={() => toggleCategory(cat.slug)}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-brand-50 text-brand-600 font-bold'
                            : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-brand-500 flex-shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Skills Filter */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => toggleSection('skills')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5"
              >
                <span>{t.discover.skills}</span>
                {expandedSections.skills ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {expandedSections.skills && (
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {skills.slice(0, 15).map((skill) => {
                    const isSelected = selectedSkills.includes(skill.name);
                    return (
                      <button
                        key={skill.id}
                        onClick={() => toggleSkill(skill.name)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-brand-500 text-white shadow-sm font-semibold'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {skill.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Areas of Interest Filter */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => toggleSection('interests')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5"
              >
                <span>{t.discover.interests}</span>
                {expandedSections.interests ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {expandedSections.interests && (
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {interests.slice(0, 12).map((interest) => {
                    const isSelected = selectedInterests.includes(interest.name);
                    return (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.name)}
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                          isSelected
                            ? 'bg-brand-400 text-white shadow-sm font-semibold'
                            : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-800'
                        }`}
                      >
                        {interest.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Country Filter */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => toggleSection('country')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5"
              >
                <span>{t.discover.country}</span>
                {expandedSections.country ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {expandedSections.country && (
                <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                  {availableCountries.length > 0 ? (
                    availableCountries.map((c) => {
                      const isSelected = selectedCountries.some(
                        (sc) => normalizeCountry(sc).toLowerCase() === normalizeCountry(c.country).toLowerCase()
                      );
                      const flagImg = getCountryFlagImg(c.country);
                      return (
                        <button
                          key={c.country}
                          onClick={() => toggleCountry(c.country)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                            isSelected ? 'bg-brand-50 text-brand-600 font-bold border border-brand-200/80' : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                          }`}
                        >
                          <span className="truncate flex items-center gap-2 min-w-0">
                            {flagImg ? (
                              <img
                                src={flagImg}
                                alt={`${c.country} Flag`}
                                className="w-5 h-3.5 rounded object-cover border border-slate-200 flex-shrink-0"
                              />
                            ) : (
                              <span className="text-xs flex-shrink-0">{getCountryFlag(c.country)}</span>
                            )}
                            <span className="truncate">{c.country}</span>
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono flex-shrink-0">({c.count})</span>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-xs text-slate-400 italic">No countries recorded yet</p>
                  )}
                </div>
              )}
            </div>

            {/* Language Filter */}
            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => toggleSection('language')}
                className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700 mb-2.5"
              >
                <span>{t.discover.language}</span>
                {expandedSections.language ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
              {expandedSections.language && (
                <div className="space-y-1">
                  {languages.slice(0, 6).map((lang) => {
                    const isSelected = selectedLanguages.includes(lang.code);
                    return (
                      <button
                        key={lang.id}
                        onClick={() => toggleLanguage(lang.code)}
                        className={`w-full text-left px-2 py-1 rounded text-xs font-medium flex items-center justify-between ${
                          isSelected ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <span>{lang.name}</span>
                        {isSelected && <Check className="w-3 h-3 text-brand-500" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>

          {/* Results Grid Area */}
          <main className="lg:col-span-3">
            
            {/* Results Counter Header */}
            <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-500" />
                <span className="text-sm font-bold text-slate-800">
                  {totalCount} {t.discover.resultsFound}
                </span>
              </div>
            </div>

            {/* Loading Skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="glass-card rounded-2xl p-6 h-64 animate-pulse bg-white/50 border border-slate-100 flex flex-col justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-slate-200" />
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-slate-200 rounded w-2/3" />
                        <div className="h-3 bg-slate-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-slate-200 rounded w-full" />
                      <div className="h-3 bg-slate-200 rounded w-4/5" />
                    </div>
                    <div className="h-8 bg-slate-200 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            ) : users.length > 0 ? (
              /* REAL REGISTERED USERS GRID */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in duration-300">
                {users.map((profile) => (
                  <ProfileCard key={profile.id} profile={profile} />
                ))}
              </div>
            ) : !hasAnyUsersInDB && !hasActiveFilters ? (
              /* Intentional Empty Network State (when 0 users in DB) */
              <EmptyState
                type="empty-network"
                title={t.discover.emptyNetworkTitle}
                description={t.discover.emptyNetworkDesc}
                primaryActionText={t.discover.createProfileCta}
                primaryActionHref="/signup"
              />
            ) : (
              /* Search / Filter Returned No Results State */
              <EmptyState
                type="no-results"
                title={t.discover.noResultsTitle}
                description={t.discover.noResultsDesc}
                primaryActionText={t.discover.clearFilters}
                onPrimaryAction={handleClearFilters}
                secondaryActionText="Create Profile"
                secondaryActionHref="/signup"
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Drawer Modal */}
      {filterDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setFilterDrawerOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h3 className="font-display font-bold text-lg text-slate-900">Filters</h3>
                <button onClick={() => setFilterDrawerOpen(false)} className="p-1 rounded-lg text-slate-500 hover:bg-slate-100">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="py-4 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Categories</h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => toggleCategory(cat.slug)}
                      className={`w-full text-left px-2 py-1 rounded text-xs ${
                        selectedCategories.includes(cat.slug) ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-600'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skills */}
              <div className="py-4 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-1 max-h-36 overflow-y-auto">
                  {skills.slice(0, 15).map((skill) => (
                    <button
                      key={skill.id}
                      onClick={() => toggleSkill(skill.name)}
                      className={`px-2 py-0.5 rounded-full text-xs ${
                        selectedSkills.includes(skill.name) ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Country */}
              <div className="py-4 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Country</h4>
                <div className="space-y-1 max-h-36 overflow-y-auto">
                  {availableCountries.map((c) => {
                    const isSelected = selectedCountries.some(
                      (sc) => normalizeCountry(sc).toLowerCase() === normalizeCountry(c.country).toLowerCase()
                    );
                    const flagImg = getCountryFlagImg(c.country);
                    return (
                      <button
                        key={c.country}
                        onClick={() => toggleCountry(c.country)}
                        className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between ${
                          isSelected ? 'bg-brand-50 text-brand-600 font-bold' : 'text-slate-600'
                        }`}
                      >
                        <span className="flex items-center gap-1.5 truncate">
                          {flagImg ? (
                            <img src={flagImg} alt={c.country} className="w-4 h-3 rounded object-cover" />
                          ) : (
                            <span>{getCountryFlag(c.country)}</span>
                          )}
                          <span className="truncate">{c.country}</span>
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">({c.count})</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  fetchUsers();
                  setFilterDrawerOpen(false);
                }}
                className="w-full btn-primary py-3 rounded-xl text-xs font-bold text-center"
              >
                Apply Filters ({totalCount} Results)
              </button>
              {hasActiveFilters && (
                <button
                  onClick={() => {
                    handleClearFilters();
                    setFilterDrawerOpen(false);
                  }}
                  className="w-full btn-secondary py-2.5 rounded-xl text-xs font-bold text-center"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAFBFF] py-16 flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DiscoverContent />
    </Suspense>
  );
}
