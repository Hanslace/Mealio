// navigation/AuthNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen           from '../screens/auth/LoginScreen';
import RegisterScreen        from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen  from '../screens/auth/ForgotPasswordScreen';
import SignupSuccessScreen   from '../screens/auth/SignupSuccessScreen';

import { UserRole } from '../context/AuthContext';

export type AuthStackParamList = {
  Login:           undefined;
  Register:        undefined;
  ForgotPassword:  undefined;
  // ‼️  Only the fields actually sent from RegisterScreen
  SignupSuccess: {
    email:      string;
    password:   string;
    pushToken:  string;
    role:       UserRole;
  };
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login"          component={LoginScreen} />
      <Stack.Screen name="Register"       component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="SignupSuccess"  component={SignupSuccessScreen} />
    </Stack.Navigator>
  );
}
