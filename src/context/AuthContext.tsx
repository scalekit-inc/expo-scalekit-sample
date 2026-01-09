/**
 * Authentication Context
 *
 * Provides authentication state and methods to the entire app
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as AuthSession from 'expo-auth-session';
import { AuthState, AuthTokens, UserInfo } from '../types/auth';
import {
  initiateLogin,
  exchangeCodeForTokens,
  fetchUserInfo,
  getStoredTokens,
  getStoredUserInfo,
  areTokensExpired,
  logout as logoutService,
} from '../services/authService';

interface AuthContextType extends AuthState {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  refreshUserInfo: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Hook to use authentication context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * Authentication Provider Component
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    tokens: null,
    error: null,
  });

  /**
   * Initialize auth state from stored credentials
   */
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedTokens = await getStoredTokens();
        const storedUser = await getStoredUserInfo();

        if (storedTokens && storedUser && !areTokensExpired(storedTokens)) {
          // Valid session exists
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user: storedUser,
            tokens: storedTokens,
            error: null,
          });
        } else {
          // No valid session
          if (storedTokens) {
            // Clean up expired tokens
            await logoutService();
          }
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            tokens: null,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          tokens: null,
          error: 'Failed to initialize authentication',
        });
      }
    };

    initAuth();
  }, []);

  /**
   * Handle login flow
   */
  const login = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Start OAuth flow with PKCE
      const result = await initiateLogin();

      if (result.type === 'success' && result.url) {
        // Parse the URL to extract the authorization code
        const url = new URL(result.url);
        const code = url.searchParams.get('code');

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange authorization code for tokens
        const tokens = await exchangeCodeForTokens(code);

        // Fetch user information from id_token
        if (!tokens.idToken) {
          throw new Error('No id_token received from Scalekit');
        }
        const user = await fetchUserInfo(tokens.idToken);

        // Update state
        setAuthState({
          isLoading: false,
          isAuthenticated: true,
          user,
          tokens,
          error: null,
        });
      } else if (result.type === 'dismiss' || result.type === 'cancel') {
        // User cancelled
        setAuthState((prev) => ({
          ...prev,
          isLoading: false,
          error: null,
        }));
      } else {
        throw new Error('Authentication was not successful');
      }
    } catch (error) {
      console.error('Login error:', error);
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        tokens: null,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  }, []);

  /**
   * Handle logout
   */
  const logout = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      await logoutService();
      setAuthState({
        isLoading: false,
        isAuthenticated: false,
        user: null,
        tokens: null,
        error: null,
      });
    } catch (error) {
      console.error('Logout error:', error);
      setAuthState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to logout',
      }));
    }
  }, []);

  /**
   * Refresh user information
   */
  const refreshUserInfo = useCallback(async () => {
    if (!authState.tokens || !authState.tokens.idToken) {
      throw new Error('No active session');
    }

    try {
      const user = await fetchUserInfo(authState.tokens.idToken);
      setAuthState((prev) => ({ ...prev, user }));
    } catch (error) {
      console.error('Error refreshing user info:', error);
      throw error;
    }
  }, [authState.tokens]);

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    refreshUserInfo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
