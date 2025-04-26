/* src/screens/RestaurantOwner/ChatScreen.tsx */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ChatScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurant Chat</Text>
      <Text>Here you might see chats with customers/delivery</Text>
    </View>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:20 }
});
