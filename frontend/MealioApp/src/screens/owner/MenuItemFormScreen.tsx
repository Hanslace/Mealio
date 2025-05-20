// src/screens/owner/MenuItemFormScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Picker, PickerItemProps } from '@react-native-picker/picker';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  inventory: number;
  available: boolean;
  imageUri: string;
}

// Inline sample data
const sampleItem: MenuItem = {
  id: 1,
  name: 'Margherita Pizza',
  description: 'Classic wood-fired pizza with fresh basil and mozzarella.',
  price: 8.99,
  category: 'Pizza',
  inventory: 15,
  available: true,
  imageUri: 'https://via.placeholder.com/150',
};

const categories: string[] = ['Pizza', 'Burgers', 'Salads', 'Desserts'];

export default function MenuItemFormScreen() {
  const [item, setItem] = useState<MenuItem>(sampleItem);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setItem(prev => ({ ...prev, imageUri: result.assets[0].uri }));
    }
  };

  const onCategoryChange = (value: string, index: number) => {
    setItem(prev => ({ ...prev, category: value }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header */}
        <Text style={styles.header}>{item.id ? 'Edit Item' : 'Add Item'}</Text>

        {/* Live Preview */}
        <View style={styles.previewCard}>
          <Image source={{ uri: item.imageUri }} style={styles.previewImage} />
          <Text style={styles.previewName}>{item.name || 'Item Name'}</Text>
          <Text style={styles.previewPrice}>
            {item.price ? `$${item.price.toFixed(2)}` : '$0.00'}
          </Text>
          <Text style={styles.previewDesc}>
            {item.description || 'Description...'}
          </Text>
        </View>

        {/* Image Uploader */}
        <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
          <Ionicons name="image-outline" size={20} color="#fff" />
          <Text style={styles.uploadText}> Upload Image</Text>
        </TouchableOpacity>

        {/* Form Fields */}
        <Text>Name</Text>
        <TextInput
          style={styles.input}
          value={item.name}
          onChangeText={text => setItem(prev => ({ ...prev, name: text }))}
        />

        <Text>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={item.description}
          onChangeText={text => setItem(prev => ({ ...prev, description: text }))}
        />

        <Text>Price</Text>
        <TextInput
          style={styles.input}
          keyboardType="decimal-pad"
          value={item.price.toString()}
          onChangeText={text =>
            setItem(prev => ({ ...prev, price: parseFloat(text) || 0 }))
          }
        />

        <Text>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={item.category}
            onValueChange={onCategoryChange}
          >
            {categories.map(cat => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>

        <Text>Inventory Count</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={item.inventory.toString()}
          onChangeText={text =>
            setItem(prev => ({ ...prev, inventory: parseInt(text, 10) || 0 }))
          }
        />

        <View style={styles.switchRow}>
          <Text>Active</Text>
          <Switch
            value={item.available}
            onValueChange={val => setItem(prev => ({ ...prev, available: val }))}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity style={[styles.btn, styles.saveBtn]}>
            <Text style={styles.btnText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btn, styles.deleteBtn]}>
            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  previewCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  previewImage: {
    width: 150,
    height: 150,
    borderRadius: 12,
    marginBottom: 12,
  },
  previewName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  previewPrice: {
    fontSize: 16,
    color: '#666',
    marginVertical: 4,
  },
  previewDesc: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 6,
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  btn: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
  },
  deleteBtn: {
    backgroundColor: '#FF3B30',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
