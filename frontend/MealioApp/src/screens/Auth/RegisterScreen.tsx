// src/screens/auth/RegisterScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
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
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAuth, UserRole } from '../../context/AuthContext';
import type { AuthStackParamList } from '../../navigation/AuthNavigator';

type RegisterNavProp = StackNavigationProp<AuthStackParamList, 'Register'>;
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ─────────────────────────  UI COLORS  ──────────────────────────
const ORANGE = '#FFA500';
const DARK_ORANGE = '#FF8C00';
const LIGHT_ORANGE = '#FFD27F';
const OFFWHITE = '#FFFBF0';

// ─────────────────────────  ROLE META  ──────────────────────────
const ROLES: { key: UserRole; icon: IoniconName; label: string }[] = [
  { key: 'customer',           icon: 'person-outline',     label: 'Customer'   },
  { key: 'delivery_personnel', icon: 'bicycle-outline',    label: 'Delivery'   },
  { key: 'restaurant_owner',   icon: 'restaurant-outline', label: 'Restaurant' },
];

// ─────────────────────────  HELPERS  ────────────────────────────
const fmtDate = (d: Date) => d.toISOString().slice(0, 10); // YYYY-MM-DD
const fmtTime = (d: Date) => d.toTimeString().slice(0, 5); // HH:MM

