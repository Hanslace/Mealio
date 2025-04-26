/* src/screens/DeliveryPersonnel/HistoryScreen.tsx */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const HistoryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery History</Text>
      <Text>List of completed deliveries</Text>
    </View>
  );
};

export default HistoryScreen;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:10 }
});
