/* src/screens/DeliveryPersonnel/ActiveOrderScreen.tsx */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ActiveOrderScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Active Order</Text>
      <Text>Details of the current delivery in progress</Text>
    </View>
  );
};

export default ActiveOrderScreen;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:10 }
});
