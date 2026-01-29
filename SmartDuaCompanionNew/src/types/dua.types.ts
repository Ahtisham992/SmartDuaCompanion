// =====================================================
// src/types/dua.types.ts
// Complete Type Definitions for Smart Dua Companion
// WITH BILINGUAL SUPPORT (English/Urdu)
// =====================================================

export interface DuaReference {
  source: 'quran' | 'hadith' | 'other';
  book?: string;
  chapter?: string;
  verse?: string;
  hadithNumber?: string;
  authenticity?: 'sahih' | 'hasan' | 'daif';
}

export interface Dua {
  id: string;
  title: string;
  titleArabic?: string;
  titleUrdu?: string;                // ADDED: Urdu title
  category: string;
  categoryId: string;
  arabicText: string;
  transliteration: string;
  translation: string;               // English translation
  translationUrdu?: string;          // ADDED: Urdu translation
  reference: DuaReference;
  source?: string;
  tags: string[];
  searchKeywords?: string[];
  isFavorite?: boolean;
  audioUrl?: string;
  benefits?: string;
  benefitsUrdu?: string;             // ADDED: Urdu benefits
  situation?: string;
  occasion?: string;
  additionalNote?: string;           // ADDED: Additional notes
  additionalNoteUrdu?: string;       // ADDED: Urdu additional notes
  isFeatured?: boolean;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface DuaCategory {
  id: string;
  name: string;
  nameArabic?: string;
  nameUrdu?: string;                 // ADDED: Urdu name
  description: string;
  descriptionUrdu?: string;          // ADDED: Urdu description
  icon: string;
  color: string;
  duaCount: number;
  order: number;
}

// Alias for backward compatibility
export interface Category extends DuaCategory {}

export interface SearchResult {
  dua: Dua;
  score: number;
  matchedFields: string[];
}

export interface DuaFilter {
  category?: string;
  tags?: string[];
  searchTerm?: string;
  favoritesOnly?: boolean;
}

// Alias for backward compatibility
export interface DuaFilters extends DuaFilter {}

export interface UserPreferences {
  fontSize: 'small' | 'medium' | 'large';
  showTransliteration: boolean;
  showTranslation: boolean;
  audioAutoPlay: boolean;
  theme: 'light' | 'dark';
  language: 'en' | 'ur' | 'ar';      // Language preference
  notificationsEnabled: boolean;
}

// Alias for backward compatibility
export interface UserSettings extends UserPreferences {}

export interface FavoriteDua {
  duaId: string;
  addedAt: Date;
}

export interface RecentSearch {
  query: string;
  timestamp: Date;
}

export interface DuaState {
  duas: Dua[];
  categories: DuaCategory[];
  favorites: string[];
  recentSearches: RecentSearch[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
}

export interface AudioState {
  isPlaying: boolean;
  currentDuaId: string | null;
  duration: number;
  currentTime: number;
}

export type FontSize = 'small' | 'medium' | 'large';
export type DuaSortBy = 'name' | 'category' | 'recent' | 'mostUsed';
export type DuaViewMode = 'card' | 'list' | 'compact';
export type Language = 'en' | 'ur' | 'ar';