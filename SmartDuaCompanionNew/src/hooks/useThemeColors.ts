// =====================================================
// src/hooks/useThemeColors.ts
// FIXED: Uses getThemeColors helper to avoid TypeScript error
// =====================================================
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
// ✅ Import the helper function, NOT just the colors object
import { getThemeColors } from '../theme/colors'; 

export const useThemeColors = () => {
  // 1. Get User Preference ('light', 'dark', or 'system')
  const themePreference = useSelector((state: RootState) => state.settings.theme);
  
  // 2. Get Device System Theme ('light' or 'dark')
  const systemScheme = useColorScheme(); 

  // 3. Resolve the Active Theme
  // If preference is 'system', use the device scheme. Otherwise use the preference.
  // We default to 'light' if systemScheme is null/undefined
  const activeTheme = themePreference === 'system' 
    ? (systemScheme || 'light') 
    : themePreference;

  // 4. Return the correct color set using the helper
  // This fixes the "Element implicitly has an 'any' type" error
  return getThemeColors(activeTheme);
};