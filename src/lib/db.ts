import fs from 'fs';
import path from 'path';
import { 
  User, 
  UserProfile, 
  Category, 
  Skill, 
  Interest, 
  Language, 
  ProfessionalLink, 
  SearchFilters, 
  SearchResult 
} from './types';

interface DatabaseSchema {
  users: User[];
  categories: Category[];
  skills: Skill[];
  interests: Interest[];
  languages: Language[];
  userCategories: { userId: string; categoryId: string }[];
  userSkills: { userId: string; skillId: string }[];
  userInterests: { userId: string; interestId: string }[];
  userLanguages: { userId: string; languageId: string }[];
  professionalLinks: ProfessionalLink[];
}

const DB_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DB_DIR, 'koicakonnect.json');

const INITIAL_CATEGORIES: { name: string; slug: string; icon: string; description: string }[] = [
  { name: 'Technology', slug: 'technology', icon: 'Laptop', description: 'Software, cloud, cybersecurity & digital infrastructure' },
  { name: 'Healthcare', slug: 'healthcare', icon: 'Activity', description: 'Medicine, healthtech, clinical research & biotech' },
  { name: 'Engineering', slug: 'engineering', icon: 'Cpu', description: 'Hardware, robotics, mechanical, civil & electrical engineering' },
  { name: 'Finance', slug: 'finance', icon: 'TrendingUp', description: 'Fintech, investment, banking, venture capital & crypto' },
  { name: 'Education', slug: 'education', icon: 'GraduationCap', description: 'Edtech, academia, higher education & instructional design' },
  { name: 'Logistics', slug: 'logistics', icon: 'Truck', description: 'Supply chain, freight, maritime & autonomous transport' },
  { name: 'Research', slug: 'research', icon: 'Microscope', description: 'Scientific exploration, R&D, quantum computing & lab science' },
  { name: 'Entrepreneurship', slug: 'entrepreneurship', icon: 'Rocket', description: 'Startup founders, venture builders & early-stage innovators' },
  { name: 'Agriculture', slug: 'agriculture', icon: 'Sprout', description: 'Agritech, sustainable farming, food systems & genomics' },
  { name: 'Energy', slug: 'energy', icon: 'Zap', description: 'Clean energy, renewables, power grids, nuclear & battery storage' },
  { name: 'Manufacturing', slug: 'manufacturing', icon: 'Factory', description: 'Industrial automation, 3D printing & precision fabrication' },
  { name: 'Telecommunications', slug: 'telecommunications', icon: 'Radio', description: '5G/6G, satellite constellations, networking & fiber optics' },
  { name: 'Media & Creative', slug: 'media-creative', icon: 'Sparkles', description: 'Design, audiovisual production, gaming & digital arts' },
  { name: 'Government', slug: 'government', icon: 'Landmark', description: 'Public policy, civic tech, regulatory affairs & smart cities' },
  { name: 'Other', slug: 'other', icon: 'Layers', description: 'Interdisciplinary, emerging fields & specialized domains' },
];

const INITIAL_LANGUAGES: { name: string; code: string }[] = [
  { name: 'English', code: 'en' },
  { name: 'French', code: 'fr' },
  { name: 'Korean', code: 'ko' },
  { name: 'Spanish', code: 'es' },
  { name: 'German', code: 'de' },
  { name: 'Mandarin Chinese', code: 'zh' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Portuguese', code: 'pt' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Hindi', code: 'hi' },
  { name: 'Italian', code: 'it' },
  { name: 'Dutch', code: 'nl' },
];

const INITIAL_SKILLS: string[] = [
  'Python', 'Machine Learning', 'Artificial Intelligence', 'Robotics', 'PCB Design',
  'Embedded Systems', 'Product Management', 'Data Science', 'Hardware Engineering',
  'TypeScript', 'React', 'Next.js', 'Rust', 'Go', 'Kubernetes', 'Cloud Architecture',
  'Deep Learning', 'Computer Vision', 'NLP', 'Bioinformatics', 'Quantum Computing',
  'Cybersecurity', 'Solidity', 'FPGA', 'UI/UX Design', 'Systems Architecture'
];

