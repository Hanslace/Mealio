import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axiosInstance from '../api/axiosInstance';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { registerPushToken } from '../api/user.api';

export type UserRole = 'customer' | 'restaurant_owner' | 'delivery_personnel';

interface AuthContextType {
  userRole: UserRole | null;
  token: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (email: string, password: string, push_token: string) => Promise<void>;
  register: (full_name: string, email: string, password: string, role: UserRole, push_token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        const storedRole = (await AsyncStorage.getItem('role')) as UserRole | null;

        if (storedToken && storedRole) {
          setToken(storedToken);
          setUserRole(storedRole);
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error('Error loading auth info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredAuth();
  }, []);

  const getAndSavePushToken = async () => {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus === 'granted') {
          const expoPushToken = (await Notifications.getExpoPushTokenAsync()).data;
          console.log('📱 Expo Push Token (Auto Register):', expoPushToken);
          await registerPushToken(expoPushToken);
        }
      }
    } catch (error) {
      console.error('Push notification error:', error);
    }
  };

  const login = async (email: string, password: string, push_token: string) => {
    try {
      const res = await axiosInstance.post('/auth/login', { email, password, push_token });
      const { token, role } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);

      setToken(token);
      setUserRole(role);
      setIsLoggedIn(true);
    } catch (error) {
      throw error;
    }
  };

  const register = async (full_name: string, email: string, password: string, role: UserRole, push_token: string) => {
    try {
      const res = await axiosInstance.post('/auth/register', { full_name, email, password, role, push_token });
      const { token, role: returnedRole } = res.data;

      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', returnedRole);

      setToken(token);
      setUserRole(returnedRole);
      setIsLoggedIn(true);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const pushToken = (await Notifications.getExpoPushTokenAsync()).data;
      await axiosInstance.post('/auth/logout', { push_token: pushToken });
    } catch (error) {
      console.error('Logout API failed:', error);
    }

    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('role');

    setToken(null);
    setUserRole(null);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ userRole, token, isLoggedIn, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);