// ─────────────────────────  COMPONENT  ──────────────────────────
export default function RegisterScreen() {
  const nav = useNavigation<RegisterNavProp>();
  const { register } = useAuth();

  // ── COMMON ────────────────────────────────────────────────────
  const [fullName, setFullName] = useState('');
  const [email,    setEmail]    = useState('');
  const [phone,    setPhone]    = useState('');
  const [password, setPassword] = useState('');
  const [role,     setRole]     = useState<UserRole>('customer');

  // ── RESTAURANT OWNER EXTRAS ───────────────────────────────────
  const [restaurantName, setRestaurantName] = useState('');
  const [licenseNumber,  setLicenseNumber]  = useState('');
  const [cuisineType,    setCuisineType]    = useState('');
  const [openingTime,    setOpeningTime]    = useState('09:00'); // HH:MM
  const [closingTime,    setClosingTime]    = useState('22:00');
  const [addrLine1,      setAddrLine1]      = useState('');
  const [city,           setCity]           = useState('');
  const [country,        setCountry]        = useState('Pakistan');

  // ── DELIVERY PERSONNEL EXTRAS ─────────────────────────────────
  const [driverLicense,      setDriverLicense]      = useState('');
  const [licenseExpiry,      setLicenseExpiry]      = useState('');
  const [vehicleType,        setVehicleType]        = useState('');
  const [vehiclePlate,       setVehiclePlate]       = useState('');
  const [iban,               setIban]               = useState('');

  // ── STATE ─────────────────────────────────────────────────────
  const [pushToken, setPushToken] = useState('');
  const [loading,   setLoading]   = useState(false);
  const [errorMsg,  setErrorMsg]  = useState<string | null>(null);

  // picker visibility
  const [showOpen,   setShowOpen]   = useState(false);
  const [showClose,  setShowClose]  = useState(false);
  const [showExpiry, setShowExpiry] = useState(false);

  // ── EXPO PUSH TOKEN ───────────────────────────────────────────
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

  // -- COMMON FIELDS
  const baseOK =
    fullName.trim() !== '' &&
    email.trim()    !== '' &&
    phone.trim()    !== '' &&
    password        !== '';

 

  // -- ROLE-SPECIFIC
  let restaurantOK = true;
  let deliveryOK   = true;

  if (role === 'restaurant_owner') {
    restaurantOK =
      restaurantName.trim() !== '' &&
      licenseNumber.trim()  !== '' &&
      cuisineType.trim()    !== '' &&
      addrLine1.trim()      !== '' &&
      city.trim()           !== '' &&
      country.trim()        !== '' &&
      openingTime.trim()    !== '' &&
      closingTime.trim()    !== '' &&
      openingTime < closingTime;

    
  }

  if (role === 'delivery_personnel') {
    deliveryOK =
      driverLicense.trim() !== '' &&
      vehicleType.trim()   !== '' &&
      vehiclePlate.trim()  !== '' &&
      iban.trim()          !== '' &&
      licenseExpiry.trim() !== '' &&
      // guard against invalid date strings:
      !isNaN(new Date(licenseExpiry).valueOf()) &&
      new Date(licenseExpiry) > new Date();

    
  }

  const extraOK = role === 'restaurant_owner'
    ? restaurantOK
    : role === 'delivery_personnel'
      ? deliveryOK
      : true;

  // final debug

  if (!baseOK || !extraOK) {
    // give more context when debugging:
    if (!baseOK) {
      setErrorMsg('Please fill all the common fields.');
    } else if (!restaurantOK) {
      setErrorMsg('Please complete all restaurant fields and ensure opening < closing time.');
    } else {
      setErrorMsg('Please complete all delivery fields and pick a future expiry date.');
    }
    setLoading(false);
    return;
  }

    setLoading(true);
    try {
      await register(
        fullName.trim(),
        email.trim(),
        password,
        role,
        pushToken,
        {
          phone: phone.trim(),
          restaurant: {
            restaurant_name: restaurantName.trim(),
            license_number:  licenseNumber.trim(),
            cuisine_type:    cuisineType.trim(),
            opening_time:    openingTime.trim(),
            closing_time:    closingTime.trim(),
            address_line1:   addrLine1.trim(),
            city:            city.trim(),
            country:         country.trim(),
          },
          delivery: {
            driver_license_no:   driverLicense.trim(),
            license_expiry_date: licenseExpiry.trim(),
            vehicle_type:        vehicleType.trim(),
            vehicle_plate_number: vehiclePlate.trim(),
            iban: iban.trim(),
          },
        }
      );

      nav.replace('SignupSuccess', {
        email: email.trim(),
        password,
        pushToken,
        role,
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

  // ─────────────────────────── UI ───────────────────────────────
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
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/Mealio-Splash.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
            <Text style={styles.logoText}>Mealio</Text>
          </View>

          {/* Toggle */}
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

          {/* COMMON FIELDS */}
          <TextInput style={styles.input} placeholder="Name"
            placeholderTextColor="#888" value={fullName}
            onChangeText={t => { setFullName(t); setErrorMsg(null); }} />
          <TextInput style={styles.input} placeholder="Email"
            placeholderTextColor="#888" autoCapitalize="none"
            keyboardType="email-address" value={email}
            onChangeText={t => { setEmail(t); setErrorMsg(null); }} />
          <TextInput style={styles.input} placeholder="Phone"
            placeholderTextColor="#888" keyboardType="phone-pad" value={phone}
            onChangeText={t => setPhone(t)} />
          <TextInput style={styles.input} placeholder="Password"
            placeholderTextColor="#888" secureTextEntry value={password}
            onChangeText={t => { setPassword(t); setErrorMsg(null); }} />

          {/* ROLE PICKER */}
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
                  <Ionicons name={r.icon} size={28}
                    color={sel ? OFFWHITE : '#666'} />
                  <Text style={[styles.roleLabel, sel && { color: OFFWHITE }]}>
                    {r.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* ── RESTAURANT INPUTS ──────────────────────────────── */}
          {role === 'restaurant_owner' && (
            <>
              <TextInput style={styles.input} placeholder="Restaurant Name"
                placeholderTextColor="#888" value={restaurantName}
                onChangeText={setRestaurantName} />
              <TextInput style={styles.input} placeholder="License Number"
                placeholderTextColor="#888" value={licenseNumber}
                onChangeText={setLicenseNumber} />
              <TextInput style={styles.input} placeholder="Cuisine Type"
                placeholderTextColor="#888" value={cuisineType}
                onChangeText={setCuisineType} />

              {/* Opening Time */}
              <TouchableOpacity onPress={() => setShowOpen(true)} style={styles.input}>
                <Text style={{ color: '#000' }}>{openingTime}</Text>
              </TouchableOpacity>
              {showOpen && (
                <DateTimePicker
                  value={new Date(`1970-01-01T${openingTime}:00`)}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, time) => {
                    setShowOpen(false);
                    if (time) setOpeningTime(fmtTime(time));
                  }}
                />
              )}

              {/* Closing Time */}
              <TouchableOpacity onPress={() => setShowClose(true)} style={styles.input}>
                <Text style={{ color: '#000' }}>{closingTime}</Text>
              </TouchableOpacity>
              {showClose && (
                <DateTimePicker
                  value={new Date(`1970-01-01T${closingTime}:00`)}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, time) => {
                    setShowClose(false);
                    if (time) setClosingTime(fmtTime(time));
                  }}
                />
              )}

              <TextInput style={styles.input} placeholder="Address Line 1"
                placeholderTextColor="#888" value={addrLine1}
                onChangeText={setAddrLine1} />
              <TextInput style={styles.input} placeholder="City"
                placeholderTextColor="#888" value={city}
                onChangeText={setCity} />
              <TextInput style={styles.input} placeholder="Country"
                placeholderTextColor="#888" value={country}
                onChangeText={setCountry} />
            </>
          )}

          {/* ── DELIVERY INPUTS ───────────────────────────────── */}
          {role === 'delivery_personnel' && (
            <>
              <TextInput style={styles.input} placeholder="Driver License No."
                placeholderTextColor="#888" value={driverLicense}
                onChangeText={setDriverLicense} />

              {/* License Expiry */}
              <TouchableOpacity onPress={() => setShowExpiry(true)} style={styles.input}>
                <Text style={{ color: licenseExpiry ? '#000' : '#888' }}>
                  {licenseExpiry || 'License Expiry (YYYY-MM-DD)'}
                </Text>
              </TouchableOpacity>
              {showExpiry && (
                <DateTimePicker
                  value={licenseExpiry ? new Date(licenseExpiry) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={(_, date) => {
                    setShowExpiry(false);
                    if (date) setLicenseExpiry(fmtDate(date));
                  }}
                />
              )}

              <TextInput style={styles.input} placeholder="Vehicle Type"
                placeholderTextColor="#888" value={vehicleType}
                onChangeText={setVehicleType} />
              <TextInput style={styles.input} placeholder="Vehicle Plate #"
                placeholderTextColor="#888" value={vehiclePlate}
                onChangeText={setVehiclePlate} />
              <TextInput style={styles.input} placeholder="IBAN"
                placeholderTextColor="#888" value={iban}
                onChangeText={setIban} />
            </>
          )}

          {/* SUBMIT */}
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

// ─────────────────────  STYLES (unchanged)  ─────────────────────
const styles = StyleSheet.create({
  flex:{flex:1},
  container:{flex:1,backgroundColor:ORANGE},
  scroll:{flexGrow:1,alignItems:'center',paddingVertical:24},
  logoContainer:{alignItems:'center',marginBottom:16},
  logoImage:{width:100,height:100,marginBottom:8},
  logoText:{fontSize:32,fontWeight:'bold',color:OFFWHITE},
  segmentContainer:{flexDirection:'row',backgroundColor:LIGHT_ORANGE,
    borderRadius:25,overflow:'hidden',marginVertical:16,width:'80%'},
  segmentButton:{flex:1,paddingVertical:10,alignItems:'center'},
  segmentSelected:{backgroundColor:DARK_ORANGE},
  segmentText:{color:OFFWHITE,fontSize:16},
  segmentTextSelected:{color:OFFWHITE,fontSize:16,fontWeight:'600'},
  error:{color:'#FF3333',marginBottom:12,textAlign:'center',width:'80%'},
  input:{width:'80%',backgroundColor:OFFWHITE,borderRadius:12,paddingHorizontal:16,
    paddingVertical:12,fontSize:16,marginBottom:12},
  sectionLabel:{alignSelf:'flex-start',marginLeft:'10%',marginBottom:4,
    color:OFFWHITE,fontSize:14,fontWeight:'500'},
  rolesRow:{flexDirection:'row',justifyContent:'space-around',width:'80%',marginBottom:12},
  roleButton:{alignItems:'center',padding:6},
  roleButtonSelected:{borderColor:OFFWHITE,borderWidth:2,borderRadius:8,padding:4},
  roleLabel:{marginTop:4,fontSize:12,color:OFFWHITE},
  submitButton:{width:'80%',backgroundColor:OFFWHITE,borderRadius:25,
    paddingVertical:14,alignItems:'center',marginTop:8},
  submitText:{color:ORANGE,fontSize:18,fontWeight:'600'},
});
