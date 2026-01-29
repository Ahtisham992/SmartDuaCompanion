// src/hooks/useThemeColors.ts
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { getThemeColors } from '../theme/colors';

export const useThemeColors = () => {
  const themeMode = useSelector((state: RootState) => state.settings.theme);
  return getThemeColors(themeMode);
};