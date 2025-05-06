// src/screens/auth/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { useAuth } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

type LoginNavProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export default function LoginScreen() {
  const nav = useNavigation<LoginNavProp>();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pushToken, setPushToken] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (Device.isDevice) {
        const { status: existing } = await Notifications.getPermissionsAsync();
        let finalStatus = existing;
        if (existing !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus === 'granted') {
          const tokenData = await Notifications.getExpoPushTokenAsync();
          setPushToken(tokenData.data);
        }
      }
    })();
  }, []);

  const onSignIn = async () => {
    setErrorMsg(null);
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password, pushToken);
    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data?.message ??
        err.message ??
        'Unable to sign in. Please check your credentials.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />

      {/* Logo + App Name */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/Mealio-Splash.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>Mealio</Text>
      </View>

      {/* Sign In / Sign Up toggle */}
      <View style={styles.segmentContainer}>
        <TouchableOpacity style={[styles.segmentButton, styles.segmentSelected]}>
          <Text style={styles.segmentTextSelected}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.segmentButton}
          onPress={() => nav.replace('Register')}
        >
          <Text style={styles.segmentText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        behavior={Platform.select({ ios: 'padding', android: undefined })}
        style={styles.form}
      >
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setErrorMsg(null);
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={text => {
            setPassword(text);
            setErrorMsg(null);
          }}
        />

        {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

        <TouchableOpacity
          style={styles.signInButton}
          onPress={onSignIn}
          disabled={loading}
        >
          <Text style={styles.signInText}>
            {loading ? 'Signing In…' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => nav.navigate('ForgotPassword')}>
          <Text style={styles.forgot}>Forgot password?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ORANGE = '#FFA500';
const DARK_ORANGE = '#FF8C00';
const LIGHT_ORANGE = '#FFD27F';
const OFFWHITE = '#FFFBF0';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ORANGE,
    alignItems: 'center',
    justifyContent: 'center',    // center all content vertically
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 12,
  },
  logoText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: OFFWHITE,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: LIGHT_ORANGE,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 24,
    width: '80%',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
  },
  segmentSelected: {
    backgroundColor: DARK_ORANGE,
  },
  segmentText: {
    color: OFFWHITE,
    fontSize: 16,
  },
  segmentTextSelected: {
    color: OFFWHITE,
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    width: '80%',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    backgroundColor: OFFWHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  error: {
    color: '#FF3333',
    marginBottom: 12,
    textAlign: 'center',
  },
  signInButton: {
    width: '100%',
    backgroundColor: OFFWHITE,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  signInText: {
    color: ORANGE,
    fontSize: 18,
    fontWeight: '600',
  },
  forgot: {
    color: OFFWHITE,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

