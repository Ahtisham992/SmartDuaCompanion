// src/store/slices/namesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AllahName {
  id: number;
  number: number;
  arabic: string;
  transliteration: string;
  translation: string;
  translationUrdu: string;
  meaning: string;
  meaningUrdu: string;
}

interface NamesState {
  names: AllahName[];
  favorites: number[]; // Array of name IDs
  searchQuery: string;
}

const initialState: NamesState = {
  names: [],
  favorites: [],
  searchQuery: '',
};

const namesSlice = createSlice({
  name: 'names',
  initialState,
  reducers: {
    setNames: (state, action: PayloadAction<AllahName[]>) => {
      state.names = action.payload;
    },
    toggleFavorite: (state, action: PayloadAction<number>) => {
      const nameId = action.payload;
      const index = state.favorites.indexOf(nameId);
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(nameId);
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setNames, toggleFavorite, setSearchQuery } = namesSlice.actions;
export default namesSlice.reducer;