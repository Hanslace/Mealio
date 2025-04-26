/* src/navigation/AppNavigator.tsx */
import React, { useContext } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import OwnerNavigator from './OwnerNavigator';
import DeliveryNavigator from './DeliveryNavigator';
import SplashScreen from '../screens/Auth/SplashScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isLoading, isLoggedIn, userRole } = useContext(AuthContext);

  if (isLoading) {
    // While checking stored login, show Splash
    return <SplashScreen />;
  }

  if (!isLoggedIn) {
    // Not logged in → Auth flow
    return <AuthNavigator />;
  }

  // Logged in: switch by role
  switch (userRole) {
    case 'customer':
      return <CustomerNavigator />;
    case 'restaurant_owner':
      return <OwnerNavigator />;
    case 'delivery_personnel':
      return <DeliveryNavigator />;
    default:
      return <AuthNavigator />;
  }
}
