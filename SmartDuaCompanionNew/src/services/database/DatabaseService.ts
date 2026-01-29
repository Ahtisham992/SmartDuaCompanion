// =====================================================
// src/services/database/DatabaseService.ts
// UPDATED: Offline-First + JSON Update Support
// =====================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Dua, DuaCategory, DuaReference } from '../../types/dua.types';

// Import local data as the default starting point
import initialData from '../../data/initial-duas.json';

class DatabaseService {
  private static instance: DatabaseService;

  // --- Storage Keys ---
  private readonly FAVORITES_KEY = '@favorites';
  private readonly RECENT_SEARCHES_KEY = '@recent_searches';
  private readonly PREFERENCES_KEY = '@preferences';
  private readonly LOCAL_DUAS_KEY = '@local_duas';
  private readonly LOCAL_CATEGORIES_KEY = '@local_categories';
  private readonly DATA_INITIALIZED_KEY = '@data_initialized';
  private readonly DATA_VERSION_KEY = '@data_version'; // <--- NEW: Tracks data version

  private constructor() {
    this.initializeLocalData();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // ==================== 1. INITIALIZATION ====================

  private async initializeLocalData(): Promise<void> {
    try {
      const isInitialized = await AsyncStorage.getItem(this.DATA_INITIALIZED_KEY);
      
      if (!isInitialized) {
        console.log('📄 Initializing local data from bundled JSON...');
        
        // 1. Transform and save Duas
        const transformedDuas = this.transformInitialDuas(initialData.duas);
        await AsyncStorage.setItem(this.LOCAL_DUAS_KEY, JSON.stringify(transformedDuas));
        
        // 2. Transform and save Categories
        const transformedCategories = this.transformInitialCategories(initialData.categories);
        await AsyncStorage.setItem(this.LOCAL_CATEGORIES_KEY, JSON.stringify(transformedCategories));
        
        // 3. Save Version (Default to 1 if missing in JSON)
        const version = (initialData as any).version || 1;
        await AsyncStorage.setItem(this.DATA_VERSION_KEY, version.toString());

        // 4. Mark as initialized
        await AsyncStorage.setItem(this.DATA_INITIALIZED_KEY, 'true');
        console.log(`✅ Local data initialized successfully (Version ${version})!`);
      }
    } catch (error) {
      console.error('❌ Error initializing local data:', error);
    }
  }

  // ==================== 2. DATA UPDATE METHODS (NEW) ====================

  /**
   * Saves the new data fetched from Firebase Storage (JSON) to the device.
   * This is called by the 'fetchRemoteUpdate' Thunk in duaSlice.ts.
   */
  public async updateLocalData(duas: Dua[], categories: DuaCategory[], version: number): Promise<void> {
    try {
      console.log(`💾 Saving update (v${version}) to local storage...`);
      
      // Save Duas
      await AsyncStorage.setItem(this.LOCAL_DUAS_KEY, JSON.stringify(duas));
      
      // Save Categories
      await AsyncStorage.setItem(this.LOCAL_CATEGORIES_KEY, JSON.stringify(categories));
      
      // Update Version
      await AsyncStorage.setItem(this.DATA_VERSION_KEY, version.toString());
      
      console.log('✅ Update installed successfully!');
    } catch (error) {
      console.error('❌ Error saving update:', error);
      throw error;
    }
  }

  /**
   * Returns the current version of data installed on the device.
   */
  public async getCurrentVersion(): Promise<number> {
    try {
      const version = await AsyncStorage.getItem(this.DATA_VERSION_KEY);
      return version ? parseInt(version, 10) : 1;
    } catch {
      return 1;
    }
  }

  // ==================== 3. READ METHODS (OFFLINE FIRST) ====================

  async getAllDuas(): Promise<Dua[]> {
    // STRATEGY: Offline First.
    // We always load from AsyncStorage because that is where our "truth" lives
    // (either from initial install or subsequent updates).
    const localDuas = await this.getLocalDuas();
    
    if (localDuas.length > 0) {
      return localDuas;
    }

    // Fallback: If local storage is somehow empty, try initializing again or return empty.
    return []; 
  }

  async getCategories(): Promise<DuaCategory[]> {
    const categories = await this.getLocalCategories();
    
    if (categories.length > 0) {
      return categories;
    }
    
    return this.getDefaultCategories();
  }

  async getDuasByCategory(categoryId: string): Promise<Dua[]> {
    const localDuas = await this.getLocalDuas();
    return localDuas.filter(d => d.categoryId === categoryId);
  }

  async getDuaById(id: string): Promise<Dua | null> {
    const localDuas = await this.getLocalDuas();
    return localDuas.find(d => d.id === id) || null;
  }

  async searchDuas(query: string): Promise<Dua[]> {
    const allDuas = await this.getAllDuas();
    const term = query.toLowerCase();

    return allDuas.filter(dua => {
      const searchFields = [
        dua.title.toLowerCase(),
        dua.titleUrdu || '',
        dua.translation.toLowerCase(),
        dua.translationUrdu || '',
        dua.transliteration.toLowerCase(),
        dua.category.toLowerCase(), // Check if category name matches
        ...(dua.tags || []).map(tag => tag.toLowerCase()),
        ...(dua.searchKeywords || []).map(kw => kw.toLowerCase()),
      ];
      
      return searchFields.some(field => field.includes(term));
    });
  }

  // ==================== 4. FAVORITES & PREFERENCES ====================

  async getFavorites(): Promise<string[]> {
    const json = await AsyncStorage.getItem(this.FAVORITES_KEY);
    return json ? JSON.parse(json) : [];
  }

  async addFavorite(duaId: string): Promise<void> {
    const favorites = await this.getFavorites();
    if (!favorites.includes(duaId)) {
      await AsyncStorage.setItem(this.FAVORITES_KEY, JSON.stringify([...favorites, duaId]));
    }
  }

  async removeFavorite(duaId: string): Promise<void> {
    const favorites = await this.getFavorites();
    await AsyncStorage.setItem(
      this.FAVORITES_KEY,
      JSON.stringify(favorites.filter(id => id !== duaId))
    );
  }

  async toggleFavorite(duaId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    const exists = favorites.includes(duaId);

    if (exists) {
      await this.removeFavorite(duaId);
      return false;
    }

    await this.addFavorite(duaId);
    return true;
  }

  async savePreferences(preferences: any): Promise<void> {
    await AsyncStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
  }

  async getPreferences(): Promise<any> {
    const json = await AsyncStorage.getItem(this.PREFERENCES_KEY);
    return json ? JSON.parse(json) : this.getDefaultPreferences();
  }

  // ==================== 5. RECENT SEARCHES ====================

  async addRecentSearch(query: string): Promise<void> {
    const searches = await this.getRecentSearches();
    // Add new query to start, remove duplicates, keep max 10
    const updated = [query, ...searches.filter(s => s !== query)].slice(0, 10);
    await AsyncStorage.setItem(this.RECENT_SEARCHES_KEY, JSON.stringify(updated));
  }

  async getRecentSearches(): Promise<string[]> {
    const json = await AsyncStorage.getItem(this.RECENT_SEARCHES_KEY);
    return json ? JSON.parse(json) : [];
  }

  async clearRecentSearches(): Promise<void> {
    await AsyncStorage.removeItem(this.RECENT_SEARCHES_KEY);
  }

  // ==================== 6. HELPER METHODS & TRANSFORMS ====================

  private async getLocalDuas(): Promise<Dua[]> {
    const json = await AsyncStorage.getItem(this.LOCAL_DUAS_KEY);
    return json ? JSON.parse(json) : [];
  }

  private async getLocalCategories(): Promise<DuaCategory[]> {
    const json = await AsyncStorage.getItem(this.LOCAL_CATEGORIES_KEY);
    if (json) {
      const categories: DuaCategory[] = JSON.parse(json);
      
      // Recalculate dua counts dynamically based on current duas
      const duas = await this.getLocalDuas();
      return categories.map(cat => ({
        ...cat,
        duaCount: duas.filter(d => d.categoryId === cat.id).length,
      }));
    }
    
    return this.getDefaultCategories();
  }

  // Resets everything to the factory state (bundled JSON)
  async resetData(): Promise<void> {
    await AsyncStorage.multiRemove([
      this.DATA_INITIALIZED_KEY,
      this.LOCAL_DUAS_KEY,
      this.LOCAL_CATEGORIES_KEY,
      this.DATA_VERSION_KEY,
    ]);
    await this.initializeLocalData();
  }

  private getDefaultPreferences() {
    return {
      fontSize: 'medium',
      showTransliteration: true,
      showTranslation: true,
      audioAutoPlay: false,
      theme: 'light',
      language: 'en',
      notificationsEnabled: true,
    };
  }

  private getDefaultCategories(): DuaCategory[] {
    // Fallback if async storage fails entirely
    return this.transformInitialCategories(initialData.categories);
  }

  // --- Data Transformation Helpers (For parsing raw JSON) ---

  private transformInitialDuas(duas: any[]): Dua[] {
    return duas.map(dua => {
      const categoryInfo = typeof dua.category === 'string' 
        ? { id: dua.category, name: dua.category }
        : dua.category;
      
      return {
        id: dua.id,
        title: dua.title,
        titleArabic: dua.titleArabic,
        titleUrdu: dua.titleUrdu,
        arabicText: dua.arabicText,
        transliteration: dua.transliteration,
        translation: dua.translation,
        translationUrdu: dua.translationUrdu,
        category: categoryInfo.name || categoryInfo.id,
        categoryId: categoryInfo.id,
        tags: dua.tags || [],
        searchKeywords: dua.searchKeywords || [],
        reference: this.transformReference(dua.reference),
        isFavorite: false,
        benefits: dua.benefits,
        benefitsUrdu: dua.benefitsUrdu,
        additionalNote: dua.additionalNote,
        additionalNoteUrdu: dua.additionalNoteUrdu,
        situation: dua.situation,
        occasion: dua.occasion || dua.situation,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });
  }

  private transformReference(reference: any): DuaReference {
    if (!reference) return { source: 'other', authenticity: 'sahih' };
    if (reference.source) return reference as DuaReference;
    if (typeof reference === 'string') return this.parseReferenceString(reference);
    return { source: 'other', authenticity: 'sahih' };
  }

  private parseReferenceString(ref: string): DuaReference {
    if (ref.toLowerCase().includes('quran') || ref.match(/\d+:\d+/)) {
      const match = ref.match(/(\d+):(\d+)/);
      return { source: 'quran', chapter: match ? match[1] : undefined, verse: match ? match[2] : undefined };
    }
    // Simple heuristic for hadith
    if (['bukhari', 'muslim', 'tirmidhi', 'abu dawud', 'ibn majah', 'nisai'].some(book => ref.toLowerCase().includes(book))) {
         return { source: 'hadith', book: ref, authenticity: 'sahih' };
    }
    return { source: 'other', authenticity: 'sahih' };
  }

  private transformInitialCategories(categories: any[]): DuaCategory[] {
    return categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      nameArabic: cat.nameArabic,
      nameUrdu: cat.nameUrdu,
      description: cat.nameArabic || cat.name,
      descriptionUrdu: cat.nameUrdu,
      icon: cat.icon,
      color: cat.color,
      duaCount: 0, 
      order: cat.order,
    }));
  }
}

export default DatabaseService.getInstance();