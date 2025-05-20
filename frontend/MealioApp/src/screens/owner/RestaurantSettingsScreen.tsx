// src/screens/owner/RestaurantSettingsScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  StyleSheet,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function RestaurantSettingsScreen() {
  const [restaurant, setRestaurant] = useState({
    name: 'Tasty Bites',
    license: 'LIC123456',
    cuisine: 'Italian',
    phone: '+1234567890',
    logoUri: 'https://via.placeholder.com/100',
    coverUri: 'https://via.placeholder.com/300x100',
    address: '123 Main St, Springfield',
    latitude: 37.78825,
    longitude: -122.4324,
    description:
      'Authentic wood-fired pizzas and homemade pastas in a cozy atmosphere.',
    website: 'https://tastybites.example.com',
    socialLinks: [
      { key: 'facebook', value: 'fb.com/tastybites' },
      { key: 'instagram', value: '@tastybites' },
    ],
    hours: { open: '09:00', close: '22:00' },
  });
  const [changed, setChanged] = useState(false);

  const pickImage = async (field: 'logoUri' | 'coverUri') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setRestaurant(prev => ({ ...prev, [field]: uri }));
      setChanged(true);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Basic Info */}
        <Text style={styles.sectionTitle}>Basic Info</Text>
        <Text>Name</Text>
        <TextInput
          style={styles.input}
          value={restaurant.name}
          onChangeText={text => {
            setRestaurant(prev => ({ ...prev, name: text }));
            setChanged(true);
          }}
        />
        <Text>License #</Text>
        <TextInput
          style={styles.input}
          value={restaurant.license}
          onChangeText={text => {
            setRestaurant(prev => ({ ...prev, license: text }));
            setChanged(true);
          }}
        />
        <Text>Cuisine Type</Text>
        <TextInput
          style={styles.input}
          value={restaurant.cuisine}
          onChangeText={text => {
            setRestaurant(prev => ({ ...prev, cuisine: text }));
            setChanged(true);
          }}
        />
        <Text>Contact Phone</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          value={restaurant.phone}
          onChangeText={text => {
            setRestaurant(prev => ({ ...prev, phone: text }));
            setChanged(true);
          }}
        />

        {/* Logo & Cover */}
        <Text style={styles.sectionTitle}>Logo & Cover Photo</Text>
        <View style={styles.imageRow}>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => pickImage('logoUri')}
          >
            <Image source={{ uri: restaurant.logoUri }} style={styles.logo} />
            <Text style={styles.changeText}>Change Logo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageContainer}
            onPress={() => pickImage('coverUri')}
          >
            <Image source={{ uri: restaurant.coverUri }} style={styles.cover} />
            <Text style={styles.changeText}>Change Cover</Text>
          </TouchableOpacity>
        </View>

        {/* Address */}
        <Text style={styles.sectionTitle}>Address</Text>
        <TextInput
          style={styles.input}
          value={restaurant.address}
          onChangeText={text => {
            setRestaurant(prev => ({ ...prev, address: text }));
            setChanged(true);
          }}
        />
        <View style={styles.mapPreview}>
          <Text>
            Map Preview: {restaurant.latitude.toFixed(4)},{' '}
            {restaurant.longitude.toFixed(4)}
          </Text>
        </View>

        {/* Description & Links */}
        <Text style={styles.sectionTitle}>Description & Links</Text>
        <Text>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={restaurant.description}
          onChangeText={text => {
            setRestaurant(prev => ({ ...prev, description: text }));
            setChanged(true);
          }}
        />
        <Text>Website URL</Text>
        <TextInput
          style={styles.input}
          keyboardType="url"
          value={restaurant.website}
          onChangeText={text => {
            setRestaurant(prev => ({ ...prev, website: text }));
            setChanged(true);
          }}
        />
        <Text>Social Links (key/value)</Text>
        {restaurant.socialLinks.map((link, idx) => (
          <View key={idx} style={styles.socialRow}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Key"
              value={link.key}
              onChangeText={text => {
                const newLinks = [...restaurant.socialLinks];
                newLinks[idx].key = text;
                setRestaurant(prev => ({ ...prev, socialLinks: newLinks }));
                setChanged(true);
              }}
            />
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="Value"
              value={link.value}
              onChangeText={text => {
                const newLinks = [...restaurant.socialLinks];
                newLinks[idx].value = text;
                setRestaurant(prev => ({ ...prev, socialLinks: newLinks }));
                setChanged(true);
              }}
            />
          </View>
        ))}

        {/* Business Hours */}
        <Text style={styles.sectionTitle}>Business Hours</Text>
        <View style={styles.hoursRow}>
          <View style={{ flex: 1 }}>
            <Text>Open</Text>
            <TextInput
              style={styles.input}
              value={restaurant.hours.open}
              onChangeText={text => {
                setRestaurant(prev => ({
                  ...prev,
                  hours: { ...prev.hours, open: text },
                }));
                setChanged(true);
              }}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text>Close</Text>
            <TextInput
              style={styles.input}
              value={restaurant.hours.close}
              onChangeText={text => {
                setRestaurant(prev => ({
                  ...prev,
                  hours: { ...prev.hours, close: text },
                }));
                setChanged(true);
              }}
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.saveButton}>
        <Button
          title="Save Changes"
          onPress={() => {
            console.log('Saved:', restaurant);
            setChanged(false);
          }}
          disabled={!changed}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
  },
  cover: {
    width: 200,
    height: 80,
    borderRadius: 8,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f2f2f2',
  },
  changeText: {
    textAlign: 'center',
    color: '#007AFF',
    marginBottom: 12,
  },
  mapPreview: {
    height: 120,
    backgroundColor: '#eef',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  socialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hoursRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveButton: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
});
