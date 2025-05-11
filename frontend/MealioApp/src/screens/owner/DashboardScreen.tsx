// src/screens/.../ScreenName.tsx
// src/screens/owner/DashboardMain.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { StackNavigationProp } from '@react-navigation/stack';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';

import { OwnerDrawerParamList } from '../../navigation/OwnerNavigator/OwnerDrawerNavigator';
import { getMyOrders } from '../../api/order.api';
import { getMostLikedItems } from '../../api/menuItem.api';

type IoniconName = ComponentProps<typeof Ionicons>['name'];


interface Order {
  order_id: number;
  total_amount: number;
  status: 'completed' | 'pending' | 'issue' | string;
  created_at: string;
}

interface MenuItem {
  item_id: number;
  item_name: string;
  image_url: string;
  like_count: number;
}

type Nav = CompositeNavigationProp<
  DrawerNavigationProp<OwnerDrawerParamList, 'Dashboard'>,
  StackNavigationProp<any>
>;

const DashboardMain: React.FC = () => {
  const navigation = useNavigation<Nav>();

  const [orders, setOrders] = useState<Order[]>([]);
  const [likedItems, setLikedItems] = useState<MenuItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [ord, liked] = await Promise.all([getMyOrders(), getMostLikedItems()]);
      setOrders(ord);
      setLikedItems(liked);
    } catch (err) {
      console.error('Dashboard fetch:', err);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  // ==== KPIs ====
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter(o => o.created_at?.startsWith(todayKey));

  const revenue = todayOrders.reduce((s, o) => s + (o.total_amount || 0), 0);
  const completed = todayOrders.filter(o => o.status === 'completed').length;
  const pending = todayOrders.filter(o => o.status === 'pending').length;
  const issues = todayOrders.filter(o => o.status === 'issue').length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={styles.h1}>Welcome back, James!</Text>
      <Text style={styles.date}>
        {new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </Text>

      {/* Revenue */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today's Revenue</Text>
        <Text style={styles.big}>${revenue.toFixed(2)}</Text>
        <Text style={styles.diff}>▲ $120.30 from yesterday</Text>
      </View>

      {/* Orders */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Orders</Text>
        <View style={styles.orderRow}>
          <Stat icon="checkmark-circle" label="Completed" value={completed} />
          <Stat icon="time" label="Pending" value={pending} />
        </View>
        <View style={styles.orderRow}>
          <Stat icon="alert-circle" label="Issues" value={issues} />
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.section}>Quick Actions</Text>
      <View style={styles.quickRow}>
        <Quick icon="add" label="New Item" nav={() => navigation.navigate('Menu')} />
        <Quick icon="mail" label="Broadcast Coupon" nav={() => navigation.navigate('Coupons')} />
        <Quick icon="settings" label="Restaurant Settings" nav={() => navigation.navigate('Profile')} />
      </View>

      {/* Most-liked */}
      <Text style={styles.section}>Most-liked Items</Text>
      <FlatList
        data={likedItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={i => String(i.item_id)}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        renderItem={({ item }) => <LikedCard item={item} />}
      />
    </ScrollView>
  );
};

const Stat: React.FC<{
  icon: IoniconName;         // 👈 tighten the type
  label: string;
  value: number;
}> = ({ icon, label, value }) => (
  <View style={styles.stat}>
    <Ionicons name={icon} size={20} />
    <Text style={styles.statText}>
      {value} {label}
    </Text>
  </View>
);

const Quick: React.FC<{
  icon: IoniconName;         // 👈 tighten the type
  label: string;
  nav: () => void;
}> = ({ icon, label, nav }) => (
  <TouchableOpacity style={styles.quick} onPress={nav}>
    <Ionicons name={icon} size={28} />
    <Text style={styles.quickText}>{label}</Text>
  </TouchableOpacity>
);

const LikedCard: React.FC<{ item: MenuItem }> = ({ item }) => (
  <View style={styles.likeCard}>
    <Image source={{ uri: item.image_url }} style={styles.likeImg} />
    <View style={styles.likeRow}>
      <Ionicons name="heart" size={14} color="#c0392b" />
      <Text style={styles.likeCnt}> {item.like_count}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  // soft off-white screen background
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8EC',  // instead of deep orange
  },

  // headers in dark gray
  h1: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
  },
  date: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },

  // white cards with gentle shadow
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    // Elevation for Android
    elevation: 3,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },

  // revenue number in your brand orange
  big: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF8C00',
  },
  diff: {
    marginTop: 4,
    color: '#16A34A',
    fontWeight: '600',
  },

  // stats row
  orderRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#333333',
  },

  // section titles
  section: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333333',
  },

  // quick action tiles
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quick: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',  // white tile
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  quickText: {
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },

  // liked-items cards
  likeCard: {
    width: 100,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  likeImg: {
    width: '100%',
    height: 60,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  likeCnt: {
    fontWeight: '600',
    color: '#333333',
  },
});


export default DashboardMain;
