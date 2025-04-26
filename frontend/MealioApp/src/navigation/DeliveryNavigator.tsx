/* src/navigation/DeliveryNavigator.tsx */
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/DeliveryPersonnel/DashboardScreen';
import ActiveOrderScreen from '../screens/DeliveryPersonnel/ActiveOrderScreen';
import HistoryScreen from '../screens/DeliveryPersonnel/HistoryScreen';
import ProfileScreen from '../screens/DeliveryPersonnel/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function DeliveryNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="ActiveOrder" component={ActiveOrderScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
