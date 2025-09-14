import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, User } from '../types/auth';

interface AuthContextType {
  authState: AuthState;
  login: (user: User) => void;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'CHECK_AUTH_START' }
  | { type: 'CHECK_AUTH_SUCCESS'; payload: User }
  | { type: 'CHECK_AUTH_FAILURE' };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
    case 'CHECK_AUTH_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
    case 'CHECK_AUTH_SUCCESS':
      return {
        user: action.payload,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'LOGIN_FAILURE':
    case 'CHECK_AUTH_FAILURE':
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, initialState);

  const checkAuthStatus = async () => {
    dispatch({ type: 'CHECK_AUTH_START' });
    try {
      const response = await fetch('/api/v1/auth/me', {
        credentials: 'include',
      });
      
      if (response.ok) {
        const user = await response.json();
        dispatch({ type: 'CHECK_AUTH_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'CHECK_AUTH_FAILURE' });
      }
    } catch (error) {
      // Log error silently for debugging
      dispatch({ type: 'CHECK_AUTH_FAILURE' });
    }
  };

  const login = (user: User) => {
    dispatch({ type: 'LOGIN_SUCCESS', payload: user });
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout, checkAuthStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export { useAuth };