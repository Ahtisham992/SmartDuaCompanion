// src/navigation/TabNavigator.tsx
import React from 'react';
import { Image, StyleSheet, View, Text, Platform } from 'react-native'; // Added Platform for safety
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // <--- 1. Import Hook

import { TabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import TasbihScreen from '../screens/TasbihScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useThemeColors } from '../hooks/useThemeColors';

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets(); // <--- 2. Get Safe Area Values

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          // 3. FIX: Add system bottom bar height to the standard 60px
          height: 60 + (insets.bottom > 0 ? insets.bottom : 0), 
          
          // 4. FIX: Push content up so it's not covered by the black bar
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5, 
          
          paddingTop: 5,
          backgroundColor: colors.background.paper,
          borderTopColor: colors.background.subtle,
        },
        headerStyle: {
          backgroundColor: colors.primary.main,
          height: 110,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Smart Dua',
          tabBarLabel: 'Home',
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.headerLogo}
              />
              <Text style={styles.headerText}>Smart Dua</Text>
            </View>
          ),
          tabBarIcon: ({ size, focused }) => (
            <Image
              source={require('../assets/images/logo.png')}
              style={[
                styles.tabIcon,
                { 
                  width: size, 
                  height: size,
                  borderColor: focused ? colors.primary.main : 'transparent',
                  borderWidth: focused ? 1 : 0,
                }
              ]}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, size }) => <Icon name="magnify" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Tasbih"
        component={TasbihScreen}
        options={{
          title: 'Digital Tasbih',
          tabBarLabel: 'Tasbih',
          tabBarIcon: ({ color, size }) => <Icon name="counter" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{
          tabBarLabel: 'Favorites',
          tabBarIcon: ({ color, size }) => <Icon name="heart" size={size} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => <Icon name="cog" size={size} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabIcon: { borderRadius: 4, resizeMode: 'cover' },
  headerContainer: { flexDirection: 'row', alignItems: 'center' },
  headerLogo: { width: 32, height: 32, resizeMode: 'contain', marginRight: 10 },
  headerText: { color: '#fff', fontSize: 20, fontWeight: 'bold' }
});

export default TabNavigator;