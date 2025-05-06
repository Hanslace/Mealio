import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import {
  DashboardStack,
  MenuStack,
  OrdersStack,
  CouponsStack,
  ChatStack,
  ProfileStack,
} from './OwnerStack';

export type OwnerDrawerParamList = {
  Dashboard: undefined;
  Menu: undefined;
  Orders: undefined;
  Coupons: undefined;
  Chat: undefined;
  Profile: undefined;
};

const Drawer = createDrawerNavigator<OwnerDrawerParamList>();

export default function OwnerDrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Dashboard">
      <Drawer.Screen name="Dashboard" component={DashboardStack} />
      <Drawer.Screen name="Menu" component={MenuStack} />
      <Drawer.Screen name="Orders" component={OrdersStack} />
      <Drawer.Screen name="Coupons" component={CouponsStack} />
      <Drawer.Screen name="Chat" component={ChatStack} />
      <Drawer.Screen name="Profile" component={ProfileStack} />
    </Drawer.Navigator>
  );
}
