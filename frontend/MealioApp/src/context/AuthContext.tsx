// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage   from '@react-native-async-storage/async-storage';
import axiosInstance  from '../api/axiosInstance';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import {jwtDecode} from 'jwt-decode';

export type UserRole = 'customer' | 'restaurant_owner' | 'delivery_personnel';

interface JWTPayload {
  user_id: number;
  role:    UserRole;
  exp:     number;
  iat:     number;
}

interface AuthContextType {
  userId:     number | null;
  userRole:   UserRole | null;
  token:      string  | null;
  isLoggedIn: boolean;
  isLoading:  boolean;
  login:      (email: string, password: string, push_token: string) => Promise<void>;
  register:   (full_name: string, email: string, password: string, role: UserRole, push_token: string) => Promise<void>;
  logout:     () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId,    setUserId]    = useState<number  | null>(null);
  const [userRole,  setUserRole]  = useState<UserRole | null>(null);
  const [token,     setToken]     = useState<string   | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading,  setIsLoading ] = useState(true);

  // load stored auth on mount
  useEffect(() => {
    (async () => {
      try {
        const [storedToken, storedRole, storedId] = await Promise.all([
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('role'),
          AsyncStorage.getItem('userId'),
        ]);

        if (storedToken && storedRole && storedId) {
          setToken(storedToken);
          setUserRole(storedRole as UserRole);
          setUserId(Number(storedId));
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error('Error loading auth:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // helper: register push token if needed
  const getAndSavePushToken = async () => {
    if (!Device.isDevice) return;
    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;
    if (existing !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus === 'granted') {
      const { data } = await Notifications.getExpoPushTokenAsync();
      await axiosInstance.post('/users/register-push-token', { push_token: data });
    }
  };

  const login = async (email: string, password: string, push_token: string) => {
    const res = await axiosInstance.post('/auth/login', { email, password, push_token });
    const { token: jwt } = res.data as { message: string; token: string };

    // decode the JWT
    const { user_id, role } = jwtDecode<JWTPayload>(jwt);
    if (!user_id || !role) throw new Error('Invalid login response');

    // persist everything
    await AsyncStorage.setItem('token',  jwt);
    await AsyncStorage.setItem('role',   role);
    await AsyncStorage.setItem('userId', String(user_id));

    // update state
    setToken(jwt);
    setUserRole(role);
    setUserId(user_id);
    setIsLoggedIn(true);
  };

const register = async (
  full_name: string,
  email:     string,
  password:  string,
  role:      UserRole,
  push_token:string,
  extra: {
    phone?: string;
    restaurant?: {
      restaurant_name: string;
      license_number:  string;
      cuisine_type:    string;
      opening_time:    string;   // "HH:MM"
      closing_time:    string;   // "HH:MM"
      address_line1:   string;
      city:            string;
      country:         string;
    };
    delivery?: {
      driver_license_no:    string;
      license_expiry_date:  string; // "YYYY-MM-DD"
      vehicle_type:         string;
      vehicle_plate_number: string;
      iban:                 string;
    };
  } = {}
) => {
  // ---------- build payload ----------
  const payload: Record<string, any> = {
    full_name,
    email,
    password,
    role,
    push_token,
    phone: extra.phone,
  };

  if (role === 'restaurant_owner' && extra.restaurant) {
    payload.restaurant = extra.restaurant;
  }
  if (role === 'delivery_personnel' && extra.delivery) {
    payload.delivery = extra.delivery;
  }

  // ---------- register ----------
  await axiosInstance.post('/auth/register', payload);
};

  const logout = async () => {
    try {
      const { data } = await Notifications.getExpoPushTokenAsync();
      await axiosInstance.post('/auth/logout', { push_token: data });
    } catch (err) {
      console.error('Logout API error:', err);
    }

    // clear storage + state
    await AsyncStorage.multiRemove(['token','role','userId']);
    setToken(null);
    setUserRole(null);
    setUserId(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        userId,
        userRole,
        token,
        isLoggedIn,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
