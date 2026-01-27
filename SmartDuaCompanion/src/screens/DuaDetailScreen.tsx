// =====================================================
// src/screens/DuaDetailScreen.tsx
// UPDATED: DARK MODE SUPPORT
// =====================================================
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDua } from '../hooks/useDua';
import { useFavorites } from '../hooks/useFavorites';
import { RootState } from '../store';
import { RootStackParamList } from '../navigation/types';
import type { Dua, DuaReference } from '../types/dua.types';
import ArabicText from '../components/dua/ArabicText';
import Loading from '../components/common/Loading';
import { spacing, typography } from '../theme';
import { useThemeColors } from '../hooks/useThemeColors'; // <--- IMPORT HOOK

type DuaDetailScreenRouteProp = RouteProp<RootStackParamList, 'DuaDetail'>;

const DuaDetailScreen = () => {
  const route = useRoute<DuaDetailScreenRouteProp>();
  const { duaId } = route.params;
  const { dua, loading } = useDua(duaId);
  const { isFavorite, toggleFavorite } = useFavorites(duaId);
  
  const colors = useThemeColors(); // <--- GET DYNAMIC COLORS

  const language = useSelector((state: RootState) => state.settings.language);
  const showTransliteration = useSelector((state: RootState) => state.settings.showTransliteration);
  const showTranslation = useSelector((state: RootState) => state.settings.showTranslation);
  const fontSize = useSelector((state: RootState) => state.settings.fontSize);

  if (loading || !dua) {
    return <Loading />;
  }

  const duaData: Dua = dua;

  const formatReference = (ref: string | DuaReference): string => {
    if (typeof ref === 'string') return ref;
    if (!ref || typeof ref !== 'object') return 'Authentic Source';
    if (ref.source === 'quran') return `Quran ${ref.chapter || ''} ${ref.verse || ''}`.trim();
    if (ref.source === 'hadith') {
      const parts = [ref.book];
      if (ref.hadithNumber) parts.push(ref.hadithNumber);
      if (ref.authenticity) parts.push(`(${ref.authenticity})`);
      return parts.filter(Boolean).join(' ');
    }
    return 'Authentic Source';
  };

  const getTitle = () => {
    if (language === 'ur' && duaData.titleUrdu) return duaData.titleUrdu;
    if (language === 'ar' && duaData.titleArabic) return duaData.titleArabic;
    return duaData.title;
  };

  const getTranslation = () => {
    if (language === 'ur' && duaData.translationUrdu) return duaData.translationUrdu;
    return duaData.translation;
  };

  const getBenefits = () => {
    if (language === 'ur' && duaData.benefitsUrdu) return duaData.benefitsUrdu;
    return duaData.benefits;
  };

  const getAdditionalNote = () => {
    if (language === 'ur' && duaData.additionalNoteUrdu) return duaData.additionalNoteUrdu;
    return duaData.additionalNote;
  };

  const getFontSize = () => {
    switch (fontSize) {
      case 'small': return typography.sizes.sm;
      case 'large': return typography.sizes.lg;
      default: return typography.sizes.md;
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background.default }]}>
      <View style={[styles.header, { 
        backgroundColor: colors.background.paper,
        borderBottomColor: colors.background.subtle 
      }]}>
        <Text style={[styles.title, { fontSize: getFontSize() + 4, color: colors.text.primary }]}>
          {getTitle()}
        </Text>
        <TouchableOpacity onPress={toggleFavorite} style={styles.favoriteButton}>
          <Icon
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={28}
            color={isFavorite ? colors.accent.error : colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      {/* Arabic Text Section */}
      <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
        <ArabicText text={duaData.arabicText} fontSize={fontSize} />
      </View>

      {/* Transliteration Section */}
      {showTransliteration && (
        <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
            {language === 'ur' ? 'تلفظ' : 'Transliteration'}
          </Text>
          <Text style={[styles.transliteration, { fontSize: getFontSize(), color: colors.text.primary }]}>
            {duaData.transliteration}
          </Text>
        </View>
      )}

      {/* Translation Section */}
      {showTranslation && (
        <View style={[styles.section, { backgroundColor: colors.background.paper }]}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
            {language === 'ur' ? 'ترجمہ' : 'Translation'}
          </Text>
          <Text style={[styles.translation, { fontSize: getFontSize(), color: colors.text.primary }]}>
            {getTranslation()}
          </Text>
        </View>
      )}

      {/* Benefits Section */}
      {getBenefits() && (
        <View style={[
          styles.section, 
          styles.benefitsSection,
          { 
            backgroundColor: colors.background.subtle, // Slightly different shade for quote boxes
            borderLeftColor: colors.primary.main
          }
        ]}>
          <View style={styles.benefitsHeader}>
            <Icon name="star-outline" size={20} color={colors.primary.main} />
            <Text style={[styles.sectionLabel, { color: colors.text.secondary, marginBottom: 0, marginLeft: 5 }]}>
              {language === 'ur' ? 'فوائد' : 'Benefits'}
            </Text>
          </View>
          <Text style={[styles.benefits, { fontSize: getFontSize(), color: colors.text.primary }]}>
            {getBenefits()}
          </Text>
        </View>
      )}

      {/* Note Section */}
      {getAdditionalNote() && (
        <View style={[
          styles.section, 
          styles.noteSection,
          { 
            backgroundColor: colors.background.subtle,
            borderLeftColor: '#2196F3'
          }
        ]}>
          <View style={styles.noteHeader}>
            <Icon name="information-outline" size={20} color={colors.primary.main} />
            <Text style={[styles.sectionLabel, { color: colors.text.secondary, marginBottom: 0, marginLeft: 5 }]}>
              {language === 'ur' ? 'نوٹ' : 'Note'}
            </Text>
          </View>
          <Text style={[styles.note, { fontSize: getFontSize(), color: colors.text.primary }]}>
            {getAdditionalNote()}
          </Text>
        </View>
      )}

      {/* Reference Section */}
      <View style={[styles.section, { backgroundColor: colors.background.default }]}>
        <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
          {language === 'ur' ? 'حوالہ' : 'Reference'}
        </Text>
        <Text style={[styles.reference, { color: colors.text.secondary }]}>
          {formatReference(duaData.reference)}
        </Text>
      </View>

      {/* Tags Section */}
      {duaData.tags && duaData.tags.length > 0 && (
        <View style={[styles.section, { backgroundColor: colors.background.default }]}>
          <Text style={[styles.sectionLabel, { color: colors.text.secondary }]}>
            {language === 'ur' ? 'متعلقہ عنوانات' : 'Related Topics'}
          </Text>
          <View style={styles.tagsContainer}>
            {duaData.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { backgroundColor: colors.primary.light }]}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={{ height: spacing.xl }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
  },
  title: {
    flex: 1,
    fontWeight: 'bold',
  },
  favoriteButton: {
    padding: spacing.sm,
  },
  section: {
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: '600',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  transliteration: {
    fontStyle: 'italic',
    lineHeight: 24,
  },
  translation: {
    lineHeight: 26,
  },
  benefitsSection: {
    borderLeftWidth: 4,
  },
  benefitsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  benefits: {
    lineHeight: 24,
    fontStyle: 'italic',
  },
  noteSection: {
    borderLeftWidth: 4,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  note: {
    lineHeight: 24,
  },
  reference: {
    fontSize: typography.sizes.sm,
    fontWeight: '500',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    color: '#fff',
    fontSize: typography.sizes.sm,
  },
});

export default DuaDetailScreen;