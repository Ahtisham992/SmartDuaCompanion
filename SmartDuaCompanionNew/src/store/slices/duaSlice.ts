// =====================================================
// src/store/slices/duaSlice.ts
// UPDATED: Added fetchRemoteUpdate Action
// =====================================================
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Dua, DuaCategory } from '../../types/dua.types';
import DatabaseService from '../../services/database/DatabaseService';

interface DuaState {
  duas: Dua[];
  categories: DuaCategory[];
  favorites: string[];
  version: number; // <--- Added Version
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

// --- EXISTING THUNKS ---
export const fetchDuas = createAsyncThunk('dua/fetchDuas', async () => {
  return await DatabaseService.getAllDuas();
});

export const fetchCategories = createAsyncThunk('dua/fetchCategories', async () => {
  return await DatabaseService.getCategories();
});

export const fetchFavorites = createAsyncThunk('dua/fetchFavorites', async () => {
  return await DatabaseService.getFavorites();
});

export const toggleFavorite = createAsyncThunk(
  'dua/toggleFavorite',
  async (duaId: string) => {
    const isFavorite = await DatabaseService.toggleFavorite(duaId);
    return { duaId, isFavorite };
  }
);

// --- NEW UPDATE THUNK ---
// Fetches JSON from Firebase Storage and updates local DB
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
        // We throw a specific string to handle "Up to date" in UI gracefully
        return rejectWithValue('App is already up to date.');
      }

      // 2. Save to Offline Storage (Persistence)
      await DatabaseService.updateLocalData(data.duas, data.categories, newVersion);

      return {
        duas: data.duas,
        categories: data.categories,
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
      // Fetch Duas
      .addCase(fetchDuas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDuas.fulfilled, (state, action) => {
        state.loading = false;
        state.duas = action.payload;
      })
      .addCase(fetchDuas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch duas';
      })
      
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      
      // Fetch Favorites
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.favorites = action.payload;
      })
      
      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { duaId, isFavorite } = action.payload;
        if (isFavorite) {
          state.favorites.push(duaId);
        } else {
          state.favorites = state.favorites.filter(id => id !== duaId);
        }
      })

      // --- HANDLE UPDATE ---
      .addCase(fetchRemoteUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRemoteUpdate.fulfilled, (state, action) => {
        state.loading = false;
        state.duas = action.payload.duas;
        state.categories = action.payload.categories;
        state.version = action.payload.version;
      })
      .addCase(fetchRemoteUpdate.rejected, (state, action) => {
        state.loading = false;
        // Don't show error if it's just "up to date"
        if (action.payload !== 'App is already up to date.') {
           state.error = action.payload as string;
        }
      });
  },
});

export const { setError, clearError } = duaSlice.actions;
export default duaSlice.reducer;