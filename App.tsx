/**
 * Expo Auth Sample App - Using @scalekit-sdk/expo
 *
 * This is the SIMPLIFIED version using the Scalekit SDK.
 * Compare this with the original manual implementation!
 *
 * Before SDK: ~500 lines across 8 files
 * After SDK:  ~120 lines in 1 file (76% reduction!)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { ScalekitProvider, useScalekit } from '@scalekit-sdk/expo';

/**
 * Main App Screen - Shows login/logout based on auth state
 */
function AppScreen() {
  const { login, logout, user, isAuthenticated, isLoading, error } = useScalekit();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ]);
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Authenticated state - show user info
  if (isAuthenticated && user) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>You're successfully authenticated</Text>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>User Information</Text>

            {user.name && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Name:</Text>
                <Text style={styles.value}>{user.name}</Text>
              </View>
            )}

            {user.email && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{user.email}</Text>
              </View>
            )}

            {user.emailVerified !== undefined && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Email Verified:</Text>
                <Text style={styles.value}>{user.emailVerified ? '✓ Yes' : '✗ No'}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.label}>User ID:</Text>
              <Text style={styles.value}>{user.sub}</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>

          <Text style={styles.footer}>
            Powered by @scalekit-sdk/expo
          </Text>
        </View>
      </ScrollView>
    );
  }

  // Unauthenticated state - show login button
  return (
    <View style={styles.centerContainer}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Expo Auth Sample with Scalekit SDK</Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.loginButton} onPress={() => login()}>
          <Text style={styles.buttonText}>Login with Scalekit</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          This will open Scalekit's secure login page in your browser
        </Text>
      </View>
    </View>
  );
}

/**
 * Root App Component
 *
 * Just 3 lines to add authentication! 🎉
 */
export default function App() {
  return (
    <ScalekitProvider
      envUrl={process.env.EXPO_PUBLIC_SCALEKIT_ENV_URL || ''}
      clientId={process.env.EXPO_PUBLIC_SCALEKIT_CLIENT_ID || ''}
      clientSecret={process.env.EXPO_PUBLIC_SCALEKIT_CLIENT_SECRET || ''}
    >
      <SafeAreaView style={styles.container}>
        <AppScreen />
        <StatusBar style="auto" />
      </SafeAreaView>
    </ScalekitProvider>
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
    padding: 24,
  },
  content: {
    width: '100%',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 48,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  infoRow: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: '#ff3b30',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  footer: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 24,
  },
  errorBox: {
    backgroundColor: '#fee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c00',
    fontSize: 14,
    textAlign: 'center',
  },
});
