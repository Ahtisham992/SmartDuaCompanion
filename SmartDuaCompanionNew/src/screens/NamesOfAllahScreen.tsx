// src/screens/NamesOfAllahScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '../store';
import { setNames, toggleFavorite, AllahName } from '../store/slices/namesSlice';
import { useThemeColors } from '../hooks/useThemeColors';
import { spacing, typography } from '../theme';

// Import the data
const namesData = require('../data/names-of-allah.json');

const NamesOfAllahScreen = () => {
  const dispatch = useDispatch();
  const colors = useThemeColors();
  const { names, favorites } = useSelector((state: RootState) => state.names);
  const language = useSelector((state: RootState) => state.settings.language);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredNames, setFilteredNames] = useState<AllahName[]>([]);

  // Load names on mount
  useEffect(() => {
    if (names.length === 0) {
      dispatch(setNames(namesData.names));
    }
  }, [dispatch, names.length]);

  // Filter names based on search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNames(names);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = names.filter(
        (name: AllahName) =>
          name.transliteration.toLowerCase().includes(query) ||
          name.translation.toLowerCase().includes(query) ||
          name.translationUrdu.includes(query) ||
          name.arabic.includes(query)
      );
      setFilteredNames(filtered);
    }
  }, [searchQuery, names]);

  const handleToggleFavorite = (nameId: number) => {
    dispatch(toggleFavorite(nameId));
  };

  const getTranslation = (name: AllahName) => {
    if (language === 'ur') return name.translationUrdu;
    return name.translation;
  };

  const getMeaning = (name: AllahName) => {
    if (language === 'ur') return name.meaningUrdu;
    return name.meaning;
  };

  const getText = (key: string) => {
    const translations: any = {
      title: {
        en: '99 Names of Allah',
        ur: 'اللہ کے ننانوے نام',
        ar: 'أسماء الله الحسنى',
      },
      search: {
        en: 'Search names...',
        ur: 'نام تلاش کریں...',
        ar: 'ابحث عن الأسماء...',
      },
    };
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  const renderNameCard = ({ item }: { item: AllahName }) => {
    const isFavorite = favorites.includes(item.id);

    return (
      <View style={[styles.nameCard, { backgroundColor: colors.background.paper }]}>
        {/* Header with number and favorite */}
        <View style={styles.cardHeader}>
          <View style={[styles.numberBadge, { backgroundColor: colors.primary.light }]}>
            <Text style={styles.numberText}>{item.number}</Text>
          </View>
          <TouchableOpacity onPress={() => handleToggleFavorite(item.id)}>
            <Icon
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.accent.error : colors.text.secondary}
            />
          </TouchableOpacity>
        </View>

        {/* Arabic Name */}
        <View style={styles.arabicSection}>
          <Text style={[styles.arabicText, { color: colors.text.arabic }]}>
            {item.arabic}
          </Text>
        </View>

        {/* Transliteration */}
        <Text style={[styles.transliteration, { color: colors.primary.main }]}>
          {item.transliteration}
        </Text>

        {/* Translation */}
        <Text style={[styles.translation, { color: colors.text.primary }]}>
          {getTranslation(item)}
        </Text>

        {/* Meaning */}
        <Text style={[styles.meaning, { color: colors.text.secondary }]}>
          {getMeaning(item)}
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: colors.background.paper }]}>
        <Icon name="magnify" size={24} color={colors.text.secondary} />
        <TextInput
          style={[styles.searchInput, { color: colors.text.primary }]}
          placeholder={getText('search')}
          placeholderTextColor={colors.text.secondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Icon name="close-circle" size={24} color={colors.text.secondary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Names List */}
      <FlatList
        data={filteredNames}
        renderItem={renderNameCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    margin: spacing.md,
    borderRadius: 12,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.md,
    paddingVertical: spacing.xs,
  },
  listContent: {
    padding: spacing.md,
  },
  nameCard: {
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  numberBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    color: '#fff',
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
  },
  arabicSection: {
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  arabicText: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  transliteration: {
    fontSize: typography.sizes.xl,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  translation: {
    fontSize: typography.sizes.lg,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  meaning: {
    fontSize: typography.sizes.md,
    lineHeight: 22,
    textAlign: 'center',
  },
});

export default NamesOfAllahScreen;