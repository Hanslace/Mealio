// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import SplashScreen from '../screens/auth/SplashScreen';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import OwnerNavigator from './OwnerNavigator';
import DeliveryNavigator from './DeliveryNavigator';

import { NavigatorScreenParams } from '@react-navigation/native';
import { AuthStackParamList } from './AuthNavigator';
import { CustomerTabParamList } from './CustomerNavigator/CustomerTabNavigator';
import { OwnerDrawerParamList } from './OwnerNavigator/OwnerDrawerNavigator';
import { DeliveryStackParamList } from './DeliveryNavigator/DeliveryStackNavigator';

export type RootStackParamList = {
  Splash: undefined;
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Customer: NavigatorScreenParams<CustomerTabParamList>;
  Owner: NavigatorScreenParams<OwnerDrawerParamList>;
  Delivery: NavigatorScreenParams<DeliveryStackParamList>;
};


const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isLoading, isLoggedIn, userRole } = useAuth();

  // while loading, show splash:
  if (isLoading) {
    return <SplashScreen />;
  }

  return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* splash is still available if you ever want to re-show it */}
        <Stack.Screen name="Splash" component={SplashScreen} />

        {!isLoggedIn ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : userRole === 'customer' ? (
          <Stack.Screen name="Customer" component={CustomerNavigator} />
        ) : userRole === 'restaurant_owner' ? (
          <Stack.Screen name="Owner" component={OwnerNavigator} />
        ) : (
          <Stack.Screen name="Delivery" component={DeliveryNavigator} />
        )}
      </Stack.Navigator>
  );
}
