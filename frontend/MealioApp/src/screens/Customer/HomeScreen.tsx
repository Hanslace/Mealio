import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useData } from '../../context/DataContext';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const { restaurants } = useData();
  const navigation = useNavigation();

  const handlePressRestaurant = (id: string) => {
    navigation.navigate('RestaurantDetails' as never, { restaurantId: id } as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => handlePressRestaurant(item.id)}
          >
            <Text style={{ fontSize: 16, fontWeight:'bold' }}>{item.name}</Text>
            <Text>{item.cuisine}</Text>
            <Text>{item.address}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex:1, padding:10, backgroundColor:'#fff' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:10 },
  card: {
    padding:10,
    marginVertical:5,
    backgroundColor:'#eee',
    borderRadius:6
  },
});
