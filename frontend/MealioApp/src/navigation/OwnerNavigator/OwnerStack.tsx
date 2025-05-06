import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from '../../screens/owner/DashboardScreen';
import AnalyticsDashboardScreen from '../../screens/owner/AnalyticsDashboardScreen';
import RestaurantSettingsScreen from '../../screens/owner/RestaurantSettingsScreen';
import MenuItemsScreen from '../../screens/owner/MenuItemsScreen';
import MenuItemFormScreen from '../../screens/owner/MenuItemFormScreen';
import OrdersScreen from '../../screens/owner/OrdersScreen';
import OrderDetailsScreen from '../../screens/owner/OrderDetailsScreen';
import OrderSupportChatScreen from '../../screens/owner/OrderSupportChatScreen';
import CouponsScreen from '../../screens/owner/CouponsScreen';
import CouponFormScreen from '../../screens/owner/CouponFormScreen';
import ChatListScreen from '../../screens/owner/ChatListScreen';
import ChatRoomScreen from '../../screens/owner/ChatRoomScreen';
import OwnerProfileScreen from '../../screens/owner/ProfileScreen';
import NotificationsScreen from '../../screens/owner/NotificationsScreen';
import SettingsScreen from '../../screens/owner/SettingsScreen';

export type OwnerStackParamList = {
  DashboardMain: undefined;
  AnalyticsDashboard: undefined;
  RestaurantSettings: undefined;
  MenuItems: undefined;
  MenuItemForm: { itemId?: number };
  OrdersMain: undefined;
  OrderDetails: { orderId: number };
  OrderSupportChat: { orderId: number };
  CouponsMain: undefined;
  CouponForm: { couponId?: number };
  ChatList: undefined;
  ChatRoom: { chatRoomId: number };
  ProfileMain: undefined;
  Notifications: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<OwnerStackParamList>();

export function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="DashboardMain"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen
        name="AnalyticsDashboard"
        component={AnalyticsDashboardScreen}
        options={{ title: 'Analytics' }}
      />
      <Stack.Screen
        name="RestaurantSettings"
        component={RestaurantSettingsScreen}
        options={{ title: 'Restaurant Settings' }}
      />
    </Stack.Navigator>
  );
}

export function MenuStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MenuItems"
        component={MenuItemsScreen}
        options={{ title: 'Menu Items' }}
      />
      <Stack.Screen
        name="MenuItemForm"
        component={MenuItemFormScreen}
        options={{ title: 'Edit Item' }}
      />
    </Stack.Navigator>
  );
}

export function OrdersStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="OrdersMain"
        component={OrdersScreen}
        options={{ title: 'Orders' }}
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
    </Stack.Navigator>
  );
}

export function CouponsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="CouponsMain"
        component={CouponsScreen}
        options={{ title: 'Coupons' }}
      />
      <Stack.Screen
        name="CouponForm"
        component={CouponFormScreen}
        options={{ title: 'Create/Edit Coupon' }}
      />
    </Stack.Navigator>
  );
}

export function ChatStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ChatList" component={ChatListScreen} options={{ title: 'Chats' }} />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{ title: 'Conversation' }}
      />
    </Stack.Navigator>
  );
}

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ProfileMain"
        component={OwnerProfileScreen}
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
    </Stack.Navigator>
  );
}
