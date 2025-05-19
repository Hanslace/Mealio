// src/screens/auth/RegisterScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAuth, UserRole } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type RegisterNavProp = StackNavigationProp<AuthStackParamList, 'Register'>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

const ORANGE = '#FFA500';
const DARK_ORANGE = '#FF8C00';
const LIGHT_ORANGE = '#FFD27F';
const OFFWHITE = '#FFFBF0';

const ROLES: { key: UserRole; icon: IoniconName; label: string }[] = [
  { key: 'customer',           icon: 'person-outline',     label: 'Customer' },
  { key: 'delivery_personnel', icon: 'bicycle-outline',    label: 'Delivery' },
  { key: 'restaurant_owner',   icon: 'restaurant-outline', label: 'Restaurant' },
];

export default function RegisterScreen() {
  const nav = useNavigation<RegisterNavProp>();
  const { register } = useAuth();

  // common fields
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');

  // role & extras
  const [role,               setRole]               = useState<UserRole>('customer');
  const [restaurantName,    setRestaurantName]    = useState('');
  const [licenseNumber,     setLicenseNumber]     = useState('');
  const [address,           setAddress]           = useState('');
  const [driverLicense,     setDriverLicense]     = useState('');
  const [vehicleType,       setVehicleType]       = useState('');

  // state
  const [pushToken, setPushToken] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null);

  // get expo push token
  useEffect(() => {
    (async () => {
      if (!Device.isDevice) return;
      const { status: existing } = await Notifications.getPermissionsAsync();
      let finalStatus = existing;
      if (existing !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus === 'granted') {
        const { data } = await Notifications.getExpoPushTokenAsync();
        setPushToken(data);
      }
    })();
  }, []);

  const onSignUp = async () => {
    setErrorMsg(null);

    // validate common
    const baseOK =
      fullName.trim() !== '' &&
      email.trim()    !== '' &&
      phone.trim()    !== '' &&
      password        !== '';

    // validate extras
    let extraOK = true;
    if (role === 'restaurant_owner') {
      extraOK =
        restaurantName.trim() !== '' &&
        licenseNumber.trim()  !== '' &&
        address.trim()        !== '';
    } else if (role === 'delivery_personnel') {
      extraOK =
        driverLicense.trim() !== '' &&
        vehicleType.trim()   !== '';
    }

    if (!baseOK || !extraOK) {
      setErrorMsg('Please fill all fields.');
      return;
    }

    setLoading(true);
    try {
      // register
      await register(fullName.trim(), email.trim(), password, role, pushToken);

      

      nav.replace('SignupSuccess', {
        email: email.trim(),
        password,
        pushToken,
        role,
        restaurantName,
        licenseNumber,
        address,
        driverLicense,
        vehicleType

      });

    } catch (err: any) {
      console.error(err);
      const msg =
        err.response?.data?.message ??
        err.message ??
        'Sign up failed. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // center only for customer
  const justify = role === 'customer' ? 'center' : 'flex-start';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={ORANGE} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { justifyContent: justify }]}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo + App Name */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/Mealio-Splash.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Mealio</Text>
          </View>

          {/* Static Toggle */}
          <View style={styles.segmentContainer}>
            <TouchableOpacity
              style={styles.segmentButton}
              onPress={() => nav.replace('Login')}
            >
              <Text style={styles.segmentText}>Sign In</Text>
            </TouchableOpacity>
            <View style={[styles.segmentButton, styles.segmentSelected]}>
              <Text style={styles.segmentTextSelected}>Sign Up</Text>
            </View>
            
          </View>

          {/* Error */}
          {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}

          {/* Form Fields */}
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={fullName}
            onChangeText={t => { setFullName(t); setErrorMsg(null); }}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={t => { setEmail(t); setErrorMsg(null); }}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={t => setPhone(t)}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
            value={password}
            onChangeText={t => { setPassword(t); setErrorMsg(null); }}
          />

          {/* Role Selection */}
          <Text style={styles.sectionLabel}>Role</Text>
          <View style={styles.rolesRow}>
            {ROLES.map(r => {
              const sel = role === r.key;
              return (
                <TouchableOpacity
                  key={r.key}
                  style={[styles.roleButton, sel && styles.roleButtonSelected]}
                  onPress={() => { setRole(r.key); setErrorMsg(null); }}
                >
                  <Ionicons
                    name={r.icon}
                    size={28}
                    // OFFWHITE so visible on orange bg
                    color={sel ? OFFWHITE : '#666'}
                  />
                  <Text style={[styles.roleLabel, sel && { color: OFFWHITE }]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Extras */}
          {role === 'restaurant_owner' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Restaurant Name"
                placeholderTextColor="#888"
                value={restaurantName}
                onChangeText={setRestaurantName}
              />
              <TextInput
                style={styles.input}
                placeholder="License Number"
                placeholderTextColor="#888"
                value={licenseNumber}
                onChangeText={setLicenseNumber}
              />
              <TextInput
                style={styles.input}
                placeholder="Address"
                placeholderTextColor="#888"
                value={address}
                onChangeText={setAddress}
              />
            </>
          )}
          {role === 'delivery_personnel' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Driver License No."
                placeholderTextColor="#888"
                value={driverLicense}
                onChangeText={setDriverLicense}
              />
              <TextInput
                style={styles.input}
                placeholder="Vehicle Type"
                placeholderTextColor="#888"
                value={vehicleType}
                onChangeText={setVehicleType}
              />
            </>
          )}

          <TouchableOpacity
            style={styles.submitButton}
            onPress={onSignUp}
            disabled={loading}
          >
            <Text style={styles.submitText}>
              {loading ? 'Signing Up…' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: ORANGE,
  },
  scroll: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: OFFWHITE,
  },
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: LIGHT_ORANGE,
    borderRadius: 25,
    overflow: 'hidden',
    marginVertical: 16,
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
  error: {
    color: '#FF3333',
    marginBottom: 12,
    textAlign: 'center',
    width: '80%',
  },
  input: {
    width: '80%',
    backgroundColor: OFFWHITE,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  sectionLabel: {
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 4,
    color: OFFWHITE,
    fontSize: 14,
    fontWeight: '500',
  },
  rolesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginBottom: 12,
  },
  roleButton: {
    alignItems: 'center',
    padding: 6,
  },
  roleButtonSelected: {
    borderColor: OFFWHITE,
    borderWidth: 2,
    borderRadius: 8,
    padding: 4,
  },
  roleLabel: {
    marginTop: 4,
    fontSize: 12,
    color: OFFWHITE,
  },
  submitButton: {
    width: '80%',
    backgroundColor: OFFWHITE,
    borderRadius: 25,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: {
    color: ORANGE,
    fontSize: 18,
    fontWeight: '600',
  },
});
