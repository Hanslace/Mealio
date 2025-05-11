import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';

import AuthNavigator     from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import OwnerNavigator    from './OwnerNavigator';
import DeliveryNavigator from './DeliveryNavigator';

export type RootStackParamList = {
  Auth:     undefined;
  Customer: undefined;
  Owner:    undefined;
  Delivery: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { isLoggedIn, userRole } = useAuth();   // ← no isLoading here

  // pick initial stack once
  let initial: keyof RootStackParamList;
  if (!isLoggedIn)                       initial = 'Auth';
  else if (userRole === 'customer')      initial = 'Customer';
  else if (userRole === 'restaurant_owner') initial = 'Owner';
  else                                    initial = 'Delivery';

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initial}
    >
      {!isLoggedIn && (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}

      {isLoggedIn && userRole === 'customer' && (
        <Stack.Screen name="Customer" component={CustomerNavigator} />
      )}
      {isLoggedIn && userRole === 'restaurant_owner' && (
        <Stack.Screen name="Owner" component={OwnerNavigator} />
      )}
      {isLoggedIn && userRole === 'delivery_personnel' && (
        <Stack.Screen name="Delivery" component={DeliveryNavigator} />
      )}
    </Stack.Navigator>
  );
}
