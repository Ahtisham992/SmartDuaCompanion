// =====================================================
// src/components/dua/ArabicText.tsx
// UPDATED WITH FONT SIZE SUPPORT
// =====================================================
import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';
import { colors, typography } from '../../theme';
import { useThemeColors } from '../../hooks/useThemeColors'; // <--- IMPORT HOOK

interface ArabicTextProps {
  text: string;
  numberOfLines?: number;
  style?: TextStyle;
  fontSize?: 'small' | 'medium' | 'large';
}

const ArabicText: React.FC<ArabicTextProps> = ({ 
  text, 
  numberOfLines, 
  style,
  fontSize = 'medium'
}) => {
  // Calculate font size based on setting
  const getArabicFontSize = () => {
    switch (fontSize) {
      case 'small':
        return typography.sizes.lg; // 18
      case 'large':
        return typography.sizes.xxl; // 28
      default:
        return typography.sizes.xl; // 24
    }
  };

  const colors = useThemeColors(); // <--- GET DYNAMIC COLORS
  

  const getLineHeight = () => {
    switch (fontSize) {
      case 'small':
        return 28;
      case 'large':
        return 44;
      default:
        return 36;
    }
  };

  return (
    <Text 
      style={[
        arabicStyles.text, 
        { 
          fontSize: getArabicFontSize(),
          lineHeight: getLineHeight(),
          color: colors.text.primary,
        },
        style
      ]} 
      numberOfLines={numberOfLines}
    >
      {text}
    </Text>
  );
};

const arabicStyles = StyleSheet.create({
  text: {
    textAlign: 'right',
    color: colors.text.arabic,
    fontWeight: '600',
    writingDirection: 'rtl', // Right-to-left for Arabic
  },
});

export default ArabicText;