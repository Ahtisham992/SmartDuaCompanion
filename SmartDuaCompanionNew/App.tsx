// App.tsx (ROOT LEVEL)
import React, { useState, useEffect } from 'react';
import { StatusBar, useColorScheme, Alert, View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider, useDispatch } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import NetInfo from "@react-native-community/netinfo"; 

import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen';
import { store, persistor } from './src/store'; 
import { colors } from './src/theme';
import Loading from './src/components/common/Loading';
import { fetchRemoteUpdate } from './src/store/slices/duaSlice';
import DatabaseService from './src/services/database/DatabaseService'; // <--- Import DatabaseService

// Define your JSON URL
const REMOTE_JSON_URL = 'https://raw.githubusercontent.com/Ahtisham992/SmartDuaCompanion/main/SmartDuaCompanionNew/src/data/initial-duas.json';

// --- Inner Component (Logic Wrapper) ---
const MainRoot = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isShowSplash, setIsShowSplash] = useState(true);
  const dispatch = useDispatch<any>();

  // --- Auto-Update Check Logic ---
  useEffect(() => {
    let isMounted = true;

    const checkForUpdatesSilent = async () => {
      try {
        // 1. Check Network Status
        const state = await NetInfo.fetch();

        // Only proceed if on Wi-Fi and Component is still mounted
        if (isMounted && state.type === 'wifi' && state.isConnected) {
          console.log('📶 Wi-Fi detected, checking for updates...');
          
          // 2. Get TRUE Local Version from Database (Fixes the loop issue)
          const localVersion = await DatabaseService.getCurrentVersion();
          
          // 3. Fetch Remote Data
          const response = await fetch(REMOTE_JSON_URL);
          if (response.ok) {
            const data = await response.json();
            const remoteVersion = data.version || 1;

            console.log(`📊 Check: Local(${localVersion}) vs Remote(${remoteVersion})`);

            if (remoteVersion > localVersion) {
              Alert.alert(
                "New Update Available",
                "New Duas and translations are available. Would you like to update now?",
                [
                  { text: "Cancel", style: "cancel" },
                  { 
                    text: "Update Now", 
                    onPress: () => dispatch(fetchRemoteUpdate(REMOTE_JSON_URL))
                  }
                ]
              );
            }
          }
        }
      } catch (error) {
        console.log('Silent update check failed:', error);
      }
    };

    // Run the check
    checkForUpdatesSilent();

    return () => { isMounted = false; };
  }, []);

  // --- RENDER LOGIC ---
  
  // 1. Show Splash Screen first
  if (isShowSplash) {
    return <SplashScreen onFinish={() => setIsShowSplash(false)} />;
  }

  // 2. Show Main App
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

// --- Main App Entry Point ---
function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <MainRoot />
      </PersistGate>
    </Provider>
  );
}

export default App;