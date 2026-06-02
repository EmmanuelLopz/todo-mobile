import axios, { AxiosRequestConfig } from 'axios';
import { getToken, logout, refreshIdToken } from './authService';

// Optional callback invoked when a token refresh fails (e.g. navigate to login)
let logoutHandler: (() => void) | null = null;
export const setLogoutHandler = (handler: () => void) => {
  logoutHandler = handler;
};

// Extend AxiosRequestConfig so we can mark a request as already retried
interface RetryableRequest extends AxiosRequestConfig {
  _retry?: boolean;
}

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach the stored auth token to every outgoing request
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401: try to refresh the token and retry the original request once
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as RetryableRequest;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newToken = await refreshIdToken();
      if (newToken) {
        // Inject the new token and replay the failed request
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };
        return api.request(originalRequest);
      }

      // Refresh failed — clear session and notify the app
      await logout();
      logoutHandler?.();
    }

    return Promise.reject(error);
  },
);

export default api;
