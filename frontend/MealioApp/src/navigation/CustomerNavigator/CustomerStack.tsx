import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../../screens/customer/HomeScreen';
import RestaurantDetailsScreen from '../../screens/customer/RestaurantDetailsScreen';
import SearchScreen from '../../screens/customer/SearchScreen';

import CartScreen from '../../screens/customer/CartScreen';
import CheckoutScreen from '../../screens/customer/CheckoutScreen';
import PaymentResultScreen from '../../screens/customer/PaymentResultScreen';

import OrderHistoryScreen from '../../screens/customer/OrderHistoryScreen';
import OrderDetailsScreen from '../../screens/customer/OrderDetailsScreen';
import OrderSupportChatScreen from '../../screens/customer/OrderSupportChatScreen';
import DeliveryTrackingScreen from '../../screens/customer/DeliveryTrackingScreen.tsx';

import CustomerProfileScreen from '../../screens/customer/ProfileScreen';
import NotificationsScreen from '../../screens/customer/NotificationsScreen';
import SettingsScreen from '../../screens/customer/SettingsScreen';
import FavoritesScreen from '../../screens/customer/FavoritesScreen';
import AddressBookScreen from '../../screens/customer/AddressBookScreen';
import PaymentMethodsScreen from '../../screens/customer/PaymentMethodsScreen';

export type CustomerStackParamList = {
  HomeMain: undefined;
  RestaurantDetails: { restaurantId: number };
  SearchMain: undefined;

  CartMain: undefined;
  Checkout: undefined;
  PaymentResult: { success: boolean; orderId: number };

  OrdersMain: undefined;
  OrderDetails: { orderId: number };
  OrderSupportChat: { orderId: number };
  DeliveryTracking: { orderId: number };

  ProfileMain: undefined;
  Notifications: undefined;
  Settings: undefined;
  Favorites: undefined;
  AddressBook: undefined;
  PaymentMethods: undefined;
  Offers: undefined;
};

const Stack = createStackNavigator<CustomerStackParamList>();

export function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: 'Home' }} />
      <Stack.Screen
        name="RestaurantDetails"
        component={RestaurantDetailsScreen}
        options={{ title: 'Restaurant' }}
      />
    </Stack.Navigator>
  );
}

export function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SearchMain" component={SearchScreen} options={{ title: 'Search' }} />
      <Stack.Screen
        name="RestaurantDetails"
        component={RestaurantDetailsScreen}
        options={{ title: 'Restaurant' }}
      />
    </Stack.Navigator>
  );
}

export function CartStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="CartMain" component={CartScreen} options={{ title: 'My Cart' }} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
      <Stack.Screen
        name="PaymentResult"
        component={PaymentResultScreen}
        options={{ title: 'Payment Result' }}
      />
      <Stack.Screen
        name="DeliveryTracking"
        component={DeliveryTrackingScreen}
        options={{ title: 'Track Order' }}
      />
    </Stack.Navigator>
  );
}

export function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrdersMain"
        component={OrderHistoryScreen}
        options={{ title: 'My Orders' }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={{ title: 'Order Details' }}
      />
      <Stack.Screen
        name="OrderSupportChat"
        component={OrderSupportChatScreen}
        options={{ title: 'Support Chat' }}
      />
      <Stack.Screen
        name="DeliveryTracking"
        component={DeliveryTrackingScreen}
        options={{ title: 'Track Order' }}
      />
    </Stack.Navigator>
  );
}

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={CustomerProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Stack.Screen
        name="AddressBook"
        component={AddressBookScreen}
        options={{ title: 'Your Addresses' }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethodsScreen}
        options={{ title: 'Payment Methods' }}
      />
    </Stack.Navigator>
  );
}
