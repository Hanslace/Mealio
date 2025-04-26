import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useData } from '../../context/DataContext';

const RestaurantDetailsScreen: React.FC = () => {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { restaurants } = useData();
  const { restaurantId } = route.params || {};
  
  const restaurant = restaurants.find((r) => r.id === restaurantId);

  if (!restaurant) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Restaurant Not Found</Text>
      </View>
    );
  }

  const handleViewMenu = () => {
    navigation.navigate('MenuScreen' as never, { restaurantId } as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{restaurant.name}</Text>
      <Text>Cuisine: {restaurant.cuisine}</Text>
      <Text>Address: {restaurant.address}</Text>
      <Button title="View Menu" onPress={handleViewMenu} />
    </View>
  );
};

export default RestaurantDetailsScreen;

const styles = StyleSheet.create({
  container: { flex:1, padding:16 },
  title: { fontSize:18, fontWeight:'bold', marginBottom:8 },
});
