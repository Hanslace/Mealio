/* src/screens/RestaurantOwner/MenuManagementScreen.tsx */
import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { useData } from '../../context/DataContext';

const MenuManagementScreen: React.FC = () => {
  const { menuItems } = useData();
  const [hiddenItems, setHiddenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setHiddenItems((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Menu</Text>
      <FlatList
        data={menuItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const isHidden = hiddenItems.includes(item.id);
          return (
            <View style={styles.card}>
              <Text style={{ fontWeight:'bold', fontSize:16 }}>
                {item.name} - ${item.price.toFixed(2)}
              </Text>
              <Text>Currently {isHidden ? 'Hidden' : 'Visible'}</Text>
              <Button
                title={isHidden ? 'Show' : 'Hide'}
                onPress={() => toggleItem(item.id)}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default MenuManagementScreen;

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
