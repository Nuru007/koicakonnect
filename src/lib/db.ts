import { supabase } from './supabase';
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
import { generateResetToken, hashResetToken, logDevResetLink } from './auth';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function sanitizePublicProfile(profile: UserProfile): UserProfile {
  return {
    id: profile.id,
    name: profile.name,
    username: profile.username,
    role: profile.role,
    organisation: profile.organisation,
    country: profile.country,
    city: profile.city,
    bio: profile.bio,
    profileImage: profile.profileImage,
    preferredLanguage: profile.preferredLanguage,
    status: profile.status,
    email: '', // Never expose raw email in public discovery API
    isDiscoverable: profile.isDiscoverable,
    isProfileComplete: profile.isProfileComplete,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    categories: profile.categories,
    skills: profile.skills,
    interests: profile.interests,
    languages: profile.languages,
    links: profile.links,
  };
}

export function sanitizeSessionUser(profile: UserProfile): UserProfile {
  const { passwordHash: _ignored, ...safe } = profile;
  return safe as UserProfile;
}

async function uploadAvatarIfBase64(userId: string, base64Data: string, oldAvatarUrl?: string): Promise<string> {
  if (!base64Data || !base64Data.startsWith('data:image')) {
    return base64Data || '';
  }

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) {
      return base64Data;
    }

    const contentType = matches[1];
    const buffer = Buffer.from(matches[2], 'base64');
    const ext = contentType.includes('png') ? 'png' : 'jpg';
    const newFileName = `user_${userId}_avatar_${Date.now()}.${ext}`;

    // 1. Upload new image buffer to avatars bucket
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(newFileName, buffer, {
        contentType,
        upsert: true,
      });

    if (uploadError) {
      console.warn(`Failed to upload avatar to Supabase Storage:`, uploadError.message);
      return base64Data;
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(newFileName);

    const newUrl = publicUrlData.publicUrl;

    // 2. Safe cleanup of old avatar asset if it exists and had a different filename
    if (oldAvatarUrl && oldAvatarUrl.includes('/avatars/')) {
      const oldFileName = oldAvatarUrl.split('/avatars/').pop()?.split('?')[0];
      if (oldFileName && oldFileName !== newFileName) {
        supabase.storage.from('avatars').remove([oldFileName]).catch(() => {});
      }
    }

    return newUrl;
  } catch (err) {
    console.error('Error uploading avatar:', err);
    return base64Data;
  }
}

