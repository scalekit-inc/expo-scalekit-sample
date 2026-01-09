/**
 * Expo Auth Sample App
 *
 * A simple mobile app demonstrating Scalekit authentication with PKCE
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { LoginScreen } from './src/screens/LoginScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { validateConfig } from './src/config/scalekit';

/**
 * Main navigation component - renders appropriate screen based on auth state
 */
const AppNavigator: React.FC = () => {
  const { isLoading, isAuthenticated } = useAuth();

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Render appropriate screen based on authentication status
  return isAuthenticated ? <HomeScreen /> : <LoginScreen />;
};

/**
 * Root App Component
 */
export default function App() {
  // Validate configuration on startup
  React.useEffect(() => {
    try {
      validateConfig();
    } catch (error) {
      console.error('Configuration error:', error);
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <AuthProvider>
        <AppNavigator />
        <StatusBar style="auto" />
      </AuthProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});
