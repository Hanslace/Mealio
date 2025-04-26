/* src/screens/DeliveryPersonnel/DashboardScreen.tsx */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DashboardScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Delivery Dashboard</Text>
      <Text>Show assigned orders or available deliveries here</Text>
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:10 }
});
