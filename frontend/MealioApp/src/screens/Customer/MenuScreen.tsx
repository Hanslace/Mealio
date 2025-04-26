import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useData } from '../../context/DataContext';

const MenuScreen: React.FC = () => {
  const route = useRoute<any>();
  const { restaurantId } = route.params || {};
  const { menuItems, addToCart } = useData();

  const items = menuItems.filter((m) => m.restaurantId === restaurantId);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Items</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text>${item.price.toFixed(2)}</Text>
            <Button title="Add to Cart" onPress={() => addToCart(item.id)} />
          </View>
        )}
      />
    </View>
  );
};

export default MenuScreen;

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:10 },
  itemCard: {
    backgroundColor:'#eee',
    padding:8,
    marginVertical:5,
    borderRadius:6
  },
  itemName: { fontSize:16, fontWeight:'500' },
});
