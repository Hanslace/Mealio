/* src/navigation/OwnerNavigator.tsx */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OrdersScreen from '../screens/RestaurantOwner/OrdersScreen';
import MenuManagementScreen from '../screens/RestaurantOwner/MenuManagementScreen';
import AnalyticsScreen from '../screens/RestaurantOwner/AnalyticsScreen';
import ChatScreen from '../screens/RestaurantOwner/ChatScreen';
import ProfileScreen from '../screens/RestaurantOwner/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function OwnerNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen
        name="MenuManagement"
        component={MenuManagementScreen}
        options={{ tabBarLabel: 'Menu' }}
      />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
