import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [role, setRole] = useState<'customer' | 'restaurant_owner' | 'delivery_personnel'>('customer');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to Mealio</Text>

      <Text style={{ marginVertical: 10 }}>Select Role:</Text>
      <View style={{ flexDirection:'row', justifyContent:'space-around', width:'80%', marginBottom: 20 }}>
        <Button title="Customer" onPress={() => setRole('customer')} />
        <Button title="Owner" onPress={() => setRole('restaurant_owner')} />
        <Button title="Delivery" onPress={() => setRole('delivery_personnel')} />
      </View>

      <Button title="Login" onPress={() => login(role)} />

      <TouchableOpacity onPress={() => navigation.navigate('Signup')} style={{ marginTop: 20 }}>
        <Text style={{ color:'blue' }}>No account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:24, fontWeight:'bold', marginBottom: 30 },
});
