// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useCategories } from '../hooks/useCategories';
import { useDuas } from '../hooks/useDuas';
import { RootState } from '../store';
import { spacing, typography } from '../theme';
import Loading from '../components/common/Loading';
import { RootStackParamList } from '../navigation/types';
import DuaCard from '../components/dua/DuaCard';
import { useThemeColors } from '../hooks/useThemeColors'; // <--- IMPORT HOOK

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { categories, loading: categoriesLoading, refresh: refreshCategories } = useCategories();
  const { duas, loading: duasLoading, refresh: refreshDuas } = useDuas();
  const language = useSelector((state: RootState) => state.settings.language);
  const colors = useThemeColors(); // <--- GET COLORS

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshCategories(), refreshDuas()]);
    setRefreshing(false);
  }, [refreshCategories, refreshDuas]);

  const featuredDuas = duas.slice(0, 3);

  if (categoriesLoading || duasLoading) return <Loading />;

  const getCategoryName = (category: any) => {
    if (language === 'ur' && category.nameUrdu) return category.nameUrdu;
    if (language === 'ar' && category.nameArabic) return category.nameArabic;
    return category.name;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background.default }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary.main} />
      }
    >
      <View style={[styles.welcomeSection, { backgroundColor: colors.primary.main }]}>
        <View>
          <Text style={styles.welcomeText}>
            {language === 'ur' ? 'السلام علیکم' : 'As-salamu alaykum'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'ur' ? 'آپ پر سلامتی ہو' : 'May peace be upon you'}
          </Text>
        </View>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {language === 'ur' ? 'زمرہ کے لحاظ سے تلاش کریں' : 'Browse by Category'}
        </Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: category.color }]}
              onPress={() => navigation.navigate('Category', { categoryId: category.id, categoryName: getCategoryName(category) })}
            >
              <Icon name={category.icon} size={32} color="#fff" />
              <Text style={styles.categoryName}>{getCategoryName(category)}</Text>
              <Text style={styles.categoryCount}>
                {category.duaCount} {language === 'ur' ? 'دعائیں' : 'duas'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text.primary }]}>
          {language === 'ur' ? 'نمایاں دعائیں' : 'Featured Duas'}
        </Text>
        {featuredDuas.map((dua) => (
          <DuaCard key={dua.id} dua={dua} onPress={() => navigation.navigate('DuaDetail', { duaId: dua.id })} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  welcomeSection: { padding: spacing.lg, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo: { width: 50, height: 50, resizeMode: 'contain' },
  welcomeText: { fontSize: typography.sizes.xl, fontWeight: 'bold', color: '#fff', marginBottom: spacing.xs },
  subtitle: { fontSize: typography.sizes.md, color: '#fff', opacity: 0.9 },
  section: { padding: spacing.lg },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: 'bold', marginBottom: spacing.md },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: { width: '48%', padding: spacing.md, borderRadius: 12, marginBottom: spacing.md, alignItems: 'center', minHeight: 120, justifyContent: 'center' },
  categoryName: { fontSize: typography.sizes.md, fontWeight: '600', color: '#fff', marginTop: spacing.sm, textAlign: 'center' },
  categoryCount: { fontSize: typography.sizes.sm, color: '#fff', opacity: 0.8, marginTop: spacing.xs },
});

export default HomeScreen;