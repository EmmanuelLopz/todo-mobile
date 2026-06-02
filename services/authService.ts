import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import api from './api';

const ID_TOKEN_KEY = 'auth_id_token';
const REFRESH_TOKEN_KEY = 'auth_refresh_token';
const TOKEN_EXPIRES_AT_KEY = 'auth_token_expires_at';

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
export const saveTokens = async (
  idToken: string,
  refreshToken: string,
  expiresIn?: number,
) => {
  await storage.setItem(ID_TOKEN_KEY, idToken);
  await storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  if (expiresIn) {
    const expiresAt = Date.now() + expiresIn * 1000;
    await storage.setItem(TOKEN_EXPIRES_AT_KEY, expiresAt.toString());
  }
};

// Returns true if the stored token is expired (or if no expiry is recorded)
export const isTokenExpired = async (): Promise<boolean> => {
  const expiresAt = await storage.getItem(TOKEN_EXPIRES_AT_KEY);
  if (!expiresAt) return false; // no expiry stored → assume valid
  return Date.now() >= parseInt(expiresAt, 10);
};

// Exchange a refresh token for a new idToken via Firebase REST API
export const refreshIdToken = async (): Promise<string | null> => {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return null;

  const apiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY;
  const response = await fetch(
    `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(refreshToken)}`,
    },
  );

  if (!response.ok) return null;

  const data = await response.json();
  const newIdToken: string = data.id_token;
  const newRefreshToken: string = data.refresh_token;
  const expiresIn: number = parseInt(data.expires_in, 10);

  await saveTokens(newIdToken, newRefreshToken, expiresIn);
  return newIdToken;
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
  await storage.removeItem(TOKEN_EXPIRES_AT_KEY);
};

// Login — sends email/password to Quarkus, which authenticates against Firebase
// and returns { idToken, refreshToken, expiresIn }
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { idToken, refreshToken, expiresIn } = response.data;
    await saveTokens(idToken, refreshToken, expiresIn);
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

// Logout — clears all stored tokens (used locally, e.g. after a failed refresh)
export const logout = async () => {
  await removeToken();
};

// Full logout — calls the backend to revoke the session, then clears tokens locally
export const logoutFromServer = async () => {
  try {
    await api.post('/auth/logout');
  } catch {
    // If the request fails (network issue, already expired, etc.) we still
    // want to clear the local session, so swallow the error.
  } finally {
    await removeToken();
  }
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
