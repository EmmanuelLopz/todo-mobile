import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import api from './api';

const ID_TOKEN_KEY = 'auth_id_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';

// Platform-aware storage: SecureStore on native, AsyncStorage on web
const storage = {
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  },
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return await AsyncStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
    } else {
      await SecureStore.deleteItemAsync(key);
    }
  },
};

// Save Firebase tokens returned by the backend
export const saveTokens = async (idToken: string, refreshToken: string) => {
  await storage.setItem(ID_TOKEN_KEY, idToken);
  await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

// Get the stored Firebase ID token (used as Bearer on every request)
export const getToken = async (): Promise<string | null> => {
  return await storage.getItem(ID_TOKEN_KEY);
};

// Get the stored refresh token
export const getRefreshToken = async (): Promise<string | null> => {
  return await storage.getItem(REFRESH_TOKEN_KEY);
};

// Delete all stored tokens
export const removeToken = async () => {
  await storage.removeItem(ID_TOKEN_KEY);
  await storage.removeItem(REFRESH_TOKEN_KEY);
};

// Login — sends email/password to Quarkus, which authenticates against Firebase
// and returns { idToken, refreshToken, expiresIn }
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { idToken, refreshToken, expiresIn } = response.data;
    await saveTokens(idToken, refreshToken);
    return response.data;
  } catch (error: any) {
    const status = error?.response?.status;
    if (status === 401) {
      throw new Error('Invalid email or password');
    } else if (status === 400) {
      throw new Error('Please enter a valid email and password');
    } else if (status === 404) {
      throw new Error('No account found with this email');
    } else if (!error.response) {
      throw new Error('Cannot reach the server. Check your connection');
    } else {
      throw new Error('Something went wrong. Please try again');
    }
  }
};

// Logout — clears all stored tokens
export const logout = async () => {
  await removeToken();
};

// Decode the stored Firebase idToken (a JWT) and return the user's uid.
// Firebase puts the uid in both `sub` and the custom `user_id` claim.
export const getUserIdFromToken = async (): Promise<string | null> => {
  const token = await getToken();
  if (!token) return null;
  try {
    const payloadBase64 = token.split('.')[1];
    // atob is available on React Native's Hermes and on web.
    const decoded = JSON.parse(atob(payloadBase64));
    return (decoded.user_id as string) || (decoded.sub as string) || null;
  } catch {
    return null;
  }
};
