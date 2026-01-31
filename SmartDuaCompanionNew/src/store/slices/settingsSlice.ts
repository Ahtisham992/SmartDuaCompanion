// =====================================================
// src/store/slices/settingsSlice.ts
// UPDATED: Supports 'system' theme
// =====================================================
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the state interface locally to ensure 'system' is accepted
interface SettingsState {
  fontSize: 'small' | 'medium' | 'large';
  showTransliteration: boolean;
  showTranslation: boolean;
  audioAutoPlay: boolean;
  theme: 'light' | 'dark' | 'system'; // <--- ADDED 'system'
  language: 'en' | 'ur' | 'ar';
  notificationsEnabled: boolean;
}

const initialState: SettingsState = {
  fontSize: 'medium',
  showTransliteration: true,
  showTranslation: true,
  audioAutoPlay: false,
  theme: 'system', // <--- DEFAULT IS NOW SYSTEM
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
    // Updated to accept 'system'
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en' | 'ur' | 'ar'>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },
    updateSettings: (state, action: PayloadAction<Partial<SettingsState>>) => {
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