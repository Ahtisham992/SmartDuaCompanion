// App.tsx (ROOT LEVEL)
import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NetInfo from "@react-native-community/netinfo"; // <--- 1. Import NetInfo

import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { store, persistor, RootState } from './src/store'; // <--- Import RootState
import { colors } from './src/theme';
import Loading from './src/components/common/Loading';
import { fetchRemoteUpdate } from './src/store/slices/duaSlice'; // <--- Import Action

// Define your JSON URL
const REMOTE_JSON_URL = 'https://raw.githubusercontent.com/Ahtisham992/SmartDuaCompanion/main/SmartDuaCompanionNew/src/data/initial-duas.json';
// src/App.tsx

// 1. Add DatabaseService to imports
import DatabaseService from './src/services/database/DatabaseService'; 

// ... other imports (React, NetInfo, useDispatch, etc.) stay the same ...

const MainRoot = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isShowSplash, setIsShowSplash] = useState(true);
  
  const dispatch = useDispatch<any>();
  // ❌ REMOVED: const currentVersion = useSelector(...) -> potentially unreliable if persist fails

  useEffect(() => {
    const checkForUpdatesSilent = async () => {
      const state = await NetInfo.fetch();

      if (state.type === 'wifi' && state.isConnected) {
        console.log('📶 Wi-Fi detected, checking for updates...');
        try {
          // 1. Get the TRUE local version directly from storage
          const localVersion = await DatabaseService.getCurrentVersion();
          
          // 2. Get Remote Version
          const response = await fetch(REMOTE_JSON_URL);
          if (response.ok) {
            const data = await response.json();
            const remoteVersion = data.version || 1;

            console.log(`📊 Check: Local(${localVersion}) vs Remote(${remoteVersion})`);

            // 3. Compare
            if (remoteVersion > localVersion) {
              console.log('🚀 Update found! Prompting user...');
              Alert.alert(
                "New Update Available",
                "New Duas are available. Update now?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Update Now", 
                    // Update Redux AND Database
                    onPress: () => dispatch(fetchRemoteUpdate(REMOTE_JSON_URL))
                  }
                ]
              );
            } else {
              console.log('✅ App is up to date.');
            }
          }
        } catch (error) {
          console.log('Silent update check failed:', error);
        }
      }
    };

    checkForUpdatesSilent();
  }, []);

  if (isShowSplash) {
    return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={colors.background.default}
        />
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};