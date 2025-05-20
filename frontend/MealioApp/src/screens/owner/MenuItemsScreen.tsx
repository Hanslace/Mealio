// src/screens/owner/MenuItemsScreen.tsx
import React, { useState, useLayoutEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { OwnerStackParamList } from '../../navigation/OwnerNavigator/OwnerStack';

type MenuNav = StackNavigationProp<OwnerStackParamList, 'MenuItems'>;

interface MenuItem {
  id: number;
  name: string;
  price: number;
  imageUri: string;
  stock?: number;
  available: boolean;
  category: string;
}

const sampleData: MenuItem[] = [
  {
    id: 1,
    name: 'Margherita Pizza',
    price: 8.99,
    imageUri: 'https://via.placeholder.com/60',
    stock: 15,
    available: true,
    category: 'Pizza',
  },
  {
    id: 2,
    name: 'Pepperoni Pizza',
    price: 9.99,
    imageUri: 'https://via.placeholder.com/60',
    stock: 10,
    available: true,
    category: 'Pizza',
  },
  {
    id: 3,
    name: 'Veggie Burger',
    price: 7.49,
    imageUri: 'https://via.placeholder.com/60',
    stock: 5,
    available: false,
    category: 'Burgers',
  },
  {
    id: 4,
    name: 'Caesar Salad',
    price: 6.5,
    imageUri: 'https://via.placeholder.com/60',
    available: true,
    category: 'Salads',
  },
];

export default function MenuItemsScreen() {
  const navigation = useNavigation<MenuNav>();
  const [menuItems, setMenuItems] = useState<MenuItem[]>(sampleData);
  const [searchText, setSearchText] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => navigation.navigate('MenuItemForm', {})}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="add-circle-outline" size={28} color="#007AFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  const filteredItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const toggleAvailability = (id: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('MenuItemForm', { itemId: item.id })}
    >
      <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      <View style={styles.info}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        {item.stock !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.stock} in stock</Text>
          </View>
        )}
      </View>
      <Switch
        value={item.available}
        onValueChange={() => toggleAvailability(item.id)}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Search items..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          /* placeholder: open filter modal */
        }}
      >
        <Ionicons name="filter" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  searchBar: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    // iOS shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Android elevation
    elevation: 3,
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: '#666',
  },
  badge: {
    marginTop: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 8,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 12,
    color: '#444',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    // shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});
