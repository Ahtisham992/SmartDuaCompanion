// src/theme/colors.ts

// 1. Define Palettes
const lightColors = {
  primary: { main: '#2D5F3F', light: '#4A8B63', dark: '#1A3F2A' },
  secondary: { main: '#D4AF37', light: '#F0D97D', dark: '#8B7500' },
  background: { default: '#FAFAFA', paper: '#FFFFFF', subtle: '#F5F5F5' },
  text: { primary: '#2C2C2C', secondary: '#666666', arabic: '#000000', inverse: '#FFFFFF' },
  accent: { error: '#D32F2F', warning: '#FFA000', success: '#388E3C' },
};

const darkColors = {
  primary: { main: '#4A8B63', light: '#6BC48D', dark: '#2D5F3F' }, // Lighter green for dark mode
  secondary: { main: '#F0D97D', light: '#F8E8B0', dark: '#D4AF37' }, // Lighter gold
  background: { default: '#121212', paper: '#1E1E1E', subtle: '#2C2C2C' }, // Dark grays
  text: { primary: '#E0E0E0', secondary: '#B0B0B0', arabic: '#FFFFFF', inverse: '#121212' },
  accent: { error: '#EF5350', warning: '#FFCA28', success: '#66BB6A' },
};

// 2. Export a helper to get colors based on mode
export const getThemeColors = (mode: 'light' | 'dark') => {
  return mode === 'dark' ? darkColors : lightColors;
};

// 3. Keep default export for backward compatibility
export const colors = lightColors;