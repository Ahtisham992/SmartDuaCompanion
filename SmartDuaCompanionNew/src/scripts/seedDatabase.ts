// File: scripts/seedDatabase.ts
import firestore from '@react-native-firebase/firestore';
import initialData from '../data/initial-duas.json';

interface SeedResult {
  success: boolean;
  categoriesAdded: number;
  duasAdded: number;
  errors: string[];
}

async function seedDatabase(): Promise<SeedResult> {
  const result: SeedResult = {
    success: false,
    categoriesAdded: 0,
    duasAdded: 0,
    errors: [],
  };

  try {
    console.log('🌱 Starting database seeding...');

    // Seed Categories
    console.log('📁 Seeding categories...');
    const categoriesCollection = firestore().collection('categories');
    
    for (const category of initialData.categories) {
      try {
        await categoriesCollection.doc(category.id).set(category);
        result.categoriesAdded++;
        console.log(`✅ Added category: ${category.name}`);
      } catch (error) {
        const errorMsg = `Failed to add category ${category.id}: ${error}`;
        result.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    // Seed Duas
    console.log('📖 Seeding duas...');
    const duasCollection = firestore().collection('duas');
    
    for (const dua of initialData.duas) {
      try {
        await duasCollection.doc(dua.id).set({
          ...dua,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
        result.duasAdded++;
        console.log(`✅ Added dua: ${dua.title}`);
      } catch (error) {
        const errorMsg = `Failed to add dua ${dua.id}: ${error}`;
        result.errors.push(errorMsg);
        console.error(`❌ ${errorMsg}`);
      }
    }

    result.success = result.errors.length === 0;
    
    console.log('\n✨ Seeding completed!');
    console.log(`📊 Categories added: ${result.categoriesAdded}/${initialData.categories.length}`);
    console.log(`📊 Duas added: ${result.duasAdded}/${initialData.duas.length}`);
    
    if (result.errors.length > 0) {
      console.log(`⚠️  Errors encountered: ${result.errors.length}`);
    }

    return result;
  } catch (error) {
    console.error('💥 Fatal error during seeding:', error);
    result.errors.push(`Fatal error: ${error}`);
    return result;
  }
}

async function clearDatabase(): Promise<void> {
  console.log('🗑️  Clearing existing data...');
  
  try {
    // Clear duas
    const duasSnapshot = await firestore().collection('duas').get();
    const duasDeletions = duasSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(duasDeletions);
    console.log(`🗑️  Deleted ${duasSnapshot.size} duas`);

    // Clear categories
    const categoriesSnapshot = await firestore().collection('categories').get();
    const categoriesDeletions = categoriesSnapshot.docs.map(doc => doc.ref.delete());
    await Promise.all(categoriesDeletions);
    console.log(`🗑️  Deleted ${categoriesSnapshot.size} categories`);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

export { seedDatabase, clearDatabase };

// Usage in your app:
// import { seedDatabase, clearDatabase } from './scripts/seedDatabase';
// 
// // Clear and reseed
// await clearDatabase();
// const result = await seedDatabase();
// 
// // Or just seed (if empty)
// const result = await seedDatabase();