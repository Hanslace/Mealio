// src/screens/customer/SearchScreen.tsx
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import axiosInstance from '../../api/axiosInstance';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';

import type { CustomerStackParamList } from '../../navigation/CustomerNavigator/CustomerStack';

type Props = StackScreenProps<CustomerStackParamList, 'SearchMain'>;
type NavProp = StackNavigationProp<CustomerStackParamList, 'SearchMain'>;

interface MenuItem {
  item_id: number;
  restaurant_id: number;
  item_name: string;
  price: string;
  image_url?: string | null;
}

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  rating: string;
  logo_url?: string | null;
}

export default function SearchScreen({}: Props) {
  const nav = useNavigation<NavProp>();

  const [query, setQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'Items' | 'Restaurants'>('Items');
  const [items, setItems] = useState<MenuItem[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const fetchResults = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get<{
        menuItems: MenuItem[];
        restaurants: Restaurant[];
      }>(`/search?q=${encodeURIComponent(query)}`);
      setItems(res.data.menuItems);
      setRestaurants(res.data.restaurants);
      setSubmitted(true);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const openRestaurant = (id: number) =>
    nav.navigate('RestaurantDetails', { restaurantId: id });

  return (
    <View style={styles.container}>
      {/* Search input */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={20} color="#777" />
        <TextInput
          style={styles.input}
          placeholder="Search restaurants or dishes"
          autoFocus
          returnKeyType="search"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={fetchResults}
        />
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['Items', 'Restaurants'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Results / loading / empty */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 24 }} />
      ) : submitted && activeTab === 'Items' && items.length === 0 ? (
        <Text style={styles.emptyText}>No matches.</Text>
      ) : submitted && activeTab === 'Restaurants' && restaurants.length === 0 ? (
        <Text style={styles.emptyText}>No matches.</Text>
      ) : activeTab === 'Items' ? (
        <FlatList<MenuItem>
          data={items}
          keyExtractor={it => it.item_id.toString()}
          contentContainerStyle={{ paddingTop: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => openRestaurant(item.restaurant_id)}
            >
              <Image
                source={
                  item.image_url
                    ? { uri: item.image_url }
                    : require('../../../assets/food-placeholder.png')
                }
                style={styles.itemImg}
              />
              <View style={styles.itemInfo}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.item_name}
                </Text>
                <Text style={styles.itemMeta}>Rs {item.price}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <FlatList<Restaurant>
          data={restaurants}
          keyExtractor={r => r.restaurant_id.toString()}
          contentContainerStyle={{ paddingTop: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemRow}
              onPress={() => openRestaurant(item.restaurant_id)}
            >
              <Image
                source={
                  item.logo_url
                    ? { uri: item.logo_url }
                    : require('../../../assets/restaurant-placeholder.png')
                }
                style={styles.itemImg}
              />
              <View style={styles.itemInfo}>
                <Text numberOfLines={1} style={styles.itemName}>
                  {item.restaurant_name}
                </Text>
                <Text style={styles.itemMeta}>⭐ {item.rating}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const { width } = Dimensions.get('window');
const imgSize = 64;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginTop: 16,
    height: 44,
  },
  input: { flex: 1, marginLeft: 8, fontSize: 16 },

  tabBar: {
    flexDirection: 'row',
    marginTop: 24,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#0a84ff',
  },
  tabText: { fontSize: 16, color: '#777' },
  activeTabText: { color: '#0a84ff', fontWeight: '600' },

  emptyText: {
    marginTop: 32,
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
  },

  itemRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  itemImg: {
    width: imgSize,
    height: imgSize,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  itemInfo: { marginLeft: 12, flex: 1 },
  itemName: { fontSize: 16, fontWeight: '500' },
  itemMeta: { marginTop: 4, color: '#777' },
});
