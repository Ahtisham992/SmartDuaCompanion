// src/store/slices/searchSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Dua } from '../../types/dua.types';
import DatabaseService from '../../services/database/DatabaseService';

interface SearchState {
  query: string;
  results: Dua[];
  recentSearches: string[];
  loading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  query: '',
  results: [],
  recentSearches: [],
  loading: false,
  error: null,
};

export const searchDuas = createAsyncThunk(
  'search/searchDuas',
  async (query: string) => {
    const results = await DatabaseService.searchDuas(query);
    await DatabaseService.addRecentSearch(query);
    return results;
  }
);

export const fetchRecentSearches = createAsyncThunk(
  'search/fetchRecentSearches',
  async () => {
    return await DatabaseService.getRecentSearches();
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.error = null;
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      DatabaseService.clearRecentSearches();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchDuas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchDuas.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchDuas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Search failed';
      })
      .addCase(fetchRecentSearches.fulfilled, (state, action) => {
        state.recentSearches = action.payload;
      });
  },
});

export const { setQuery, clearSearch, clearRecentSearches } = searchSlice.actions;
export default searchSlice.reducer;