const INITIAL_INTERESTS: string[] = [
  'Artificial Intelligence', 'Healthcare Technology', 'Semiconductor Technology',
  'Medical Devices', 'Robotics', 'Climate Technology', 'FinTech', 'Space Exploration',
  'Autonomous Vehicles', 'Synthetic Biology', 'Quantum Information', 'Clean Energy',
  'Human-Computer Interaction', 'Decentralized Systems', 'Neurotechnology'
];

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getInitialDatabase(): DatabaseSchema {
  return {
    users: [], // Strictly 0 fake users in database!
    categories: INITIAL_CATEGORIES.map((cat, i) => ({
      id: `cat_${i + 1}`,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: cat.description,
    })),
    languages: INITIAL_LANGUAGES.map((lang, i) => ({
      id: `lang_${i + 1}`,
      name: lang.name,
      code: lang.code,
    })),
    skills: INITIAL_SKILLS.map((skill, i) => ({
      id: `skill_${i + 1}`,
      name: skill,
      slug: slugify(skill),
    })),
    interests: INITIAL_INTERESTS.map((interest, i) => ({
      id: `int_${i + 1}`,
      name: interest,
      slug: slugify(interest),
    })),
    userCategories: [],
    userSkills: [],
    userInterests: [],
    userLanguages: [],
    professionalLinks: [],
  };
}

class DatabaseManager {
  private db: DatabaseSchema | null = null;

