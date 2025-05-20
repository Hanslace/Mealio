import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import AssignmentsScreen from '../../screens/delivery/AssignmentsScreen';
import AssignmentDetailsScreen from '../../screens/delivery/AssignmentDetailsScreen';
import LiveMapScreen from '../../screens/delivery/LiveMapScreen';
import EarningsHistoryScreen from '../../screens/delivery/EarningsHistoryScreen';
import ChatListScreen from '../../screens/delivery/ChatListScreen';
import ChatRoomScreen from '../../screens/delivery/ChatRoomScreen';
import DeliveryProfileScreen from '../../screens/delivery/ProfileScreen';
import NotificationsScreen from '../../screens/delivery/NotificationsScreen';
import SettingsScreen from '../../screens/delivery/SettingsScreen';
import AssignmentProgressScreen from '../../screens/delivery/AssignmentProgressScreen';
import DeliverySummaryScreen from '../../screens/delivery/DeliverySummaryScreen';

export type DeliveryStackParamList = {
  Assignments: undefined;
  AssignmentDetails: { assignmentId: number };
  LiveMap: { assignmentId: number };
  EarningsHistory: undefined;
  ChatList: undefined;
  ChatRoom: { chatRoomId: number };
  Profile: undefined;

  Notifications: undefined;
  Settings: undefined;
  AssignmentProgress: { assignmentId: number };
  DeliverySummary: { assignmentId: number };
};

const Stack = createStackNavigator<DeliveryStackParamList>();

export default function DeliveryStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Assignments"
        component={AssignmentsScreen}
        options={{ title: 'Assignments' }}
      />
      <Stack.Screen
        name="AssignmentDetails"
        component={AssignmentDetailsScreen}
        options={{ title: 'Details' }}
      />
      <Stack.Screen
        name="LiveMap"
        component={LiveMapScreen}
        options={{ title: 'Live Map' }}
      />
      <Stack.Screen
        name="EarningsHistory"
        component={EarningsHistoryScreen}
        options={{ title: 'Earnings & History' }}
      />
      <Stack.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{ title: 'Chats' }}
      />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={{ title: 'Chat' }}
      />
      <Stack.Screen
        name="Profile"
        component={DeliveryProfileScreen}
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
        name="AssignmentProgress"
        component={AssignmentProgressScreen}
        options={{ title: 'Progress' }}
      />
      <Stack.Screen
        name="DeliverySummary"
        component={DeliverySummaryScreen}
        options={{ title: 'Summary' }}
      />
    </Stack.Navigator>
  );
}
