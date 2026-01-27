// =====================================================
// src/components/dua/DuaCard.tsx
// UPDATED: DARK MODE SUPPORT
// =====================================================
import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Dua } from '../../types/dua.types';
import { RootState } from '../../store';
import { spacing, typography } from '../../theme';
import ArabicText from './ArabicText';
import { useThemeColors } from '../../hooks/useThemeColors'; // <--- IMPORT HOOK

interface DuaCardProps {
  dua: Dua;
  onPress: () => void;
  showFavorite?: boolean;
}

const DuaCard: React.FC<DuaCardProps> = ({ dua, onPress, showFavorite = false }) => {
  const language = useSelector((state: RootState) => state.settings.language);
  const showTransliteration = useSelector((state: RootState) => state.settings.showTransliteration);
  const fontSize = useSelector((state: RootState) => state.settings.fontSize);
  
  const colors = useThemeColors(); // <--- GET DYNAMIC COLORS

  const getTitle = () => {
    if (language === 'ur' && dua.titleUrdu) return dua.titleUrdu;
    if (language === 'ar' && dua.titleArabic) return dua.titleArabic;
    return dua.title;
  };

  const getTranslation = () => {
    if (language === 'ur' && dua.translationUrdu) return dua.translationUrdu;
    return dua.translation;
  };

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return typography.sizes.sm;
      case 'large': return typography.sizes.lg;
      default: return typography.sizes.md;
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: colors.background.paper, // Dynamic Background
          shadowColor: colors.text.primary, // Optional: adjust shadow color
          borderColor: colors.background.subtle,
          borderWidth: 1,
        }
      ]} 
      onPress={onPress}
    >
      <View style={styles.header}>
        <View style={[styles.categoryBadge, { backgroundColor: colors.primary.light }]}>
          <Text style={styles.categoryText}>{dua.category}</Text>
        </View>
        {showFavorite && dua.isFavorite && (
          <Icon name="heart" size={20} color={colors.accent.error} />
        )}
      </View>

      <Text 
        style={[styles.title, { fontSize: getFontSize(), color: colors.text.primary }]} 
        numberOfLines={1}
      >
        {getTitle()}
      </Text>

      {/* Note: Ensure ArabicText also handles colors or pass style to it */}
      <View style={{ marginBottom: spacing.sm }}>
         <ArabicText text={dua.arabicText} fontSize={fontSize} />
      </View>

      {showTransliteration && (
        <Text 
          style={[
            styles.transliteration, 
            { fontSize: getFontSize() - 2, color: colors.text.secondary }
          ]} 
          numberOfLines={2}
        >
          {dua.transliteration}
        </Text>
      )}

      <Text 
        style={[
          styles.translation, 
          { fontSize: getFontSize(), color: colors.text.primary }
        ]} 
        numberOfLines={3}
      >
        {getTranslation()}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: typography.sizes.xs,
    fontWeight: '600',
  },
  title: {
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  transliteration: {
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  translation: {
    marginTop: spacing.xs,
    lineHeight: 22,
  },
});

export default DuaCard;