function mapUserRowToUser(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    username: row.username,
    role: row.role || '',
    organisation: row.organisation || '',
    country: row.country || '',
    city: row.city || '',
    bio: row.bio || '',
    profileImage: row.profile_image || '',
    preferredLanguage: row.preferred_language || 'en',
    status: row.status || 'draft',
    isDiscoverable: row.is_discoverable !== false,
    isDeactivated: Boolean(row.is_deactivated),
    isAdmin: Boolean(row.is_admin),
    createdAt: row.created_at || new Date().toISOString(),
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

class DatabaseManager {
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
  public async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    if (error || !data) return [];
    return data;
  }

  public async getCategoryBySlug(slug: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    if (error || !data) return null;
    return data;
  }

  public async addCategory(name: string, description?: string, icon?: string): Promise<Category> {
    const slug = slugify(name);
    const existing = await this.getCategoryBySlug(slug);
    if (existing) return existing;

    const newCat: Category = {
      id: `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      slug,
      icon: icon || 'Tag',
      description: description || '',
    };

    await supabase.from('categories').insert(newCat);
    return newCat;
  }

  // --- Skills Operations ---
  public async getSkills(): Promise<Skill[]> {
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('name');
    if (error || !data) return [];
    return data;
  }

  public async getOrCreateSkill(name: string): Promise<Skill> {
    const trimmed = name.trim();
    const slug = slugify(trimmed);

    const { data: existing } = await supabase
      .from('skills')
      .select('*')
      .or(`slug.eq.${slug},name.ilike.${trimmed}`)
      .limit(1)
      .single();

    if (existing) return existing;

    const newSkill: Skill = {
      id: `skill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      slug,
    };

    await supabase.from('skills').insert(newSkill);
    return newSkill;
  }

  // --- Interests Operations ---
  public async getInterests(): Promise<Interest[]> {
    const { data, error } = await supabase
      .from('interests')
      .select('*')
      .order('name');
    if (error || !data) return [];
    return data;
  }

  public async getOrCreateInterest(name: string): Promise<Interest> {
    const trimmed = name.trim();
    const slug = slugify(trimmed);

    const { data: existing } = await supabase
      .from('interests')
      .select('*')
      .or(`slug.eq.${slug},name.ilike.${trimmed}`)
      .limit(1)
      .single();

    if (existing) return existing;

    const newInterest: Interest = {
      id: `int_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      slug,
    };

    await supabase.from('interests').insert(newInterest);
    return newInterest;
  }

  // --- Languages Operations ---
  public async getLanguages(): Promise<Language[]> {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .order('name');
    if (error || !data) return [];
    return data;
  }

  public async getLanguageByCode(code: string): Promise<Language | null> {
    const { data, error } = await supabase
      .from('languages')
      .select('*')
      .ilike('code', code)
      .single();
    if (error || !data) return null;
    return data;
  }

  public async getOrCreateLanguage(name: string, code?: string): Promise<Language> {
    const trimmed = name.trim();
    const langCode = (code || slugify(trimmed).substring(0, 3)).toLowerCase();

    const { data: existing } = await supabase
      .from('languages')
      .select('*')
      .or(`code.eq.${langCode},name.ilike.${trimmed}`)
      .limit(1)
      .single();

    if (existing) return existing;

    const newLang: Language = {
      id: `lang_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: trimmed,
      code: langCode,
    };

    await supabase.from('languages').insert(newLang);
    return newLang;
  }

  // --- User Profile Aggregation ---
  public async assembleUserProfile(user: User): Promise<UserProfile> {
    const [categoriesRes, skillsRes, interestsRes, languagesRes, linksRes] = await Promise.all([
      supabase.from('user_categories').select('category:categories(*)').eq('user_id', user.id),
      supabase.from('user_skills').select('skill:skills(*)').eq('user_id', user.id),
      supabase.from('user_interests').select('interest:interests(*)').eq('user_id', user.id),
      supabase.from('user_languages').select('language:languages(*)').eq('user_id', user.id),
      supabase.from('professional_links').select('*').eq('user_id', user.id),
    ]);

    const categories: Category[] = (categoriesRes.data || [])
      .map((item: any) => item.category)
      .filter(Boolean);

    const skills: Skill[] = (skillsRes.data || [])
      .map((item: any) => item.skill)
      .filter(Boolean);

    const interests: Interest[] = (interestsRes.data || [])
      .map((item: any) => item.interest)
      .filter(Boolean);

    const languages: Language[] = (languagesRes.data || [])
      .map((item: any) => item.language)
      .filter(Boolean);

    const links: ProfessionalLink[] = (linksRes.data || []).map((pl: any) => ({
      id: pl.id,
      userId: pl.user_id,
      platform: pl.platform,
      url: pl.url,
      title: pl.title || '',
    }));

    return {
      ...user,
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
  public async getUserById(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return mapUserRowToUser(data);
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !data) return null;
    return mapUserRowToUser(data);
  }

  public async getUserByUsername(username: string): Promise<UserProfile | null> {
    const cleanUsername = username.toLowerCase().trim();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', cleanUsername)
      .single();

    if (error || !data) return null;
    const user = mapUserRowToUser(data);
    return this.assembleUserProfile(user);
  }

  // Genuinely public-facing profile query (enforcing visibility state: returns 404 for draft/hidden/deactivated)
  public async getPublicProfileByUsername(username: string): Promise<UserProfile | null> {
    const cleanUsername = username.toLowerCase().trim();
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', cleanUsername)
      .eq('is_deactivated', false)
      .eq('status', 'published')
      .eq('is_discoverable', true)
      .single();

    if (error || !data) return null;
    const user = mapUserRowToUser(data);
    const profile = await this.assembleUserProfile(user);
    return sanitizePublicProfile(profile);
  }

  public async createUser(userData: {
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
  }): Promise<UserProfile> {
    const cleanEmail = userData.email.toLowerCase().trim();

    const existingEmail = await this.getUserByEmail(cleanEmail);
    if (existingEmail) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }

    let username = slugify(userData.username || userData.name);
    let usernameAttempt = username;
    let counter = 1;

    while (true) {
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('username', usernameAttempt)
        .single();

      if (!existingUser) {
        username = usernameAttempt;
        break;
      }
      usernameAttempt = `${username}-${counter}`;
      counter++;
    }

    const userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    let profileImageUrl = userData.profileImage || '';
    if (profileImageUrl.startsWith('data:image')) {
      profileImageUrl = await uploadAvatarIfBase64(userId, profileImageUrl);
    }

    const now = new Date().toISOString();
    const userRow = {
      id: userId,
      name: userData.name.trim(),
      email: cleanEmail,
      password_hash: userData.passwordHash,
      username,
      role: userData.role || '',
      organisation: userData.organisation || '',
      country: userData.country || '',
      city: userData.city || '',
      bio: userData.bio || '',
      profile_image: profileImageUrl,
      preferred_language: userData.preferredLanguage || 'en',
      status: userData.status || 'draft',
      is_discoverable: userData.status === 'published' ? (userData.isDiscoverable !== false) : false,
      is_deactivated: false,
      is_admin: Boolean(userData.isAdmin),
      created_at: now,
      updated_at: now,
    };

    const { error } = await supabase.from('users').insert(userRow);
    if (error) {
      if (error.code === '23505') {
        throw new Error('EMAIL_ALREADY_EXISTS');
      }
      throw new Error(`Failed to create user: ${error.message}`);
    }

    const createdUser = mapUserRowToUser(userRow);
    const profile = await this.assembleUserProfile(createdUser);
    return sanitizeSessionUser(profile);
  }

  public async updateUserProfile(
    userId: string,
    data: Partial<User>,
    relations?: {
      categoryIds?: string[];
      skills?: string[];
      interests?: string[];
      languageCodes?: string[];
      links?: ProfessionalLink[];
    }
  ): Promise<UserProfile> {
    const existing = await this.getUserById(userId);
    if (!existing) {
      throw new Error('USER_NOT_FOUND');
    }

    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (data.username && data.username !== existing.username) {
      const cleanUsername = slugify(data.username);
      const { data: taken } = await supabase
        .from('users')
        .select('id')
        .eq('username', cleanUsername)
        .neq('id', userId)
        .single();

      if (taken) {
        throw new Error('USERNAME_TAKEN');
      }
      updates.username = cleanUsername;
    }

    if (data.name !== undefined) updates.name = data.name.trim();
    if (data.role !== undefined) updates.role = data.role.trim();
    if (data.organisation !== undefined) updates.organisation = data.organisation.trim();
    if (data.country !== undefined) updates.country = data.country.trim();
    if (data.city !== undefined) updates.city = data.city.trim();
    if (data.bio !== undefined) updates.bio = data.bio.trim();
    
    if (data.profileImage !== undefined) {
      updates.profile_image = await uploadAvatarIfBase64(userId, data.profileImage.trim(), existing.profileImage);
    }
    
    if (data.preferredLanguage !== undefined) updates.preferred_language = data.preferredLanguage.trim();
    
    // Explicit visibility state transitions
    if (data.status !== undefined) {
      updates.status = data.status;
      if (data.status === 'draft') {
        updates.is_discoverable = false;
      } else if (data.status === 'published') {
        updates.is_discoverable = data.isDiscoverable !== false;
      }
    } else if (data.isDiscoverable !== undefined) {
      updates.is_discoverable = data.isDiscoverable;
    }

    if (data.isDeactivated !== undefined) updates.is_deactivated = data.isDeactivated;
    if (data.passwordHash !== undefined) updates.password_hash = data.passwordHash;

    const { data: updatedRows, error: userUpdateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select();

    if (userUpdateError) {
      throw new Error(`Failed to update profile: ${userUpdateError.message}`);
    }
    if (!updatedRows || updatedRows.length === 0) {
      throw new Error(`No user row matched ID ${userId} for update`);
    }

    // Synchronize categories
    if (relations?.categoryIds !== undefined) {
      const { error: delCatErr } = await supabase.from('user_categories').delete().eq('user_id', userId);
      if (delCatErr) {
        throw new Error(`Failed to update categories: ${delCatErr.message}`);
      }

      if (relations.categoryIds && relations.categoryIds.length > 0) {
        const categories = await this.getCategories();
        const rowsToInsert: { user_id: string; category_id: string }[] = [];

        for (const catId of relations.categoryIds) {
          const found = categories.find(c => c.id === catId || c.slug === catId);
          if (found) {
            rowsToInsert.push({ user_id: userId, category_id: found.id });
          }
        }
        if (rowsToInsert.length > 0) {
          const { error: insCatErr } = await supabase.from('user_categories').insert(rowsToInsert);
          if (insCatErr) {
            throw new Error(`Failed to insert categories: ${insCatErr.message}`);
          }
        }
      }
    }

    // Synchronize skills
    if (relations?.skills !== undefined) {
      const { error: delSkillErr } = await supabase.from('user_skills').delete().eq('user_id', userId);
      if (delSkillErr) {
        throw new Error(`Failed to update skills: ${delSkillErr.message}`);
      }

      if (relations.skills && relations.skills.length > 0) {
        const rowsToInsert: { user_id: string; skill_id: string }[] = [];

        for (const skillName of relations.skills) {
          if (skillName.trim()) {
            const skill = await this.getOrCreateSkill(skillName);
            if (!rowsToInsert.some(r => r.skill_id === skill.id)) {
              rowsToInsert.push({ user_id: userId, skill_id: skill.id });
            }
          }
        }
        if (rowsToInsert.length > 0) {
          const { error: insSkillErr } = await supabase.from('user_skills').insert(rowsToInsert);
          if (insSkillErr) {
            throw new Error(`Failed to insert skills: ${insSkillErr.message}`);
          }
        }
      }
    }

    // Synchronize interests
    if (relations?.interests !== undefined) {
      const { error: delIntErr } = await supabase.from('user_interests').delete().eq('user_id', userId);
      if (delIntErr) {
        throw new Error(`Failed to update interests: ${delIntErr.message}`);
      }

      if (relations.interests && relations.interests.length > 0) {
        const rowsToInsert: { user_id: string; interest_id: string }[] = [];

        for (const intName of relations.interests) {
          if (intName.trim()) {
            const interest = await this.getOrCreateInterest(intName);
            if (!rowsToInsert.some(r => r.interest_id === interest.id)) {
              rowsToInsert.push({ user_id: userId, interest_id: interest.id });
            }
          }
        }
        if (rowsToInsert.length > 0) {
          const { error: insIntErr } = await supabase.from('user_interests').insert(rowsToInsert);
          if (insIntErr) {
            throw new Error(`Failed to insert interests: ${insIntErr.message}`);
          }
        }
      }
    }

    // Synchronize languages
    if (relations?.languageCodes !== undefined) {
      const { error: delLangErr } = await supabase.from('user_languages').delete().eq('user_id', userId);
      if (delLangErr) {
        throw new Error(`Failed to update languages: ${delLangErr.message}`);
      }

      if (relations.languageCodes && relations.languageCodes.length > 0) {
        const rowsToInsert: { user_id: string; language_id: string }[] = [];

        for (const langCode of relations.languageCodes) {
          if (langCode.trim()) {
            const lang = await this.getOrCreateLanguage(langCode, langCode);
            if (!rowsToInsert.some(r => r.language_id === lang.id)) {
              rowsToInsert.push({ user_id: userId, language_id: lang.id });
            }
          }
        }
        if (rowsToInsert.length > 0) {
          const { error: insLangErr } = await supabase.from('user_languages').insert(rowsToInsert);
          if (insLangErr) {
            throw new Error(`Failed to insert languages: ${insLangErr.message}`);
          }
        }
      }
    }

    // Synchronize professional links
    if (relations?.links !== undefined) {
      const { error: delLinksErr } = await supabase.from('professional_links').delete().eq('user_id', userId);
      if (delLinksErr) {
        throw new Error(`Failed to update professional links: ${delLinksErr.message}`);
      }

      if (relations.links && relations.links.length > 0) {
        const rowsToInsert = relations.links
          .filter(link => link.url && link.url.trim())
          .map(link => ({
            id: link.id || `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            user_id: userId,
            platform: link.platform,
            url: link.url.trim(),
            title: link.title || '',
          }));

        if (rowsToInsert.length > 0) {
          const { error: insLinksErr } = await supabase.from('professional_links').insert(rowsToInsert);
          if (insLinksErr) {
            throw new Error(`Failed to insert professional links: ${insLinksErr.message}`);
          }
        }
      }
    }

    const updatedUser = mapUserRowToUser(updatedRows[0]);
    const profile = await this.assembleUserProfile(updatedUser);
    return sanitizeSessionUser(profile);
  }

  public async deleteUser(userId: string): Promise<boolean> {
    const existing = await this.getUserById(userId);
    if (existing && existing.profileImage && existing.profileImage.includes('/avatars/')) {
      const fileName = existing.profileImage.split('/avatars/').pop()?.split('?')[0];
      if (fileName) {
        supabase.storage.from('avatars').remove([fileName]).catch(() => {});
      }
    }
    const { error } = await supabase.from('users').delete().eq('id', userId);
    return !error;
  }

  public async deactivateUser(userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('users')
      .update({
        is_deactivated: true,
        status: 'draft',
        is_discoverable: false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    return !error;
  }

  // --- Password Reset Operations ---
  public async createPasswordReset(email: string): Promise<{ success: boolean; rawToken?: string; email?: string }> {
    const user = await this.getUserByEmail(email);
    if (!user || user.isDeactivated) {
      // Return generic success to prevent email enumeration
      return { success: true };
    }

    const { rawToken, hashedToken } = generateResetToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour expiration

    // Invalidate existing unused tokens for this user
    await supabase
      .from('password_resets')
      .update({ used_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('used_at', null);

    const resetId = `rst_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const { error } = await supabase.from('password_resets').insert({
      id: resetId,
      user_id: user.id,
      token_hash: hashedToken,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Failed to create password reset record:', error);
      return { success: true };
    }

    return { success: true, rawToken, email: user.email };
  }

  public async verifyPasswordResetToken(rawToken: string): Promise<{ valid: boolean; userId?: string }> {
    if (!rawToken || typeof rawToken !== 'string') {
      return { valid: false };
    }

    const hashedToken = hashResetToken(rawToken);
    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from('password_resets')
      .select('id, user_id, expires_at, used_at')
      .eq('token_hash', hashedToken)
      .is('used_at', null)
      .gt('expires_at', now)
      .single();

    if (error || !data) {
      return { valid: false };
    }

    return { valid: true, userId: data.user_id };
  }

  public async resetPasswordWithToken(rawToken: string, newPasswordHash: string): Promise<{ success: boolean; error?: string }> {
    const verification = await this.verifyPasswordResetToken(rawToken);
    if (!verification.valid || !verification.userId) {
      return { success: false, error: 'INVALID_OR_EXPIRED_TOKEN' };
    }

    const hashedToken = hashResetToken(rawToken);
    const now = new Date().toISOString();

    // 1. Mark token as used
    await supabase
      .from('password_resets')
      .update({ used_at: now })
      .eq('token_hash', hashedToken);

    // 2. Update user's password
    const { error: userError } = await supabase
      .from('users')
      .update({
        password_hash: newPasswordHash,
        updated_at: now,
      })
      .eq('id', verification.userId);

    if (userError) {
      return { success: false, error: 'FAILED_TO_UPDATE_PASSWORD' };
    }

    return { success: true };
  }

  // --- Dynamic Search and Discovery (Real Database Execution) ---
  public async getPublishedUsers(filters: SearchFilters = {}): Promise<SearchResult> {
    const { data: usersData, error } = await supabase
      .from('users')
      .select('*')
      .eq('status', 'published')
      .eq('is_discoverable', true)
      .eq('is_deactivated', false)
      .order('updated_at', { ascending: false });

    if (error || !usersData) {
      return { users: [], total: 0, page: 1, totalPages: 1 };
    }

    let users = usersData.map(mapUserRowToUser).filter(u => this.isProfileComplete(u));

    if (filters.excludeUserId) {
      users = users.filter(u => u.id !== filters.excludeUserId);
    }

    if (filters.countries && filters.countries.length > 0) {
      users = users.filter(u =>
        filters.countries!.some(c => u.country.toLowerCase() === c.toLowerCase().trim())
      );
    }

    const fullProfiles = await Promise.all(users.map(u => this.assembleUserProfile(u)));
    let candidates = fullProfiles;

    if (filters.categorySlugs && filters.categorySlugs.length > 0) {
      candidates = candidates.filter(profile =>
        filters.categorySlugs!.some(slug =>
          profile.categories.some(c => c.slug.toLowerCase() === slug.toLowerCase() || c.name.toLowerCase() === slug.toLowerCase())
        )
      );
    }

    if (filters.skillNames && filters.skillNames.length > 0) {
      candidates = candidates.filter(profile =>
        filters.skillNames!.every(skillFilter =>
          profile.skills.some(s => s.name.toLowerCase() === skillFilter.toLowerCase() || s.slug === slugify(skillFilter))
        )
      );
    }

    if (filters.interestNames && filters.interestNames.length > 0) {
      candidates = candidates.filter(profile =>
        filters.interestNames!.some(intFilter =>
          profile.interests.some(i => i.name.toLowerCase() === intFilter.toLowerCase() || i.slug === slugify(intFilter))
        )
      );
    }

    if (filters.languageCodes && filters.languageCodes.length > 0) {
      candidates = candidates.filter(profile =>
        filters.languageCodes!.some(code =>
          profile.languages.some(l => l.code.toLowerCase() === code.toLowerCase() || l.name.toLowerCase() === code.toLowerCase())
        )
      );
    }

    if (filters.query && filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const terms = q.split(/\s+/).filter(Boolean);

      candidates = candidates.filter(profile => {
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

    const total = candidates.length;
    const page = Math.max(1, filters.page || 1);
    const limit = Math.max(1, filters.limit || 24);
    const totalPages = Math.ceil(total / limit) || 1;
    const paginated = candidates.slice((page - 1) * limit, page * limit);

    return {
      users: paginated.map(sanitizePublicProfile),
      total,
      page,
      totalPages,
    };
  }

  // --- Aggregations & Metrics ---
  public async getCategoryStats(): Promise<{ category: Category; count: number }[]> {
    const categories = await this.getCategories();
    const { data: userCatData } = await supabase
      .from('user_categories')
      .select('category_id, user:users(id, status, is_discoverable, is_deactivated, name, role)');

    const countMap: Record<string, number> = {};
    if (userCatData) {
      for (const item of userCatData) {
        const user: any = item.user;
        if (
          user &&
          user.status === 'published' &&
          user.is_discoverable !== false &&
          !user.is_deactivated &&
          user.name?.trim() &&
          user.role?.trim()
        ) {
          countMap[item.category_id] = (countMap[item.category_id] || 0) + 1;
        }
      }
    }

    return categories.map(category => ({
      category,
      count: countMap[category.id] || 0,
    }));
  }

  public async getCountriesWithCounts(): Promise<{ country: string; count: number }[]> {
    const { data } = await supabase
      .from('users')
      .select('country, name, role')
      .eq('status', 'published')
      .eq('is_discoverable', true)
      .eq('is_deactivated', false)
      .neq('country', '');

    if (!data) return [];

    const countMap: Record<string, number> = {};
    for (const u of data) {
      if (u.name?.trim() && u.role?.trim()) {
        const country = u.country.trim();
        if (country) {
          countMap[country] = (countMap[country] || 0) + 1;
        }
      }
    }

    return Object.entries(countMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  }

  public async getPlatformStats(): Promise<{
    totalPublished: number;
    totalSkills: number;
    totalCategories: number;
    totalCountries: number;
  }> {
    const [publishedUsers, skills, categories, countries] = await Promise.all([
      supabase
        .from('users')
        .select('country, name, role')
        .eq('status', 'published')
        .eq('is_discoverable', true)
        .eq('is_deactivated', false),
      supabase.from('skills').select('id', { count: 'exact', head: true }),
      supabase.from('categories').select('id', { count: 'exact', head: true }),
      this.getCountriesWithCounts(),
    ]);

    const eligibleUsers = (publishedUsers.data || []).filter(
      u => u.name?.trim() && u.role?.trim()
    );

    return {
      totalPublished: eligibleUsers.length,
      totalSkills: skills.count || 0,
      totalCategories: categories.count || 0,
      totalCountries: countries.length,
    };
  }

  public async getAllUsersAdmin(): Promise<UserProfile[]> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('is_deactivated', false)
      .order('created_at', { ascending: false });

    if (error || !data) return [];
    const users = data.map(mapUserRowToUser);
    const profiles = await Promise.all(users.map(u => this.assembleUserProfile(u)));
    return profiles.map(sanitizeSessionUser);
  }
}

export const db = new DatabaseManager();
