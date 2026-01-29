// =====================================================
// src/services/database/DatabaseService.ts
// UPDATED: Public Transform Methods to fix Update Crash
// =====================================================
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import { Dua, DuaCategory, DuaReference } from '../../types/dua.types';

// Import local data as fallback
import initialData from '../../data/initial-duas.json';

class DatabaseService {
  private static instance: DatabaseService;

  private readonly FAVORITES_KEY = '@favorites';
  private readonly RECENT_SEARCHES_KEY = '@recent_searches';
  private readonly PREFERENCES_KEY = '@preferences';
  private readonly LOCAL_DUAS_KEY = '@local_duas';
  private readonly LOCAL_CATEGORIES_KEY = '@local_categories';
  private readonly DATA_INITIALIZED_KEY = '@data_initialized';
  private readonly DATA_VERSION_KEY = '@data_version';

  private constructor() {
    this.initializeLocalData();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  // ==================== INITIALIZATION ====================

  private async initializeLocalData(): Promise<void> {
    try {
      const isInitialized = await AsyncStorage.getItem(this.DATA_INITIALIZED_KEY);
      
      if (!isInitialized) {
        console.log('📄 Initializing local data from JSON...');
        
        // Transform and save duas
        const transformedDuas = this.transformInitialDuas(initialData.duas);
        await AsyncStorage.setItem(this.LOCAL_DUAS_KEY, JSON.stringify(transformedDuas));
        
        // Transform and save categories
        const transformedCategories = this.transformInitialCategories(initialData.categories);
        await AsyncStorage.setItem(this.LOCAL_CATEGORIES_KEY, JSON.stringify(transformedCategories));
        
        // Save Version (Default to 1)
        const version = (initialData as any).version || 1;
        await AsyncStorage.setItem(this.DATA_VERSION_KEY, version.toString());

        // Mark as initialized
        await AsyncStorage.setItem(this.DATA_INITIALIZED_KEY, 'true');
        console.log('✅ Local data initialized successfully!');
      }
    } catch (error) {
      console.error('❌ Error initializing local data:', error);
    }
  }

  // ==================== TRANSFORM METHODS (NOW PUBLIC) ====================
  // These are public so the Update Action can use them to "clean" downloaded JSON

  public transformInitialDuas(duas: any[]): Dua[] {
    return duas.map(dua => {
      // Handle if category is an Object {id, name} or just a String
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
        // CRITICAL FIX: Always convert category object to a simple string name
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

  public transformInitialCategories(categories: any[]): DuaCategory[] {
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

  private transformReference(reference: any): DuaReference {
    if (!reference) return { source: 'other', authenticity: 'sahih' };
    
    // If it's already an object, use it
    if (reference.source) return reference as DuaReference;
    
    // If it's a string, try to parse it
    if (typeof reference === 'string') return this.parseReferenceString(reference);
    
    return { source: 'other', authenticity: 'sahih' };
  }

  private parseReferenceString(ref: string): DuaReference {
    // Detect Quran
    if (ref.toLowerCase().includes('quran') || ref.match(/\d+:\d+/)) {
      const match = ref.match(/(\d+):(\d+)/);
      return { 
        source: 'quran', 
        chapter: match ? match[1] : undefined, 
        verse: match ? match[2] : undefined 
      };
    }
    // Detect Hadith (Basic check)
    const hadithBooks = ['bukhari', 'muslim', 'tirmidhi', 'abu dawud', 'ibn majah', 'nisai', 'ahmad'];
    if (hadithBooks.some(book => ref.toLowerCase().includes(book))) {
       const bookName = ref.split(' ')[0];
       return { source: 'hadith', book: bookName, authenticity: 'sahih' };
    }
    return { source: 'other', authenticity: 'sahih' };
  }

  // ==================== UPDATE & VERSIONING ====================

  public async updateLocalData(duas: Dua[], categories: DuaCategory[], version: number): Promise<void> {
    try {
      console.log(`💾 Saving update (v${version}) to local storage...`);
      await AsyncStorage.setItem(this.LOCAL_DUAS_KEY, JSON.stringify(duas));
      await AsyncStorage.setItem(this.LOCAL_CATEGORIES_KEY, JSON.stringify(categories));
      await AsyncStorage.setItem(this.DATA_VERSION_KEY, version.toString());
      console.log('✅ Update installed successfully!');
    } catch (error) {
      console.error('❌ Error saving update:', error);
      throw error;
    }
  }

  public async getCurrentVersion(): Promise<number> {
    try {
      const version = await AsyncStorage.getItem(this.DATA_VERSION_KEY);
      return version ? parseInt(version, 10) : 1;
    } catch {
      return 1;
    }
  }

  // ==================== DUAS (OFFLINE PRIORITY) ====================

  async getAllDuas(): Promise<Dua[]> {
    // 1. Always return LOCAL data first. This ensures updates are shown.
    const localDuas = await this.getLocalDuas();
    if (localDuas.length > 0) {
      return localDuas;
    }
    
    // 2. Fallback to Firebase (Optional - only if local is empty)
    try {
        const snapshot = await firestore().collection('duas').orderBy('category').get();
        if (!snapshot.empty) {
           const duas: Dua[] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Dua));
           // Cache it for next time
           await this.updateLocalData(duas, await this.getCategories(), 1); 
           return duas;
        }
    } catch (err) {
        console.log("Offline mode: Firebase unreachable");
    }

    return [];
  }

  async getCategories(): Promise<DuaCategory[]> {
    const localCategories = await this.getLocalCategories();
    if (localCategories.length > 0) return localCategories;
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
        typeof dua.category === 'string' ? dua.category.toLowerCase() : '',
        ...(dua.tags || []).map(tag => tag.toLowerCase()),
        ...(dua.searchKeywords || []).map(kw => kw.toLowerCase()),
      ];
      return searchFields.some(field => field.includes(term));
    });
  }

  // ==================== FAVORITES & PREFERENCES ====================

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

  // ==================== HELPERS ====================

  private async getLocalDuas(): Promise<Dua[]> {
    const json = await AsyncStorage.getItem(this.LOCAL_DUAS_KEY);
    return json ? JSON.parse(json) : [];
  }

  private async getLocalCategories(): Promise<DuaCategory[]> {
    const json = await AsyncStorage.getItem(this.LOCAL_CATEGORIES_KEY);
    if (json) {
      const categories: DuaCategory[] = JSON.parse(json);
      const duas = await this.getLocalDuas();
      // Recalculate counts dynamically
      return categories.map(cat => ({
        ...cat,
        duaCount: duas.filter(d => d.categoryId === cat.id).length,
      }));
    }
    return this.getDefaultCategories();
  }

  private getDefaultCategories(): DuaCategory[] {
    return this.transformInitialCategories(initialData.categories);
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

  // ==================== UTILITY ====================

  async addRecentSearch(query: string): Promise<void> {
    const searches = await this.getRecentSearches();
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

  async resetData(): Promise<void> {
    await AsyncStorage.multiRemove([
      this.DATA_INITIALIZED_KEY,
      this.LOCAL_DUAS_KEY,
      this.LOCAL_CATEGORIES_KEY,
      this.DATA_VERSION_KEY,
    ]);
    await this.initializeLocalData();
  }
}

export default DatabaseService.getInstance();