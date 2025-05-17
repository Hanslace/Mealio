// src/screens/auth/ForgotPasswordScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, SafeAreaView, StatusBar,
  KeyboardAvoidingView, Platform, Image
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';

import { forgotPassword } from '../../api/password.api';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type NavProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

export default function ForgotPasswordScreen() {
  const nav = useNavigation<NavProp>();

  const [email, setEmail]         = useState('');
  const [error, setError]         = useState<string|null>(null);
  const [success, setSuccess]     = useState<string|null>(null);
  const [loading, setLoading]     = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer for resend
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleSendLink = async () => {
    setError(null);
    setSuccess(null);

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const data = await forgotPassword(email.trim());
      setSuccess(data.message);
      setCountdown(60);  // throttle for 60s
    } catch (err: any) {
      if (err.response?.status === 429) {
        setError(err.response.data.message);
      } else {
        setError(
          err.response?.data?.message ||
          'Failed to send reset link. Please try again.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={styles.container.backgroundColor} />

      <View style={styles.logoContainer}>
        <Image
          source={require('../../../assets/Mealio-Splash.png')}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <Text style={styles.logoText}>Mealio</Text>
      </View>

      <Text style={styles.title}>Forgot Password</Text>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.form}
      >
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={t => {
            setEmail(t);
            setError(null);
            setSuccess(null);
          }}
        />

        {error   && <Text style={styles.errorText}>{error}</Text>}
        {success && <Text style={styles.successText}>{success}</Text>}

        <TouchableOpacity
          style={[
            styles.button,
            (loading || countdown > 0) && styles.buttonDisabled
          ]}
          onPress={handleSendLink}
          disabled={loading || countdown > 0}
        >
          <Text style={styles.buttonText}>
            { loading
              ? 'Sending…'
              : countdown > 0
                ? `Resend in ${formatTime(countdown)}`
                : 'Send Reset Link'
            }
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => nav.replace('Login')} style={{ marginTop: 16 }}>
          <Text style={styles.link}>Back to Sign In</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ORANGE   = '#FFA500';
const OFFWHITE = '#FFFBF0';

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: ORANGE,
    alignItems: 'center', justifyContent: 'center'
  },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logoImage:     { width: 100, height: 100 },
  logoText:      { fontSize: 36, fontWeight: 'bold', color: OFFWHITE },

  title: {
    fontSize: 24, fontWeight: '600',
    color: OFFWHITE, marginBottom: 16
  },

  form: {
    width: '80%', alignItems: 'center'
  },
  input: {
    width: '100%', backgroundColor: OFFWHITE,
    borderRadius: 12, paddingHorizontal: 16,
    paddingVertical: 12, fontSize: 16,
    marginBottom: 12
  },

  errorText: {
    color: '#FF3333', marginBottom: 12, textAlign: 'center'
  },
  successText: {
    color: '#00CC66', marginBottom: 12, textAlign: 'center'
  },

  button: {
    width: '100%', backgroundColor: OFFWHITE,
    borderRadius: 25, paddingVertical: 14,
    alignItems: 'center'
  },
  buttonDisabled: {
    opacity: 0.6
  },
  buttonText: {
    color: ORANGE, fontSize: 18, fontWeight: '600'
  },

  link: {
    color: OFFWHITE, fontSize: 14, textDecorationLine: 'underline'
  }
});
