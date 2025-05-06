/* src/App.tsx */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppProviders from './context/AppProviders';
import RootNavigator from './navigation/RootNavigator';

export default function App() {
  return (
    <AppProviders>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
    </AppProviders>
  );
}
