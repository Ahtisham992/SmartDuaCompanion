// src/store/slices/duaSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Dua, DuaCategory } from '../../types/dua.types';
import DatabaseService from '../../services/database/DatabaseService';

interface DuaState {
  duas: Dua[];
  categories: DuaCategory[];
  favorites: string[];
  version: number;
  loading: boolean;
  error: string | null;
}

const initialState: DuaState = {
  duas: [],
  categories: [],
  favorites: [],
  version: 1,
  loading: false,
  error: null,
};

// ... (Keep existing thunks: fetchDuas, fetchCategories, fetchFavorites, toggleFavorite) ...
export const fetchDuas = createAsyncThunk('dua/fetchDuas', async () => await DatabaseService.getAllDuas());
export const fetchCategories = createAsyncThunk('dua/fetchCategories', async () => await DatabaseService.getCategories());
export const fetchFavorites = createAsyncThunk('dua/fetchFavorites', async () => await DatabaseService.getFavorites());
export const toggleFavorite = createAsyncThunk('dua/toggleFavorite', async (duaId: string) => {
  const isFavorite = await DatabaseService.toggleFavorite(duaId);
  return { duaId, isFavorite };
});

// --- UPDATED FETCH REMOTE UPDATE ---
export const fetchRemoteUpdate = createAsyncThunk(
  'dua/fetchRemoteUpdate',
  async (url: string, { rejectWithValue }) => {
    try {
      console.log('☁️ Checking for updates from:', url);
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Could not download update file.');
      }

      const data = await response.json();
      
      // Basic validation
      if (!data.duas || !data.categories) {
        throw new Error('Invalid update file format.');
      }

      // Check Version
      const currentVersion = await DatabaseService.getCurrentVersion();
      const newVersion = data.version || 1;

      console.log(`📊 Current Version: ${currentVersion}, New Version: ${newVersion}`);

      if (newVersion <= currentVersion) {
        return rejectWithValue('App is already up to date.');
      }

      // --- 👇 CRITICAL FIX: Transform raw data before saving 👇 ---
      // This converts objects {id, name} into proper strings so the app doesn't crash
      const cleanedDuas = DatabaseService.transformInitialDuas(data.duas);
      const cleanedCategories = DatabaseService.transformInitialCategories(data.categories);

      // Save the CLEANED data
      await DatabaseService.updateLocalData(cleanedDuas, cleanedCategories, newVersion);

      return {
        duas: cleanedDuas,
        categories: cleanedCategories,
        version: newVersion
      };

    } catch (error: any) {
      return rejectWithValue(error.message || 'Update failed');
    }
  }
);

const duaSlice = createSlice({
  name: 'dua',
  initialState,
  reducers: {
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDuas.fulfilled, (state, action) => {
        state.loading = false;
        state.duas = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { duaId, isFavorite } = action.payload;
        if (isFavorite) {
          state.favorites.push(duaId);
        } else {
          state.favorites = state.favorites.filter(id => id !== duaId);
        }
      })
      // --- Update Logic ---
      .addCase(fetchRemoteUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemoteUpdate.fulfilled, (state, action) => {
        state.loading = false;
        // The payload is now CLEAN data
        state.duas = action.payload.duas;
        state.categories = action.payload.categories;
        state.version = action.payload.version;
      })
      .addCase(fetchRemoteUpdate.rejected, (state, action) => {
        state.loading = false;
        if (action.payload !== 'App is already up to date.') {
           state.error = action.payload as string;
        }
      });
  },
});

export const { setError, clearError } = duaSlice.actions;
export default duaSlice.reducer;