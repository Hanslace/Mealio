/* src/screens/RestaurantOwner/AnalyticsScreen.tsx */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AnalyticsScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Analytics</Text>
      <Text>Daily Sales: $200 (fake data)</Text>
      <Text>Most Ordered Item: Pepperoni Pizza</Text>
      <Text>Average Rating: 4.5</Text>
      <Text>Etc...</Text>
    </View>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:20 }
});
