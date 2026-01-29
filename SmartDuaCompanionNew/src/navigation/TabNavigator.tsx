// src/navigation/TabNavigator.tsx
import React from 'react';
import { Image, StyleSheet, View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TabParamList } from './types';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { useThemeColors } from '../hooks/useThemeColors'; // <--- IMPORT HOOK

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator = () => {
  const colors = useThemeColors(); // <--- GET DYNAMIC COLORS

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary.main,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          backgroundColor: colors.background.paper, // Dark Mode Support
          borderTopColor: colors.background.subtle,
        },
        headerStyle: {
          backgroundColor: colors.primary.main, // Dark Mode Support
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