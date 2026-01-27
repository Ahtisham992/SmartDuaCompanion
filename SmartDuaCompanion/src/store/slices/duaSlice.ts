// src/store/slices/duaSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Dua, DuaCategory } from '../../types/dua.types';
import DatabaseService from '../../services/database/DatabaseService';

interface DuaState {
  duas: Dua[];
  categories: DuaCategory[];
  favorites: string[];
  loading: boolean;
  error: string | null;
}

const initialState: DuaState = {
  duas: [],
  categories: [],
  favorites: [],
  loading: false,
  error: null,
};

// Async Thunks
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
      });
  },
});

export const { setError, clearError } = duaSlice.actions;
export default duaSlice.reducer;