/* src/screens/RestaurantOwner/OrdersScreen.tsx */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useData } from '../../context/DataContext';

const OrdersScreen: React.FC = () => {
  const { orders } = useData();

  // In a real scenario, filter orders for this specific restaurant owner
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Orders</Text>
      {orders.map((order) => (
        <View key={order.id} style={styles.card}>
          <Text>Order ID: {order.id}</Text>
          <Text>Items: {order.items.join(', ')}</Text>
          <Text>Status: {order.status}</Text>
          <Text>Total: ${order.total.toFixed(2)}</Text>
        </View>
      ))}
    </View>
  );
};

export default OrdersScreen;

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:10 },
  card: {
    backgroundColor:'#eee',
    padding:10,
    marginVertical:5,
    borderRadius:6
  },
});
