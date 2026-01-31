// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';
import TabNavigator from './TabNavigator';
import DuaDetailScreen from '../screens/DuaDetailScreen';
import CategoryScreen from '../screens/CategoryScreen';
import NamesOfAllahScreen from '../screens/NamesOfAllahScreen'; // NEW
import { colors } from '../theme';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary.main,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="MainTabs" 
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="DuaDetail" 
        component={DuaDetailScreen}
        options={{ title: 'Dua Details' }}
      />
      <Stack.Screen 
        name="Category" 
        component={CategoryScreen}
        options={({ route }) => ({ title: route.params.categoryName })}
      />
      {/* NEW: 99 Names of Allah Screen */}
      <Stack.Screen 
        name="NamesOfAllah" 
        component={NamesOfAllahScreen}
        options={{ title: '99 Names of Allah' }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;