  private load(): DatabaseSchema {
    if (this.db) return this.db;

    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      this.db = initial;
      return this.db;
    }

    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      this.db = JSON.parse(raw);
      return this.db!;
    } catch (err) {
      console.error('Error loading DB, resetting to schema:', err);
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      this.db = initial;
      return this.db;
    }
  }

  private save(): void {
    if (!this.db) return;
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
  }

  // --- Eligibility & Validation ---
  public isProfileComplete(user: User): boolean {
    if (!user) return false;
    const hasName = Boolean(user.name && user.name.trim().length > 0);
    const hasRole = Boolean(user.role && user.role.trim().length > 0);
    return hasName && hasRole;
  }

  public isEligibleForDiscover(user: User): boolean {
    if (!user) return false;
    if (user.isDeactivated) return false;
    if (user.status !== 'published') return false;
    if (user.isDiscoverable === false) return false;
    return this.isProfileComplete(user);
  }

  // --- Category Operations ---
  public getCategories(): Category[] {
    const db = this.load();
    return [...db.categories];
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    const db = this.load();
    return db.categories.find(c => c.slug === slug);
  }

  public addCategory(name: string, description?: string, icon?: string): Category {
    const db = this.load();
    const slug = slugify(name);
    const existing = db.categories.find(c => c.slug === slug);
    if (existing) return existing;

    const newCat: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      slug,
      icon: icon || 'Tag',
      description: description || '',
    };
    db.categories.push(newCat);
    this.save();
    return newCat;
  }

  // --- Skills Operations ---
  public getSkills(): Skill[] {
    const db = this.load();
    return [...db.skills];
  }

  public getOrCreateSkill(name: string): Skill {
    const db = this.load();
    const trimmed = name.trim();
    const slug = slugify(trimmed);
    const existing = db.skills.find(s => s.slug === slug || s.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;

    const newSkill: Skill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      slug,
    };
    db.skills.push(newSkill);
    this.save();
    return newSkill;
  }

  // --- Interests Operations ---
  public getInterests(): Interest[] {
    const db = this.load();
    return [...db.interests];
  }

  public getOrCreateInterest(name: string): Interest {
    const db = this.load();
    const trimmed = name.trim();
    const slug = slugify(trimmed);
    const existing = db.interests.find(i => i.slug === slug || i.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;

    const newInterest: Interest = {
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      slug,
    };
    db.interests.push(newInterest);
    this.save();
    return newInterest;
  }

  // --- Languages Operations ---
  public getLanguages(): Language[] {
    const db = this.load();
    return [...db.languages];
  }

  public getLanguageByCode(code: string): Language | undefined {
    const db = this.load();
    return db.languages.find(l => l.code.toLowerCase() === code.toLowerCase());
  }

  public getOrCreateLanguage(name: string, code?: string): Language {
    const db = this.load();
    const trimmed = name.trim();
    const langCode = (code || slugify(trimmed).substring(0, 3)).toLowerCase();
    const existing = db.languages.find(l => l.code === langCode || l.name.toLowerCase() === trimmed.toLowerCase());
    if (existing) return existing;

    const newLang: Language = {
      id: `lang_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      code: langCode,
    };
    db.languages.push(newLang);
    this.save();
    return newLang;
  }

  // --- User Profile Aggregation ---
  private assembleUserProfile(user: User): UserProfile {
    const db = this.load();

    const userCatIds = db.userCategories
      .filter(uc => uc.userId === user.id)
      .map(uc => uc.categoryId);
    const categories = db.categories.filter(c => userCatIds.includes(c.id));

    const userSkillIds = db.userSkills
      .filter(us => us.userId === user.id)
      .map(us => us.skillId);
    const skills = db.skills.filter(s => userSkillIds.includes(s.id));

    const userInterestIds = db.userInterests
      .filter(ui => ui.userId === user.id)
      .map(ui => ui.interestId);
    const interests = db.interests.filter(i => userInterestIds.includes(i.id));

    const userLangIds = db.userLanguages
      .filter(ul => ul.userId === user.id)
      .map(ul => ul.languageId);
    const languages = db.languages.filter(l => userLangIds.includes(l.id));

    const links = db.professionalLinks.filter(pl => pl.userId === user.id);

    // Sanitize user object to avoid exposing password hash
    const { passwordHash: _ignored, ...safeUser } = user;

    return {
      ...safeUser,
      isProfileComplete: this.isProfileComplete(user),
      isDiscoverable: user.isDiscoverable !== false,
      categories,
      skills,
      interests,
      languages,
      links,
    };
  }

  // --- User Operations ---
  public getUserById(id: string): User | undefined {
    const db = this.load();
    return db.users.find(u => u.id === id && !u.isDeactivated);
  }

  public getUserByEmail(email: string): User | undefined {
    const db = this.load();
    return db.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim() && !u.isDeactivated);
  }

  public getUserByUsername(username: string): UserProfile | undefined {
    const db = this.load();
    const cleanUsername = username.toLowerCase().trim();
    const user = db.users.find(u => u.username.toLowerCase() === cleanUsername && !u.isDeactivated);
    if (!user) return undefined;
    return this.assembleUserProfile(user);
  }

  public createUser(userData: {
    name: string;
    email: string;
    passwordHash: string;
    username: string;
    role?: string;
    organisation?: string;
    country?: string;
    city?: string;
    bio?: string;
    profileImage?: string;
    preferredLanguage?: string;
    status?: 'draft' | 'published' | 'private';
    isDiscoverable?: boolean;
    isAdmin?: boolean;
  }): UserProfile {
    const db = this.load();

    const cleanEmail = userData.email.toLowerCase().trim();
    if (db.users.some(u => u.email.toLowerCase() === cleanEmail && !u.isDeactivated)) {
      throw new Error('Email already registered');
    }

    let username = slugify(userData.username || userData.name);
    let usernameAttempt = username;
    let counter = 1;
    while (db.users.some(u => u.username.toLowerCase() === usernameAttempt && !u.isDeactivated)) {
      usernameAttempt = `${username}-${counter}`;
      counter++;
    }
    username = usernameAttempt;

    const now = new Date().toISOString();
    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: userData.name.trim(),
      email: cleanEmail,
      passwordHash: userData.passwordHash,
      username,
      role: userData.role || '',
      organisation: userData.organisation || '',
      country: userData.country || '',
      city: userData.city || '',
      bio: userData.bio || '',
      profileImage: userData.profileImage || '',
      preferredLanguage: userData.preferredLanguage || 'en',
      status: userData.status || 'draft',
      isDiscoverable: userData.isDiscoverable !== false,
      isDeactivated: false,
      isAdmin: !!userData.isAdmin,
      createdAt: now,
      updatedAt: now,
    };

    db.users.push(newUser);
    this.save();
    return this.assembleUserProfile(newUser);
  }

  public updateUserProfile(
    userId: string,
    data: Partial<User>,
    relations?: {
      categoryIds?: string[];
      skills?: string[];
      interests?: string[];
      languageCodes?: string[];
      links?: ProfessionalLink[];
    }
  ): UserProfile {
    const db = this.load();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = db.users[userIndex];

    // If username is being changed, ensure uniqueness
    if (data.username && data.username !== user.username) {
      const cleanUsername = slugify(data.username);
      const isTaken = db.users.some(u => u.id !== userId && u.username.toLowerCase() === cleanUsername && !u.isDeactivated);
      if (isTaken) {
        throw new Error('Username already taken');
      }
      user.username = cleanUsername;
    }

    // Update basic user fields
    if (data.name !== undefined) user.name = data.name.trim();
    if (data.role !== undefined) user.role = data.role.trim();
    if (data.organisation !== undefined) user.organisation = data.organisation.trim();
    if (data.country !== undefined) user.country = data.country.trim();
    if (data.city !== undefined) user.city = data.city.trim();
    if (data.bio !== undefined) user.bio = data.bio.trim();
    if (data.profileImage !== undefined) user.profileImage = data.profileImage.trim();
    if (data.preferredLanguage !== undefined) user.preferredLanguage = data.preferredLanguage.trim();
    if (data.status !== undefined) user.status = data.status;
    if (data.isDiscoverable !== undefined) user.isDiscoverable = data.isDiscoverable;
    if (data.isDeactivated !== undefined) user.isDeactivated = data.isDeactivated;
    if (data.passwordHash !== undefined) user.passwordHash = data.passwordHash;
    user.updatedAt = new Date().toISOString();

    // Update categories relation
    if (relations?.categoryIds) {
      db.userCategories = db.userCategories.filter(uc => uc.userId !== userId);
      for (const catId of relations.categoryIds) {
        if (db.categories.some(c => c.id === catId || c.slug === catId)) {
          const category = db.categories.find(c => c.id === catId || c.slug === catId)!;
          db.userCategories.push({ userId, categoryId: category.id });
        }
      }
    }

    // Update skills relation
    if (relations?.skills) {
      db.userSkills = db.userSkills.filter(us => us.userId !== userId);
      for (const skillName of relations.skills) {
        if (skillName.trim()) {
          const skill = this.getOrCreateSkill(skillName);
          if (!db.userSkills.some(us => us.userId === userId && us.skillId === skill.id)) {
            db.userSkills.push({ userId, skillId: skill.id });
          }
        }
      }
    }

    // Update interests relation
    if (relations?.interests) {
      db.userInterests = db.userInterests.filter(ui => ui.userId !== userId);
      for (const interestName of relations.interests) {
        if (interestName.trim()) {
          const interest = this.getOrCreateInterest(interestName);
          if (!db.userInterests.some(ui => ui.userId === userId && ui.interestId === interest.id)) {
            db.userInterests.push({ userId, interestId: interest.id });
          }
        }
      }
    }

    // Update languages relation
    if (relations?.languageCodes) {
      db.userLanguages = db.userLanguages.filter(ul => ul.userId !== userId);
      for (const langCode of relations.languageCodes) {
        if (langCode.trim()) {
          const lang = this.getOrCreateLanguage(langCode, langCode);
          if (!db.userLanguages.some(ul => ul.userId === userId && ul.languageId === lang.id)) {
            db.userLanguages.push({ userId, languageId: lang.id });
          }
        }
      }
    }

    // Update professional links
    if (relations?.links) {
      db.professionalLinks = db.professionalLinks.filter(pl => pl.userId !== userId);
      for (const link of relations.links) {
        if (link.url && link.url.trim()) {
          db.professionalLinks.push({
            id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            userId,
            platform: link.platform,
            url: link.url.trim(),
            title: link.title || '',
          });
        }
      }
    }

    this.save();
    return this.assembleUserProfile(user);
  }

  public deleteUser(userId: string): boolean {
    const db = this.load();
    const userIndex = db.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    db.users.splice(userIndex, 1);
    db.userCategories = db.userCategories.filter(uc => uc.userId !== userId);
    db.userSkills = db.userSkills.filter(us => us.userId !== userId);
    db.userInterests = db.userInterests.filter(ui => ui.userId !== userId);
    db.userLanguages = db.userLanguages.filter(ul => ul.userId !== userId);
    db.professionalLinks = db.professionalLinks.filter(pl => pl.userId !== userId);
    this.save();
    return true;
  }

  public deactivateUser(userId: string): boolean {
    const db = this.load();
    const user = db.users.find(u => u.id === userId);
    if (!user) return false;
    user.isDeactivated = true;
    user.status = 'private';
    user.updatedAt = new Date().toISOString();
    this.save();
    return true;
  }

  // --- Dynamic Search and Discovery (Real Database Execution) ---
  public getPublishedUsers(filters: SearchFilters = {}): SearchResult {
    const db = this.load();

    // 1. Filter ONLY real, active, complete, published, and discoverable profiles
    let candidates = db.users.filter(u => this.isEligibleForDiscover(u));

    // 2. Exclude current user from their own Discover results if authenticated
    if (filters.excludeUserId) {
      candidates = candidates.filter(u => u.id !== filters.excludeUserId);
    }

    // 3. Keyword query search across name, role, organisation, bio, skills, interests, categories, location
    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const terms = q.split(/\s+/).filter(Boolean);

      candidates = candidates.filter(user => {
        const profile = this.assembleUserProfile(user);
        
        const searchableCorpus = [
          profile.name,
          profile.role,
          profile.organisation,
          profile.country,
          profile.city,
          profile.bio,
          ...profile.skills.map(s => s.name),
          ...profile.interests.map(i => i.name),
          ...profile.categories.map(c => c.name),
          ...profile.languages.map(l => l.name),
        ].join(' ').toLowerCase();

        return terms.every(term => searchableCorpus.includes(term));
      });
    }

    // 4. Category Filter (multi-select)
    if (filters.categorySlugs && filters.categorySlugs.length > 0) {
      candidates = candidates.filter(user => {
        const userCatIds = db.userCategories
          .filter(uc => uc.userId === user.id)
          .map(uc => uc.categoryId);
        const userCats = db.categories.filter(c => userCatIds.includes(c.id));
        return filters.categorySlugs!.some(slug => 
          userCats.some(c => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase() === slug.toLowerCase())
        );
      });
    }

    // 5. Skills Filter (multi-select)
    if (filters.skillNames && filters.skillNames.length > 0) {
      candidates = candidates.filter(user => {
        const userSkillIds = db.userSkills
          .filter(us => us.userId === user.id)
          .map(us => us.skillId);
        const userSkills = db.skills.filter(s => userSkillIds.includes(s.id));
        return filters.skillNames!.every(skillFilter =>
          userSkills.some(s => s.name.toLowerCase() === skillFilter.toLowerCase() || s.slug === slugify(skillFilter))
        );
      });
    }

    // 6. Interests Filter (multi-select)
    if (filters.interestNames && filters.interestNames.length > 0) {
      candidates = candidates.filter(user => {
        const userIntIds = db.userInterests
          .filter(ui => ui.userId === user.id)
          .map(ui => ui.interestId);
        const userInterests = db.interests.filter(i => userIntIds.includes(i.id));
        return filters.interestNames!.some(intFilter =>
          userInterests.some(i => i.name.toLowerCase() === intFilter.toLowerCase() || i.slug === slugify(intFilter))
        );
      });
    }

    // 7. Country Filter (multi-select)
    if (filters.countries && filters.countries.length > 0) {
      candidates = candidates.filter(user =>
        filters.countries!.some(c => user.country.toLowerCase() === c.toLowerCase().trim())
      );
    }

    // 8. Language Filter (multi-select)
    if (filters.languageCodes && filters.languageCodes.length > 0) {
      candidates = candidates.filter(user => {
        const userLangIds = db.userLanguages
          .filter(ul => ul.userId === user.id)
          .map(ul => ul.languageId);
        const userLangs = db.languages.filter(l => userLangIds.includes(l.id));
        return filters.languageCodes!.some(code =>
          userLangs.some(l => l.code.toLowerCase() === code.toLowerCase() || l.name.toLowerCase() === code.toLowerCase())
        );
      });
    }

    // Sort by recent updates
    candidates.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    const total = candidates.length;
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 24);
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = candidates.slice((page - 1) * limit, page * limit);

    return {
      users: paginated.map(u => this.assembleUserProfile(u)),
      total,
      page,
      totalPages,
    };
  }

  // --- Aggregations & Metrics ---
  public getCategoryStats(): { category: Category; count: number }[] {
    const db = this.load();
    const eligibleUserIds = new Set(
      db.users.filter(u => this.isEligibleForDiscover(u)).map(u => u.id)
    );

    return db.categories.map(category => {
      const count = db.userCategories.filter(
        uc => uc.categoryId === category.id && eligibleUserIds.has(uc.userId)
      ).length;
      return { category, count };
    });
  }

  public getCountriesWithCounts(): { country: string; count: number }[] {
    const db = this.load();
    const eligibleUsers = db.users.filter(u => this.isEligibleForDiscover(u) && u.country.trim().length > 0);
    
    const countMap: Record<string, number> = {};
    for (const u of eligibleUsers) {
      const country = u.country.trim();
      countMap[country] = (countMap[country] || 0) + 1;
    }

    return Object.entries(countMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }

  public getPlatformStats(): { totalPublished: number; totalSkills: number; totalCategories: number; totalCountries: number } {
    const db = this.load();
    const eligibleUsers = db.users.filter(u => this.isEligibleForDiscover(u));
    const countries = new Set(eligibleUsers.map(u => u.country.trim()).filter(Boolean));

    return {
      totalPublished: eligibleUsers.length,
      totalSkills: db.skills.length,
      totalCategories: db.categories.length,
      totalCountries: countries.size,
    };
  }

  public getAllUsersAdmin(): UserProfile[] {
    const db = this.load();
    return db.users.filter(u => !u.isDeactivated).map(u => this.assembleUserProfile(u));
  }
}

export const db = new DatabaseManager();
