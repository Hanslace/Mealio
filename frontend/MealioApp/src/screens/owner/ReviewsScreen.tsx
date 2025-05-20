// src/screens/owner/ReviewsScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation, CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { OwnerDrawerParamList } from '../../navigation/OwnerNavigator/OwnerDrawerNavigator';
import { OwnerStackParamList } from '../../navigation/OwnerNavigator/OwnerStack';

// --- Inline reviews type and sample data ---
// Changed orderId to number to match the OwnerStackParamList definition
interface Review {
  id: string;
  customerName: string;
  avatarUri: string;
  rating: number;
  comment: string;
  orderId: number;
}
const reviewsData: Review[] = [
  {
    id: '1',
    customerName: 'Alice Johnson',
    avatarUri: 'https://via.placeholder.com/50',
    rating: 5,
    comment: 'Amazing pizza and fast delivery!',
    orderId: 1001,
  },
  {
    id: '2',
    customerName: 'Bob Smith',
    avatarUri: 'https://via.placeholder.com/50',
    rating: 4,
    comment: 'Great flavors, but order was a bit late.',
    orderId: 1002,
  },
  {
    id: '3',
    customerName: 'Carol Lee',
    avatarUri: 'https://via.placeholder.com/50',
    rating: 3,
    comment: 'Decent food, but could improve packaging.',
    orderId: 1003,
  },
];

// --- Navigation prop combining drawer + stack ---
type ReviewsNav = CompositeNavigationProp<
  DrawerNavigationProp<OwnerDrawerParamList, 'Dashboard'>,
  StackNavigationProp<OwnerStackParamList, 'OrderSupportChat'>
>;

export default function ReviewsScreen() {
  const navigation = useNavigation<ReviewsNav>();

  const renderReview = ({ item }: { item: Review }) => (
    <View style={styles.row}>
      <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
      <View style={styles.content}>
        <Text style={styles.name}>{item.customerName}</Text>
        <View style={styles.ratingRow}>
          {[...Array(item.rating)].map((_, i) => (
            <Ionicons key={i} name="star" size={16} />
          ))}
        </View>
        <Text style={styles.comment}>{item.comment}</Text>
        <View style={styles.actions}>
          <TouchableOpacity onPress={() => {}}>
            <Text>Mark as Read</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('OrderSupportChat', {
                orderId: item.orderId, // now a number
              })
            }
          >
            <Text>Reply</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Text>Flag</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF8EC' }}>
      <FlatList
        data={reviewsData}
        renderItem={renderReview}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        contentContainerStyle={{ padding: 16 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  name: {
    fontWeight: '600',
    color: '#333',
  },
  ratingRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  comment: {
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});
