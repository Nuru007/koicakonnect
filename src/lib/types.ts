export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  slug: string;
}

export interface Interest {
  id: string;
  name: string;
  slug: string;
}

export interface Language {
  id: string;
  name: string;
  code: string;
}

export interface ProfessionalLink {
  id?: string;
  userId?: string;
  platform: 'linkedin' | 'website' | 'github' | 'portfolio' | 'twitter' | 'other';
  url: string;
  title?: string;
}

export type ProfileStatus = 'draft' | 'published' | 'private';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  username: string;
  role: string;
  organisation: string;
  country: string;
  city: string;
  bio: string;
  profileImage: string;
  preferredLanguage: string;
  status: ProfileStatus;
  isDiscoverable?: boolean;
  isProfileComplete?: boolean;
  isDeactivated?: boolean;
  isAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  categories: Category[];
  skills: Skill[];
  interests: Interest[];
  languages: Language[];
  links: ProfessionalLink[];
}

export interface SearchFilters {
  query?: string;
  categorySlugs?: string[];
  skillNames?: string[];
  interestNames?: string[];
  countries?: string[];
  languageCodes?: string[];
  excludeUserId?: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  users: UserProfile[];
  total: number;
  page: number;
  totalPages: number;
}

export interface AuthSession {
  userId: string;
  email: string;
  username: string;
  name: string;
  role: string;
  isAdmin: boolean;
}
