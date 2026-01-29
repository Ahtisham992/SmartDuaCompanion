// App.tsx (ROOT LEVEL - not in src/)
import React, { useState } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import AppNavigator from './src/navigation/AppNavigator';
import SplashScreen from './src/screens/SplashScreen'; // <--- 1. Import Splash Screen
import { store, persistor } from './src/store';
import { colors } from './src/theme';
import Loading from './src/components/common/Loading';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [isShowSplash, setIsShowSplash] = useState(true); // <--- 2. Add State

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        {/* 3. Logic: Show Splash OR Show Main App */}
        {isShowSplash ? (
          <SplashScreen onFinish={() => setIsShowSplash(false)} />
        ) : (
          <SafeAreaProvider>
            <NavigationContainer>
              <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={colors.background.default}
              />
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        )}
      </PersistGate>
    </Provider>
  );
}

export default App;