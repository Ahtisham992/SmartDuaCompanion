// src/screens/SplashScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, Dimensions, Text } from 'react-native';
import { colors } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Initial opacity 0
  const scaleAnim = useRef(new Animated.Value(0.8)).current; // Initial scale 0.8

  useEffect(() => {
    // 1. Fade In & Scale Up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // 2. Wait, then Finish
    const timer = setTimeout(() => {
      onFinish();
    }, 2500); // Show splash for 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* YOUR LOGO */}
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
        />
        
        {/* APP NAME */}
        <Text style={styles.text}>Smart Dua</Text>
        <Text style={styles.subText}>Companion</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary.main, // Islamic Green background
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  text: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    letterSpacing: 1,
  },
  subText: {
    fontSize: 16,
    color: colors.secondary.main, // Gold text
    letterSpacing: 4,
    marginTop: 5,
    textTransform: 'uppercase',
  },
});

export default SplashScreen;