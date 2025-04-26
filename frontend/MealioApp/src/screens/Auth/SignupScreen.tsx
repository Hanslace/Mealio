import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

const SignupScreen: React.FC<Props> = ({ navigation }) => {
  const { login } = useAuth();
  const [role, setRole] = useState<'customer' | 'restaurant_owner' | 'delivery_personnel'>('customer');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up for Mealio</Text>

      <Text style={{ marginVertical:10 }}>Select Role:</Text>
      <View style={{ flexDirection:'row', justifyContent:'space-around', width:'80%', marginBottom:20 }}>
        <Button title="Customer" onPress={() => setRole('customer')} />
        <Button title="Owner" onPress={() => setRole('restaurant_owner')} />
        <Button title="Delivery" onPress={() => setRole('delivery_personnel')} />
      </View>

      <Button title="Register" onPress={() => login(role)} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ marginTop:20 }}>
        <Text style={{ color:'blue' }}>Already have an account? Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center' },
  title: { fontSize:24, fontWeight:'bold', marginBottom:30 },
});
