// screens/auth/SignupSuccessScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { AuthStackParamList }   from '../../navigation/AuthNavigator';
import { useAuth, UserRole }         from '../../context/AuthContext';

export default function SignupSuccessScreen() {
  const { login } = useAuth();

  const navigation = useNavigation<
    StackNavigationProp<AuthStackParamList, 'SignupSuccess'>
  >();

  const route = useRoute();
  const { email, password, pushToken, role } = (route.params ?? {}) as {
    email: string;
    password: string;
    pushToken: string;
    role: UserRole;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      (async () => {
        try {
          // AuthContext.login stores token & flips isLoggedIn
          await login(email, password, pushToken);

          // No extra calls here: RegisterScreen already
          // forwarded role-specific details to the backend.
          // RootNavigator will auto-switch stacks on login success.
        } catch (err) {
          console.error('Auto-login failed:', err);
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
  container: { flex: 1, justifyContent: 'center', alignItems: 'center',
               padding: 20, backgroundColor: '#fff' },
  title:     { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle:  { fontSize: 16, textAlign: 'center', color: '#444' },
});
