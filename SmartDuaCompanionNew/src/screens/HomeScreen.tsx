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
import { useThemeColors } from '../hooks/useThemeColors';

type NavigationProp = StackNavigationProp<RootStackParamList>;

const HomeScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { categories, loading: categoriesLoading, refresh: refreshCategories } = useCategories();
  const { duas, loading: duasLoading, refresh: refreshDuas } = useDuas();
  const language = useSelector((state: RootState) => state.settings.language);
  const colors = useThemeColors();

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
      {/* Welcome Section */}
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

      {/* 👇 NEW FEATURE: 99 Names of Allah Card 👇 */}
      <TouchableOpacity
        style={[styles.featureCard, { backgroundColor: colors.background.paper }]}
        onPress={() => navigation.navigate('NamesOfAllah')}
      >
        <View style={styles.featureIconContainer}>
          {/* Using 'star' icon, ensure it's available in FontAwesome5 or switch to 'mosque' */}
          <Icon name="star" size={30} color={colors.primary.main} solid />
        </View>
        <View style={styles.featureContent}>
          <Text style={[styles.featureTitle, { color: colors.text.primary }]}>
            {language === 'ur' ? 'اللہ کے ننانوے نام' : '99 Names of Allah'}
          </Text>
          <Text style={[styles.featureDescription, { color: colors.text.secondary }]}>
            {language === 'ur' 
               ? 'اللہ کے خوبصورت ناموں کو سیکھیں اور یاد کریں'
               : 'Learn and memorize the beautiful names of Allah'}
          </Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.text.secondary} />
      </TouchableOpacity>
      {/* 👆 END NEW FEATURE 👆 */}

      {/* Categories Section */}
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

      {/* Featured Duas Section */}
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
  
  // 👇 NEW STYLES for 99 Names Card 👇
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(212, 175, 55, 0.15)', // Gold tint
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: typography.sizes.md,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: typography.sizes.sm,
    lineHeight: 18,
  },
});

export default HomeScreen;