// =====================================================
// src/services/database/DatabaseService.ts
// UPDATED WITH BILINGUAL SUPPORT
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
        
        // Mark as initialized
        await AsyncStorage.setItem(this.DATA_INITIALIZED_KEY, 'true');
        console.log('✅ Local data initialized successfully!');
      }
    } catch (error) {
      console.error('❌ Error initializing local data:', error);
    }
  }

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
    if (!reference) {
      return {
        source: 'other',
        authenticity: 'sahih',
      };
    }

    // If it's already in the correct format
    if (reference.source) {
      return {
        source: reference.source,
        book: reference.book,
        chapter: reference.chapter,
        verse: reference.verse,
        hadithNumber: reference.hadithNumber,
        authenticity: reference.authenticity || 'sahih',
      };
    }

    // If it's a string, try to parse it
    if (typeof reference === 'string') {
      return this.parseReferenceString(reference);
    }

    return {
      source: 'other',
      authenticity: 'sahih',
    };
  }

  private parseReferenceString(ref: string): DuaReference {
    // Try to detect Quran reference
    if (ref.toLowerCase().includes('quran') || ref.match(/\d+:\d+/)) {
      const match = ref.match(/(\d+):(\d+)/);
      return {
        source: 'quran',
        chapter: match ? match[1] : undefined,
        verse: match ? match[2] : undefined,
      };
    }

    // Try to detect Hadith reference
    if (ref.toLowerCase().includes('bukhari') || 
        ref.toLowerCase().includes('muslim') ||
        ref.toLowerCase().includes('abu dawud') ||
        ref.toLowerCase().includes('tirmidhi')) {
      const book = ref.split(/\s+/)[0];
      const numberMatch = ref.match(/\d+/);
      return {
        source: 'hadith',
        book: book,
        hadithNumber: numberMatch ? numberMatch[0] : undefined,
        authenticity: 'sahih',
      };
    }

    return {
      source: 'other',
      authenticity: 'sahih',
    };
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
      duaCount: 0, // Will be calculated dynamically
      order: cat.order,
    }));
  }

  // ==================== DUAS ====================

  async getAllDuas(): Promise<Dua[]> {
    try {
      // Try Firebase first
      const snapshot = await firestore()
        .collection('duas')
        .orderBy('category')
        .get();

      if (!snapshot.empty) {
        const duas: Dua[] = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            titleArabic: data.titleArabic,
            titleUrdu: data.titleUrdu,
            arabicText: data.arabicText,
            transliteration: data.transliteration,
            translation: data.translation,
            translationUrdu: data.translationUrdu,
            category: data.category,
            categoryId: data.category,
            tags: data.tags || [],
            searchKeywords: data.searchKeywords || [],
            reference: data.reference,
            isFavorite: data.isFavorite || false,
            audioUrl: data.audioUrl,
            benefits: data.benefits,
            benefitsUrdu: data.benefitsUrdu,
            additionalNote: data.additionalNote,
            additionalNoteUrdu: data.additionalNoteUrdu,
            occasion: data.occasion,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          } as Dua;
        });
        
        await this.cacheDuasLocally(duas);
        return duas;
      }
    } catch (err) {
      console.log('📱 Using local data (Firebase not available)');
    }
    
    // Fallback to local data
    return this.getLocalDuas();
  }

  async getDuasByCategory(categoryId: string): Promise<Dua[]> {
    try {
      const snapshot = await firestore()
        .collection('duas')
        .where('categoryId', '==', categoryId)
        .get();

      if (!snapshot.empty) {
        return snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            categoryId: data.category || data.categoryId,
          } as Dua;
        });
      }
    } catch (err) {
      console.log('📱 Using local category data');
    }
    
    const localDuas = await this.getLocalDuas();
    return localDuas.filter(d => d.categoryId === categoryId);
  }

  async getDuaById(id: string): Promise<Dua | null> {
    try {
      const doc = await firestore()
        .collection('duas')
        .doc(id)
        .get();

      if (doc.exists) {
        const data = doc.data();
        if (data) {
          return {
            id: doc.id,
            ...data,
            categoryId: data.category || data.categoryId,
          } as Dua;
        }
      }
    } catch (err) {
      console.log('📱 Using local dua data');
    }
    
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
        dua.category.toLowerCase(),
        ...(dua.tags || []).map(tag => tag.toLowerCase()),
        ...(dua.searchKeywords || []).map(kw => kw.toLowerCase()),
      ];
      
      return searchFields.some(field => field.includes(term));
    });
  }

  // ==================== CATEGORIES ====================

  async getCategories(): Promise<DuaCategory[]> {
    try {
      const snapshot = await firestore()
        .collection('categories')
        .orderBy('order')
        .get();

      if (!snapshot.empty) {
        const categories = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            nameArabic: data.nameArabic,
            nameUrdu: data.nameUrdu,
            description: data.description,
            descriptionUrdu: data.descriptionUrdu,
            icon: data.icon,
            color: data.color,
            duaCount: data.duaCount || 0,
            order: data.order,
          } as DuaCategory;
        });
        
        await AsyncStorage.setItem(this.LOCAL_CATEGORIES_KEY, JSON.stringify(categories));
        return categories;
      }
    } catch (err) {
      console.log('📱 Using local categories');
    }
    
    return this.getLocalCategories();
  }

  private async getLocalCategories(): Promise<DuaCategory[]> {
    const json = await AsyncStorage.getItem(this.LOCAL_CATEGORIES_KEY);
    if (json) {
      const categories: DuaCategory[] = JSON.parse(json);
      
      // Calculate dua counts
      const duas = await this.getLocalDuas();
      return categories.map(cat => ({
        ...cat,
        duaCount: duas.filter(d => d.categoryId === cat.id).length,
      }));
    }
    
    return this.getDefaultCategories();
  }

  private getDefaultCategories(): DuaCategory[] {
    return [
      { 
        id: 'daily', 
        name: 'Daily Life', 
        nameUrdu: 'روزمرہ کی زندگی',
        description: 'Everyday supplications', 
        icon: 'sun', 
        color: '#F59E0B', 
        duaCount: 0, 
        order: 1 
      },
      { 
        id: 'sleep', 
        name: 'Sleep & Waking', 
        nameUrdu: 'سونا اور جاگنا',
        description: 'Before sleep and upon waking', 
        icon: 'moon', 
        color: '#8B5CF6', 
        duaCount: 0, 
        order: 2 
      },
      { 
        id: 'travel', 
        name: 'Travel', 
        nameUrdu: 'سفر',
        description: 'Duas for journeys', 
        icon: 'car', 
        color: '#3B82F6', 
        duaCount: 0, 
        order: 3 
      },
      { 
        id: 'food', 
        name: 'Food & Drink', 
        nameUrdu: 'کھانا اور پینا',
        description: 'Before and after meals', 
        icon: 'silverware-fork-knife', 
        color: '#10B981', 
        duaCount: 0, 
        order: 4 
      },
      { 
        id: 'anxiety', 
        name: 'Anxiety & Distress', 
        nameUrdu: 'پریشانی اور غم',
        description: 'For peace and calm', 
        icon: 'heart', 
        color: '#EF4444', 
        duaCount: 0, 
        order: 5 
      },
      { 
        id: 'study', 
        name: 'Study & Knowledge', 
        nameUrdu: 'تعلیم اور علم',
        description: 'For learning and work', 
        icon: 'book', 
        color: '#6366F1', 
        duaCount: 0, 
        order: 6 
      },
      { 
        id: 'home', 
        name: 'Home & Family', 
        nameUrdu: 'گھر اور خاندان',
        description: 'Home and family life', 
        icon: 'home', 
        color: '#EC4899', 
        duaCount: 0, 
        order: 7 
      },
      { 
        id: 'gratitude', 
        name: 'Gratitude & Praise', 
        nameUrdu: 'شکر اور حمد',
        description: 'Thankfulness to Allah', 
        icon: 'emoticon-happy', 
        color: '#14B8A6', 
        duaCount: 0, 
        order: 8 
      },
    ];
  }

  // ==================== FAVORITES ====================

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

  // ==================== LOCAL CACHE ====================

  private async cacheDuasLocally(duas: Dua[]): Promise<void> {
    await AsyncStorage.setItem(this.LOCAL_DUAS_KEY, JSON.stringify(duas));
  }

  private async getLocalDuas(): Promise<Dua[]> {
    const json = await AsyncStorage.getItem(this.LOCAL_DUAS_KEY);
    return json ? JSON.parse(json) : [];
  }

  // ==================== RECENT SEARCHES ====================

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

  // ==================== PREFERENCES ====================

  async savePreferences(preferences: any): Promise<void> {
    await AsyncStorage.setItem(this.PREFERENCES_KEY, JSON.stringify(preferences));
  }

  async getPreferences(): Promise<any> {
    const json = await AsyncStorage.getItem(this.PREFERENCES_KEY);
    return json ? JSON.parse(json) : this.getDefaultPreferences();
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

  async resetData(): Promise<void> {
    await AsyncStorage.multiRemove([
      this.DATA_INITIALIZED_KEY,
      this.LOCAL_DUAS_KEY,
      this.LOCAL_CATEGORIES_KEY,
    ]);
    await this.initializeLocalData();
  }
}

export default DatabaseService.getInstance();