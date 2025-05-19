// screens/auth/SignupSuccessScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import { useAuth , UserRole} from '../../context/AuthContext';
import { createRestaurant } from '../../api/restaurant.api';
import { createDeliveryProfile } from '../../api/deliveryPersonnel.api';



export default function SignupSuccessScreen() {
  const { login } = useAuth();    
  const navigation = useNavigation<
    StackNavigationProp<AuthStackParamList, 'SignupSuccess'>
  >();
  const route = useRoute();
  const { email, password, pushToken,role,restaurantName,licenseNumber,address, driverLicense,vehicleType } = (route.params ?? {}) as {
    email: string; password: string ; pushToken: string ; role : UserRole;  restaurantName: string; licenseNumber: string; address : string ;driverLicense: string; vehicleType: string
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        try {
          // use your AuthContext.login, which handles storing token & flipping isLoggedIn
          await login(email, password, pushToken);

          // extras
          if (role === 'restaurant_owner') {
            await createRestaurant({
              restaurant_name: restaurantName,
              license_number:  licenseNumber,
              address,
            });
          } else if (role === 'delivery_personnel') {
            await createDeliveryProfile({
              driver_license_no: driverLicense,
              vehicle_type:      vehicleType,
            });
          }
          // no need to call navigation.replace(); the RootNavigator will switch stacks
        } catch (err) {
          console.error('Auto-login failed:', err);
          // if you really want to send them back to login on error:
          navigation.replace('Login');
        }
      })();
    }, 3000);

    return () => clearTimeout(timer);
  }, [email, password, pushToken, login, navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup Successful!</Text>
      <Text style={styles.subtitle}>
        A verification email has been sent. Please check your inbox.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#444',
  },
});