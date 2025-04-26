import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '../../context/AuthContext';

const ProfileScreen: React.FC = () => {
  const { logout, userRole } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Customer Profile</Text>
      <Text>Role: {userRole}</Text>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:20, fontWeight:'bold', marginBottom:20 }
});
