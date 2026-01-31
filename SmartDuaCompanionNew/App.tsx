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

// --- Inner Component (Where Logic Lives) ---
const MainRoot = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [isShowSplash, setIsShowSplash] = useState(true);
  
  // Redux Hooks
  const dispatch = useDispatch<any>();
  const currentVersion = useSelector((state: RootState) => state.dua.version);

  // --- Auto-Update Check Logic ---
  useEffect(() => {
    const checkForUpdatesSilent = async () => {
      // 1. Check Network Status
      const state = await NetInfo.fetch();

      // Only proceed if on Wi-Fi
      if (state.type === 'wifi' && state.isConnected) {
        console.log('📶 Wi-Fi detected, checking for updates...');
        try {
          const response = await fetch(REMOTE_JSON_URL);
          if (response.ok) {
            const data = await response.json();
            const remoteVersion = data.version || 1;

            if (remoteVersion > currentVersion) {
              console.log(`🚀 Update found! V${currentVersion} -> V${remoteVersion}`);
              
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
        } catch (error) {
          console.log('Silent update check failed:', error);
        }
      }
    };

    checkForUpdatesSilent();
  }, []); // Run once on mount

  // --- Render Logic (Splash vs App) ---
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

// --- Main App Component ---
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