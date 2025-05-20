// src/screens/owner/AnalyticsDashboardScreen.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { OwnerStackParamList } from '../../navigation/OwnerNavigator/OwnerStack';
import { StackNavigationProp } from '@react-navigation/stack';

// Inline analytics data types and stub
interface AnalyticsData {
  revenueOverTime: { date: string; value: number }[];
  ordersCount: { date: string; value: number }[];
  topItems: { name: string; count: number }[];
  avgOrderValue: number;
}
const analyticsData: AnalyticsData = {
  revenueOverTime: [],
  ordersCount: [],
  topItems: [],
  avgOrderValue: 0,
};

type AnalyticsNav = CompositeNavigationProp<
  DrawerNavigationProp<OwnerStackParamList, 'AnalyticsDashboard'>,
  StackNavigationProp<any>
>;

export default function AnalyticsDashboardScreen() {
  const navigation = useNavigation<AnalyticsNav>();
  const [dateRange, setDateRange] = useState('Last 7 days');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8EC' }}>
      <View style={styles.header}>
        <Text style={styles.title}>Analytics</Text>
        <TouchableOpacity onPress={() => {/* pick dates */}}>
          <Text style={styles.dateRange}>{dateRange} <Ionicons name="chevron-down" size={16} /></Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* charts */}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  dateRange: { fontSize: 16, color: '#007AFF' },
  content: { padding: 16 },
});