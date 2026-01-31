// src/navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  DuaDetail: { duaId: string };
  Category: { categoryId: string; categoryName: string };
  NamesOfAllah: undefined;  // NEW: 99 Names screen
};

export type TabParamList = {
  Home: undefined;
  Search: undefined;
  Favorites: undefined;
  Tasbih: undefined;  // NEW: Tasbih Counter tab
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}