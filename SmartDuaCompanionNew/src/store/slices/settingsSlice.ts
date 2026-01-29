// =====================================================
// src/store/slices/settingsSlice.ts
// Your existing settings slice - NO CHANGES NEEDED
// =====================================================
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserPreferences } from '../../types/dua.types';

const initialState: UserPreferences = {
  fontSize: 'medium',
  showTransliteration: true,
  showTranslation: true,
  audioAutoPlay: false,
  theme: 'light',
  language: 'en',
  notificationsEnabled: true,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
    },
    toggleTransliteration: (state) => {
      state.showTransliteration = !state.showTransliteration;
    },
    toggleTranslation: (state) => {
      state.showTranslation = !state.showTranslation;
    },
    toggleAudioAutoPlay: (state) => {
      state.audioAutoPlay = !state.audioAutoPlay;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'ur' | 'ar'>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    updateSettings: (state, action: PayloadAction<Partial<UserPreferences>>) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  updateFontSize,
  toggleTransliteration,
  toggleTranslation,
  toggleAudioAutoPlay,
  setTheme,
  setLanguage,
  toggleNotifications,
  updateSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;