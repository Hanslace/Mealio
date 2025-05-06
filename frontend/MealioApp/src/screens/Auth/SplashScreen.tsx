// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import {
  View, Text, Image, StyleSheet, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../navigation/RootNavigator';

type SplashNavProp = StackNavigationProp<RootStackParamList, 'Splash'>;

const SplashScreen = () => {
  const nav = useNavigation<SplashNavProp>();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // replace the Splash screen with the Auth flow (which starts at Login)
      nav.replace('Auth', {
        screen: 'Login',
        params: undefined
      });
          }, 2000);

    return () => clearTimeout(timeout);
  }, [nav]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={styles.container.backgroundColor}
      />
      <Image source={require('../../../assets/Mealio-Splash.png')} style={styles.logo} />
      <Text style={styles.tagline}>
        Your favorite meals{'\n'}delivered fast.
      </Text>
      <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E34E3A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: { width: 120, height: 120, marginBottom: 24 },
  tagline: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 32,
  },
  dotsContainer: { flexDirection: 'row' },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.3)',
    marginHorizontal: 6,
  },
  activeDot: { backgroundColor: 'rgba(0,0,0,0.6)' },
});

export default SplashScreen;
