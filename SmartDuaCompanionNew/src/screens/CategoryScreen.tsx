// =====================================================
// src/screens/CategoryScreen.tsx
// UPDATED: DARK MODE SUPPORT
// =====================================================
import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useDuasByCategory } from '../hooks/useDuasByCategory';
import { RootStackParamList } from '../navigation/types';
import DuaCard from '../components/dua/DuaCard';
import Loading from '../components/common/Loading';
import { spacing } from '../theme';
import { useThemeColors } from '../hooks/useThemeColors'; // <--- IMPORT HOOK

type CategoryScreenRouteProp = RouteProp<RootStackParamList, 'Category'>;
type NavigationProp = StackNavigationProp<RootStackParamList>;

const CategoryScreen = () => {
  const route = useRoute<CategoryScreenRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { categoryId } = route.params;
  const { duas, loading } = useDuasByCategory(categoryId);
  const colors = useThemeColors(); // <--- GET DYNAMIC COLORS

  if (loading) {
    return <Loading />;
  }

  if (duas.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background.default }]}>
        <Text style={[styles.emptyText, { color: colors.text.secondary }]}>
          No duas found in this category
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background.default }]}>
      <FlatList
        data={duas}
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
  container: {
    flex: 1,
  },
  list: {
    padding: spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // Background color set dynamically
  },
  emptyText: {
    fontSize: 16,
    // Color set dynamically
  },
});

export default CategoryScreen;