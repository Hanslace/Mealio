import React from 'react';
import { View, Text, StyleSheet, FlatList, Button } from 'react-native';
import { useData } from '../../context/DataContext';

const CartScreen: React.FC = () => {
  const { cart, menuItems, removeFromCart, clearCart } = useData();

  const total = cart.reduce((sum, cartItem) => {
    const item = menuItems.find((m) => m.id === cartItem.menuItemId);
    if (!item) return sum;
    return sum + (item.price * cartItem.quantity);
  }, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>

      <FlatList
        data={cart}
        keyExtractor={(c) => c.menuItemId}
        renderItem={({ item }) => {
          const m = menuItems.find((x) => x.id === item.menuItemId);
          if (!m) return null;
          return (
            <View style={styles.cartItem}>
              <Text style={{ fontSize:16 }}>{m.name} x {item.quantity}</Text>
              <Text>${(m.price * item.quantity).toFixed(2)}</Text>
              <Button title="-" onPress={() => removeFromCart(m.id)} />
            </View>
          );
        }}
      />
      
      <View style={{ marginTop:20 }}>
        <Text>Total: ${total.toFixed(2)}</Text>
        <Button title="Clear Cart" onPress={clearCart} />
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  title: { fontSize:20, fontWeight:'bold', marginBottom:10 },
  cartItem: {
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#eee',
    padding:8,
    marginVertical:4,
    borderRadius:6
  },
});
