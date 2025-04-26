/* src/navigation/CustomerNavigator.tsx */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Customer/HomeScreen';
import RestaurantDetailsScreen from '../screens/Customer/RestaurantDetailsScreen';
import MenuScreen from '../screens/Customer/MenuScreen';
import CartScreen from '../screens/Customer/CartScreen';
import OrdersScreen from '../screens/Customer/OrdersScreen';
import ProfileScreen from '../screens/Customer/ProfileScreen';

const HomeStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="RestaurantDetails" component={RestaurantDetailsScreen} />
      <HomeStack.Screen name="MenuScreen" component={MenuScreen} />
    </HomeStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function CustomerNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="HomeTab"
        component={HomeStackScreen}
        options={{ headerShown: false, tabBarLabel: 'Home' }}
      />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
