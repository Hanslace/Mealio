import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import {
  HomeStack,
  SearchStack,
  CartStack,
  OrdersStack,
  ProfileStack,
} from './CustomerStack';

export type CustomerTabParamList = {
  Home: undefined;
  Search: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<CustomerTabParamList>();

export default function CustomerTabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Cart" component={CartStack} />
      <Tab.Screen name="Orders" component={OrdersStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}
