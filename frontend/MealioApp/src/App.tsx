// src/App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppProviders from './context/AppProviders';
import RootNavigator from './navigation/RootNavigator';
import SplashScreen   from './screens/auth/SplashScreen';
import { useAuth }    from './context/AuthContext';

function Gate() {
  const { isLoading } = useAuth();
  return isLoading
    ? <SplashScreen />    // now inside NavigationContainer
    : <RootNavigator />;
}

export default function App() {
  return (
    <AppProviders>
      <NavigationContainer>
        <Gate />
      </NavigationContainer>
    </AppProviders>
  );
}
