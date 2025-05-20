// src/screens/customer/RestaurantDetailsScreen.tsx
import React, { useEffect, useState, useCallback, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { CompositeNavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import axiosInstance from '../../api/axiosInstance';
import { useCart } from '../../context/CartContext';

import type { CustomerStackParamList } from '../../navigation/CustomerNavigator/CustomerStack';
import type { CustomerTabParamList } from '../../navigation/CustomerNavigator/CustomerTabNavigator';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { StackNavigationProp } from '@react-navigation/stack';

type Props = StackScreenProps<CustomerStackParamList, 'RestaurantDetails'>;
type NavProp = CompositeNavigationProp<
  StackNavigationProp<CustomerStackParamList, 'RestaurantDetails'>,
  BottomTabNavigationProp<CustomerTabParamList>
>;

interface Restaurant {
  restaurant_id: number;
  restaurant_name: string;
  description?: string;
  cuisine_type?: string;
  contact_phone?: string;
  rating: string;                   // DECIMAL(2,1)
  status: 'open' | 'closed' | 'suspended';
  cover_photo_url?: string | null;
  logo_url?: string | null;
}

interface MenuItem {
  item_id: number;
  restaurant_id: number;
  item_name: string;
  description?: string;
  category?: string;
  price: string;                   // DECIMAL(10,2)
  image_url?: string | null;
  is_available: boolean;
}

interface Review {
  review_id: number;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const ENDPOINT_RESTAURANT   = (id: number) => `/restaurants/${id}`;
const ENDPOINT_MENU_ITEMS   = (id: number) => `/restaurants/${id}/menu-items`;
const ENDPOINT_LIKE_STATUS  = (id: number) => `/restaurants/${id}/like-status`;
const ENDPOINT_TOGGLE_LIKE  = (id: number) => `/restaurants/${id}/toggle-like`;
const ENDPOINT_REVIEWS      = (id: number) => `/restaurants/${id}/reviews`;

export default function RestaurantDetailsScreen({ route }: Props) {
  const { restaurantId } = route.params;
  const nav = useNavigation<NavProp>();
  const { addToCart } = useCart();

  // Data states
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menuItems,   setMenuItems]   = useState<MenuItem[]>([]);
  const [reviews,     setReviews]     = useState<Review[]>([]);
  const [liked,       setLiked]       = useState<boolean>(false);

  // UI states
  const [activeTab,    setActiveTab]    = useState<'Menu'|'Info'|'Reviews'>('Menu');
  const [selectedCat,  setSelectedCat]  = useState<string>('All');
  const [loading,      setLoading]      = useState({
    restaurant: true,
    menu:       true,
    reviews:    true,
    like:       true,
  });

  // Fetch all data
  const loadAll = useCallback(async () => {
    // Restaurant info
    try {
      const res = await axiosInstance.get<Restaurant>(ENDPOINT_RESTAURANT(restaurantId));
      setRestaurant(res.data);
    } catch {}
    setLoading(l=>({ ...l, restaurant: false }));

    // Menu items
    try {
      const res = await axiosInstance.get<MenuItem[]>(ENDPOINT_MENU_ITEMS(restaurantId));
      setMenuItems(res.data);
    } catch {}
    setLoading(l=>({ ...l, menu: false }));

    // Reviews
    try {
      const res = await axiosInstance.get<Review[]>(ENDPOINT_REVIEWS(restaurantId));
      setReviews(res.data);
    } catch {}
    setLoading(l=>({ ...l, reviews: false }));

    // Like status
    try {
      const res = await axiosInstance.get<{ liked: boolean }>(ENDPOINT_LIKE_STATUS(restaurantId));
      setLiked(res.data.liked);
    } catch {}
    setLoading(l=>({ ...l, like: false }));
  }, [restaurantId]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Back button in header
  useLayoutEffect(() => {
    nav.setOptions({
      headerTitle: '',
      headerBackTitleStyle: false,
    });
  }, []);

  // Toggle like
  const toggleLike = async () => {
    try {
      await axiosInstance.post<void>(ENDPOINT_TOGGLE_LIKE(restaurantId));
      setLiked(prev => !prev);
    } catch (err) {
      console.error('Like toggle failed', err);
    }
  };

  // Category chips
  const categories = React.useMemo(() => {
    const cats = Array.from(new Set(menuItems.map(i=>i.category || 'Uncategorized')));
    return ['All', ...cats];
  }, [menuItems]);

  // Filtered items
  const displayedItems = React.useMemo(() => {
    return selectedCat === 'All'
      ? menuItems
      : menuItems.filter(i => (i.category||'') === selectedCat);
  }, [menuItems, selectedCat]);

  // Add to cart only if open & item available
  const addButtonEnabled = restaurant?.status === 'open';

  return (
    <ScrollView style={styles.container}>
      {/* Hero */}
      {!loading.restaurant && restaurant ? (
        <Image
          source={ restaurant.cover_photo_url
            ? { uri: restaurant.cover_photo_url }
            : require('../../../assets/restaurant-placeholder.png')
          }
          style={styles.cover}
        />
      ) : (
        <ActivityIndicator style={{ margin: 16 }} />
      )}

      <View style={styles.heroInfo}>
        <Text style={styles.restName}>{restaurant?.restaurant_name}</Text>
        <View style={styles.row}>
          <Text style={styles.rating}>⭐ {restaurant?.rating}</Text>
          {!loading.like && (
            <TouchableOpacity onPress={toggleLike} style={styles.likeBtn}>
              <Ionicons
                name={liked ? 'heart' : 'heart-outline'}
                size={24}
                color={liked ? 'red' : '#333'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(['Menu','Info','Reviews'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={()=>setActiveTab(tab)}
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

      {/* Content */}
      {activeTab === 'Menu' && (
        <View>
          {/* Category chips */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chips}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.chip,
                  selectedCat === cat && styles.activeChip
                ]}
                onPress={()=>setSelectedCat(cat)}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCat === cat && styles.activeChipText
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Menu items */}
          {loading.menu ? (
            <ActivityIndicator style={{ margin:16 }} />
          ) : (
            <FlatList<MenuItem>
              data={displayedItems}
              keyExtractor={it => it.item_id.toString()}
              contentContainerStyle={{ paddingBottom: 24 }}
              renderItem={({ item }) => (
                <View style={styles.menuRow}>
                  <Image
                    source={
                      item.image_url
                        ? { uri: item.image_url }
                        : require('../../../assets/food-placeholder.png')
                    }
                    style={styles.menuImg}
                  />
                  <View style={styles.menuInfo}>
                    <Text style={styles.menuName}>{item.item_name}</Text>
                    <Text style={styles.menuPrice}>Rs {item.price}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.addBtn,
                      !addButtonEnabled && styles.disabledBtn
                    ]}
                    disabled={!addButtonEnabled || !item.is_available}
                    onPress={()=>addToCart(item.item_id.toString())}
                  >
                    <Text style={styles.addBtnText}>
                      { addButtonEnabled && item.is_available ? 'Add' : '—' }
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            />
          )}
        </View>
      )}

      {activeTab === 'Info' && (
        <View style={styles.info}>
          <Text style={styles.infoText}>{restaurant?.description}</Text>
          <Text style={styles.infoLabel}>Cuisine: {restaurant?.cuisine_type}</Text>
          <Text style={styles.infoLabel}>Phone: {restaurant?.contact_phone}</Text>
        </View>
      )}

      {activeTab === 'Reviews' && (
        <View style={{ paddingHorizontal:16 }}>
          {loading.reviews ? (
            <ActivityIndicator style={{ margin:16 }} />
          ) : reviews.length === 0 ? (
            <Text style={styles.emptyText}>No reviews yet.</Text>
          ) : (
            <FlatList<Review>
              data={reviews}
              keyExtractor={r => r.review_id.toString()}
              renderItem={({ item }) => (
                <View style={styles.reviewRow}>
                  <Text style={styles.reviewUser}>{item.user_name}</Text>
                  <Text style={styles.reviewRating}>⭐ {item.rating}</Text>
                  <Text style={styles.reviewComment}>{item.comment}</Text>
                </View>
              )}
            />
          )}
        </View>
      )}
    </ScrollView>
  );
}

// Styles
const { width } = Dimensions.get('window');
const COVER_HEIGHT = 200;

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#fff' },
  cover: { width, height: COVER_HEIGHT },
  heroInfo: { padding:16 },
  restName: { fontSize:24, fontWeight:'600' },
  row: { flexDirection:'row', alignItems:'center', marginTop:8 },
  rating: { fontSize:16 },
  likeBtn: { marginLeft:16 },

  tabBar: { flexDirection:'row', borderBottomWidth:1, borderColor:'#eee' },
  tab: { flex:1, paddingVertical:12, alignItems:'center' },
  activeTab: { borderBottomWidth:2, borderColor:'#0a84ff' },
  tabText: { color:'#777' },
  activeTabText: { color:'#0a84ff', fontWeight:'600' },

  // Menu Tab
  chips: { paddingHorizontal:16, marginVertical:12 },
  chip: {
    paddingHorizontal:12, paddingVertical:6,
    borderRadius:20, borderWidth:1, borderColor:'#ccc',
    marginRight:8,
  },
  activeChip: {
    backgroundColor:'#0a84ff', borderColor:'#0a84ff',
  },
  chipText: { color:'#555' },
  activeChipText: { color:'#fff' },

  menuRow: {
    flexDirection:'row', alignItems:'center',
    paddingHorizontal:16, paddingVertical:12,
    borderBottomWidth:1, borderColor:'#f0f0f0',
  },
  menuImg: { width:60, height:60, borderRadius:8, backgroundColor:'#eee' },
  menuInfo: { flex:1, marginLeft:12 },
  menuName: { fontSize:16 },
  menuPrice: { color:'#777', marginTop:4 },
  addBtn: {
    paddingHorizontal:12, paddingVertical:6,
    backgroundColor:'#0a84ff', borderRadius:6,
  },
  addBtnText: { color:'#fff' },
  disabledBtn: { backgroundColor:'#ccc' },

  // Info Tab
  info: { padding:16 },
  infoText: { fontSize:16, lineHeight:22, marginBottom:12 },
  infoLabel: { color:'#555', marginBottom:6 },

  // Reviews Tab
  emptyText: { textAlign:'center', marginTop:24, color:'#777' },
  reviewRow: {
    paddingHorizontal:16, paddingVertical:12,
    borderBottomWidth:1, borderColor:'#f0f0f0',
  },
  reviewUser: { fontWeight:'600' },
  reviewRating: { marginTop:4, color:'#777' },
  reviewComment: { marginTop:6, lineHeight:20 },
});
