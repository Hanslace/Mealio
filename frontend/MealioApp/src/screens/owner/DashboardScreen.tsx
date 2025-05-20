// src/screens/owner/DashboardMain.tsx
import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import { OwnerDrawerParamList } from '../../navigation/OwnerNavigator/OwnerDrawerNavigator';

// Inline sample data types
interface Metric {
  id: string;
  label: string;
  value: number | string;
  icon: ComponentProps<typeof Ionicons>['name'];
  screen: string;
}
interface Shortcut {
  id: string;
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  screen: string;
}

const dashboardMetrics: Metric[] = [
  { id: 'users', label: 'Users', value: 1284, icon: 'people', screen: 'Users' },
  { id: 'restaurants', label: 'Restaurants', value: 58, icon: 'restaurant', screen: 'Restaurants' },
  { id: 'orders', label: 'Orders', value: 3421, icon: 'cart', screen: 'Orders' },
  { id: 'revenue', label: 'Revenue', value: '$12,430', icon: 'wallet', screen: 'RevenueDetail' },
];
const dashboardShortcuts: Shortcut[] = [
  { id: 'analytics', label: 'Analytics', icon: 'stats-chart', screen: 'AnalyticsDashboard' },
  { id: 'settings', label: 'Restaurant Settings', icon: 'settings', screen: 'RestaurantSettings' },
  { id: 'reviews', label: 'Reviews', icon: 'star', screen: 'Reviews' },
  { id: 'payouts', label: 'Payouts', icon: 'cash', screen: 'PayoutsScreen' },
];

type Nav = CompositeNavigationProp<
  DrawerNavigationProp<OwnerDrawerParamList, 'Dashboard'>,
  StackNavigationProp<any>
>;

export default function DashboardMain() {
  const navigation = useNavigation<Nav>();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: reload data
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const renderMetric = ({ item }: { item: Metric }) => (
    <TouchableOpacity
      style={styles.metricCard}
      onPress={() => navigation.navigate(item.screen as any)}
    >
      <Ionicons name={item.icon} size={24} />
      <Text style={styles.metricLabel}>{item.label}</Text>
      <Text style={styles.metricValue}>{item.value}</Text>
    </TouchableOpacity>
  );

  const renderShortcut = ({ item }: { item: Shortcut }) => (
    <TouchableOpacity
      style={styles.shortcutButton}
      onPress={() => navigation.navigate(item.screen as any)}
    >
      <Ionicons name={item.icon} size={32} />
      <Text style={styles.shortcutLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
      </View>
      <FlatList
        data={dashboardMetrics}
        renderItem={renderMetric}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.metricList}
      />
      <Text style={styles.section}>Quick Actions</Text>
      <FlatList
        data={dashboardShortcuts}
        renderItem={renderShortcut}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.shortcutRow}
        contentContainerStyle={styles.shortcutList}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF8EC' },
  header: { padding: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#333' },
  metricList: { paddingHorizontal: 16, paddingBottom: 24 },
  metricCard: { width: 120, marginRight: 12, backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center' },
  metricLabel: { marginTop: 8, color: '#333' },
  metricValue: { marginTop: 4, fontSize: 18, fontWeight: 'bold' },
  section: { fontSize: 20, fontWeight: '600', marginLeft: 16, marginTop: 16, color: '#333' },
  shortcutList: { paddingHorizontal: 16, paddingTop: 8 },
  shortcutRow: { justifyContent: 'space-between', marginBottom: 16 },
  shortcutButton: { flex: 1, marginHorizontal: 4, aspectRatio: 1, backgroundColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  shortcutLabel: { marginTop: 8, fontSize: 14, fontWeight: '500', color: '#333', textAlign: 'center' },
});
