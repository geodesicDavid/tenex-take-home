import axios from 'axios';
import { User } from '../types/auth';

const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const authApi = {
  // Get current user info
  getCurrentUser: async (): Promise<User> => {
    const response = await fetch('/api/auth/me', {
      credentials: 'include',
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    return response.json();
  },

  // Login with Google OAuth
  loginWithGoogle: async (): Promise<void> => {
    // This redirects to Google OAuth
    window.location.href = '/api/auth/google';
  },

  // Logout
  logout: async (): Promise<void> => {
    await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
  },

  // Check authentication status
  checkAuthStatus: async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      return response.ok;
    } catch {
      return false;
    }
  },
};

export default apiClient;