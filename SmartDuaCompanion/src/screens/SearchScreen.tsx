// src/screens/SearchScreen.tsx
import React, { useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSearch } from '../hooks/useSearch';
import { RootStackParamList } from '../navigation/types';
import SearchBar from '../components/search/SearchBar';
import DuaCard from '../components/dua/DuaCard';
import Loading from '../components/common/Loading';
import { spacing } from '../theme';
import { useThemeColors } from '../hooks/useThemeColors'; // <--- IMPORT HOOK

type NavigationProp = StackNavigationProp<RootStackParamList>;

const SearchScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { results, loading, performSearch } = useSearch();
  const [query, setQuery] = useState('');
  const colors = useThemeColors(); // <--- GET COLORS

  const handleSearch = (text: string) => {
    setQuery(text);
    if (text.length >= 2) performSearch(text);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <SearchBar value={query} onChangeText={handleSearch} />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuaCard
              dua={item}
              onPress={() => navigation.navigate('DuaDetail', { duaId: item.id })}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.md },
});

export default SearchScreen;