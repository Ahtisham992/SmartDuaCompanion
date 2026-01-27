// src/screens/FavoritesScreen.tsx
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { useDuas } from '../hooks/useDuas';
import { RootState } from '../store';
import { RootStackParamList } from '../navigation/types';
import DuaCard from '../components/dua/DuaCard';
import Loading from '../components/common/Loading';
import { spacing } from '../theme';
import { useThemeColors } from '../hooks/useThemeColors'; // <--- IMPORT HOOK

type NavigationProp = StackNavigationProp<RootStackParamList>;

const FavoritesScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { duas, loading } = useDuas();
  const favorites = useSelector((state: RootState) => state.dua.favorites);
  const colors = useThemeColors(); // <--- GET COLORS

  const favoriteDuas = duas.filter((dua) => favorites.includes(dua.id));

  if (loading) return <Loading />;

  if (favoriteDuas.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background.default }]}>
        <Text style={[styles.emptyText, { color: colors.text.primary }]}>No favorite duas yet</Text>
        <Text style={[styles.emptySubtext, { color: colors.text.secondary }]}>
          Tap the heart icon on any dua to add it to favorites
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <FlatList
        data={favoriteDuas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DuaCard
            dua={item}
            onPress={() => navigation.navigate('DuaDetail', { duaId: item.id })}
          />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  list: { padding: spacing.md },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xl },
  emptyText: { fontSize: 18, fontWeight: '600', marginBottom: spacing.sm },
  emptySubtext: { fontSize: 14, textAlign: 'center' },
});

export default FavoritesScreen;