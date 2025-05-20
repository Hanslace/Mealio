// src/screens/customer/HomeScreen.tsx
import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, TextInput, ScrollView
} from 'react-native';
import * as Location from 'expo-location';
import { useCart } from '../../context/CartContext';
import { getTopRestaurants } from '../../api/restaurants.api';
import { getPopularMenuItems } from '../../api/menuItems.api';
import { getActiveCoupons } from '../../api/coupons.api';
import { Ionicons } from '@expo/vector-icons';
import type { StackScreenProps } from '@react-navigation/stack';
import type { CompositeNavigationProp } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { CustomerStackParamList } from '../../navigation/CustomerNavigator/CustomerStack';
import type { CustomerTabParamList } from '../../navigation/CustomerNavigator/CustomerTabNavigator';

type Props = StackScreenProps<CustomerStackParamList, 'HomeMain'>;
type HomeNav = CompositeNavigationProp<
  StackScreenProps<CustomerStackParamList, 'HomeMain'>['navigation'],
  BottomTabNavigationProp<CustomerTabParamList>
>;

export default function HomeScreen({ navigation }: Props) {
  const { cart: cartItems } = useCart();
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);

  const [coupons, setCoupons] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [restaurants, setRestaurants] = useState<any[]>([]);

  const [loadingCoupons, setLoadingCoupons] = useState(true);
  const [loadingPopular, setLoadingPopular] = useState(true);
  const [loadingRest, setLoadingRest] = useState(true);

  // Configure header with cart icon and badge
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => (navigation as HomeNav).navigate('Cart')}
        >
          <View>
            <Ionicons name="cart-outline" size={24} />
            {cartItems.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItems.length}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      )
    });
  }, [navigation, cartItems.length]);

  // Request location permission and get coords
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission not granted');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Highest
      });
      setLat(loc.coords.latitude);
      setLng(loc.coords.longitude);
    })();
  }, []);

  useEffect(() => {
    if (lat !== null && lng !== null) {
      getActiveCoupons().then(cs => { setCoupons(cs); setLoadingCoupons(false); });
      getPopularMenuItems(lat, lng).then(ms => { setPopular(ms); setLoadingPopular(false); });
      getTopRestaurants(lat, lng).then(rs => { setRestaurants(rs); setLoadingRest(false); });
    }
  }, [lat, lng]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.search}
        placeholder="Search…"
        returnKeyType="search"
        onSubmitEditing={e =>
          (navigation as HomeNav).navigate('Search', { query: e.nativeEvent.text })
        }
      />

      <View style={styles.section}>
        <Text style={styles.heading}>Coupons</Text>
        {loadingCoupons ? (
          <Text style={styles.loading}>Still fetching…</Text>
        ) : (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {coupons.map(c => (
              <View key={c.coupon_id} style={styles.couponCard}>
                <Text>{c.code}</Text>
                <Text>
                  {c.discount_type === 'percentage'
                    ? `${c.discount_value}% off`
                    : `₹${c.discount_value} off`}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Popular Near You</Text>
        {loadingPopular ? (
          <Text style={styles.loading}>Still fetching…</Text>
        ) : (
          <FlatList
            data={popular}
            keyExtractor={i => String(i.item_id)}
            horizontal
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.itemCard}
                onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: item.restaurant_id })}
              >
                <Text>{item.item_name}</Text>
                <Text>₹{item.price}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Top Restaurants</Text>
        {loadingRest ? (
          <Text style={styles.loading}>Still fetching…</Text>
        ) : (
          <FlatList
            data={restaurants}
            keyExtractor={r => String(r.restaurant_id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.restCard}
                onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: item.restaurant_id })}
              >
                <Text style={styles.restName}>{item.restaurant_name}</Text>
                <Text>{item.address.city}</Text>
                <Text>{item.distance_km.toFixed(1)} km</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  search: {
    margin: 12,
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  section: { marginVertical: 8 },
  heading: { marginLeft: 12, fontSize: 18, fontWeight: '600' },
  loading: { marginLeft: 12, fontStyle: 'italic' },
  couponCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    marginHorizontal: 8,
    borderRadius: 6
  },
  itemCard: {
    backgroundColor: '#fafafa',
    padding: 16,
    marginHorizontal: 8,
    borderRadius: 6,
    width: 140
  },
  restCard: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  restName: { fontSize: 16, fontWeight: '500' },
  cartButton: { marginRight: 16 },
  badge: {
    position: 'absolute',
    right: -6,
    top: -4,
    backgroundColor: 'red',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeText: { color: 'white', fontSize: 10 }
});
