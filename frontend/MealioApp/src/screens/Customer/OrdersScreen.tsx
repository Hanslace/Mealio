import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useData } from '../../context/DataContext';

const OrdersScreen: React.FC = () => {
  // In a real app, you'd fetch orders for the logged-in user only
  // We'll just show all dummy orders for demonstration
  const { orders } = useData();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>
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
