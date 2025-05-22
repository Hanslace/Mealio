// src/screens/customer/SearchScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, FlatList,
  Dimensions, Modal, Pressable, ActivityIndicator,
  Animated, Image
} from 'react-native';
import {
  useNavigation, CompositeNavigationProp,
  useRoute, RouteProp
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import type { CustomerStackParamList } from '../../navigation/CustomerNavigator/CustomerStack';
import type { CustomerTabParamList } from '../../navigation/CustomerNavigator/CustomerTabNavigator';
import { searchItems, searchRestaurants } from '../../api/search.api';

type NavProp = CompositeNavigationProp<
  StackNavigationProp<CustomerStackParamList, 'SearchMain'>,
  BottomTabNavigationProp<CustomerTabParamList>
>;
type SearchRouteProp = RouteProp<CustomerStackParamList, 'SearchMain'>;

export default function SearchScreen() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<SearchRouteProp>();

  // **Log and respond** to incoming query
  useEffect(() => {
    console.log('SearchScreen received query:', route.params?.query);
    if (route.params?.query) {
      setQuery(route.params.query);
      onSearchSubmit();
    }
  }, [route.params?.query]);

  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const [showItemModal, setShowItemModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (showItemModal) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [showItemModal]);

  const [routes] = useState([
    { key: 'items', title: 'Items' },
    { key: 'restaurants', title: 'Restaurants' },
  ]);

  const [itemsData, setItemsData] = useState<any[]>([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [itemsPage, setItemsPage] = useState(1);
  const [itemsLoading, setItemsLoading] = useState(false);

  const [restData, setRestData] = useState<any[]>([]);
  const [restCount, setRestCount] = useState(0);
  const [restPage, setRestPage] = useState(1);
  const [restLoading, setRestLoading] = useState(false);

  const limit = 10;

  const doSearchItems = async (page = 1) => {
    if (!query.trim()) return;
    setItemsLoading(true);
    try {
      const { count, rows } = await searchItems(query, page, limit);
      setItemsPage(page);
      setItemsCount(count);
      setItemsData(prev => page === 1 ? rows : [...prev, ...rows]);
    } finally { setItemsLoading(false); }
  };

  const doSearchRestaurants = async (page = 1) => {
    if (!query.trim()) return;
    setRestLoading(true);
    try {
      const { count, rows } = await searchRestaurants(query, page, limit);
      setRestPage(page);
      setRestCount(count);
      setRestData(prev => page === 1 ? rows : [...prev, ...rows]);
    } finally { setRestLoading(false); }
  };

  const onSearchSubmit = () => {
    setItemsData([]); setItemsPage(1);
    setRestData([]);  setRestPage(1);
    doSearchItems(1);
    doSearchRestaurants(1);
  };

  const loadMoreItems = () => {
    if (!itemsLoading && itemsData.length < itemsCount) {
      doSearchItems(itemsPage + 1);
    }
  };
  const loadMoreRestaurants = () => {
    if (!restLoading && restData.length < restCount) {
      doSearchRestaurants(restPage + 1);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      style={styles.row}
      onPress={() => { setSelectedItem(item); setShowItemModal(true); }}
    >
      <Text style={styles.title}>{item.item_name}</Text>
      <Text style={styles.desc}>{item.description}</Text>
      <Text style={styles.price}>₹{item.price}</Text>
    </Pressable>
  );

  const renderRestaurant = ({ item }: { item: any }) => (
    <Pressable
      style={styles.row}
      onPress={() => navigation.navigate('RestaurantDetails', { restaurantId: item.restaurant_id })}
    >
      <Text style={styles.title}>{item.restaurant_name}</Text>
      <Text style={styles.desc}>
        {item.cuisine_type} • {item.address.city}
      </Text>
      <Text style={styles.rating}>⭐ {item.rating}</Text>
    </Pressable>
  );

  const EmptyComponent = () => <Text style={styles.empty}>No matches.</Text>;
  const LoadingComponent = () => <ActivityIndicator style={{ margin: 20 }} />;

  const renderScene = SceneMap({
    items: () => (
      <FlatList
        data={itemsData}
        keyExtractor={i => String(i.item_id)}
        renderItem={renderItem}
        onEndReached={loadMoreItems}
        ListEmptyComponent={itemsLoading ? LoadingComponent : EmptyComponent}
      />
    ),
    restaurants: () => (
      <FlatList
        data={restData}
        keyExtractor={r => String(r.restaurant_id)}
        renderItem={renderRestaurant}
        onEndReached={loadMoreRestaurants}
        ListEmptyComponent={restLoading ? LoadingComponent : EmptyComponent}
      />
    ),
  });

  const ItemOverlay = () => (
    <Modal
      visible={showItemModal}
      transparent
      onRequestClose={() => setShowItemModal(false)}
    >
      <View style={styles.modalBackdrop}>
        <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }] }]}>
          {selectedItem && (
            <>
              {selectedItem.image_url && (
                <Image source={{ uri: selectedItem.image_url }}
                  style={styles.modalImage} />
              )}
              <Text style={styles.modalTitle}>{selectedItem.item_name}</Text>
              <Text style={styles.modalDesc}>{selectedItem.description}</Text>
              <Text style={styles.modalPrice}>₹{selectedItem.price}</Text>
              <Text>Category: {selectedItem.category}</Text>
              <Text>Available: {selectedItem.is_available ? 'Yes' : 'No'}</Text>
              <View style={styles.modalActions}>
                <Pressable style={styles.modalButton} onPress={() => console.log('Liked', selectedItem.item_id)}>
                  <Text>❤️ Like</Text>
                </Pressable>
                <Pressable style={styles.modalButton} onPress={() => console.log('Add', selectedItem.item_id)}>
                  <Text>🛒 Add to Cart</Text>
                </Pressable>
              </View>
            </>
          )}
          <Pressable style={styles.closeButton} onPress={() => setShowItemModal(false)}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );

  return (
    <>
      <ItemOverlay />
      <View style={{ flex: 1 }}>
        <TextInput
          style={styles.search}
          placeholder="Search…"
          returnKeyType="search"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSearchSubmit}
        />
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{ width: Dimensions.get('window').width }}
          renderTabBar={props => (
            <TabBar {...props} style={styles.tabBar} indicatorStyle={styles.indicator} />
          )}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  search: {
    margin: 12, padding: 8,
    borderRadius: 4, borderWidth: 1, borderColor: '#ccc'
  },
  row: {
    padding: 12, borderBottomWidth: 1, borderColor: '#eee'
  },
  title: { fontSize: 16, fontWeight: '500' },
  desc: { color: '#555', marginVertical: 4 },
  price: { fontWeight: '600' },
  rating: { marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
  tabBar: { backgroundColor: '#fff' },
  indicator: { backgroundColor: '#000' },
  modalBackdrop: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center'
  },
  modalContent: {
    width: '80%', backgroundColor: '#fff',
    borderRadius: 8, padding: 16, alignItems: 'center'
  },
  modalImage: { width: 200, height: 200, marginBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  modalDesc: { marginBottom: 12, color: '#555' },
  modalPrice: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  modalActions: {
    flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginVertical: 12
  },
  modalButton: {
    paddingVertical: 8, paddingHorizontal: 16,
    borderWidth: 1, borderRadius: 4
  },
  closeButton: { marginTop: 8 },
  closeText: { color: '#007aff' }
});
