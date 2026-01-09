/**
 * Scalekit Authentication Service
 *
 * Implements OAuth 2.0 with PKCE (Proof Key for Code Exchange) flow
 * for secure authentication in mobile environments.
 */

import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import axios from 'axios';
import { scalekitConfig } from '../config/scalekit';
import { AuthTokens, UserInfo } from '../types/auth';

// Configure WebBrowser for OAuth
WebBrowser.maybeCompleteAuthSession();

// Storage keys
const STORAGE_KEYS = {
  TOKENS: 'scalekit_tokens',
  USER_INFO: 'scalekit_user_info',
  CODE_VERIFIER: 'pkce_code_verifier',
} as const;

/**
 * Generate a cryptographically secure random string for PKCE
 */
const generateCodeVerifier = async (): Promise<string> => {
  const randomBytes = await Crypto.getRandomBytesAsync(32);
  return base64URLEncode(randomBytes);
};

/**
 * Generate code challenge from code verifier using SHA256
 */
const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    verifier
  );
  return base64URLEncode(hexToBytes(digest));
};

/**
 * Convert hex string to byte array
 */
const hexToBytes = (hex: string): Uint8Array => {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
};

/**
 * Base64 URL encode (RFC 4648)
 */
const base64URLEncode = (buffer: ArrayBuffer | Uint8Array): string => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
};

/**
 * Initiate OAuth login with PKCE
 */
export const initiateLogin = async (): Promise<WebBrowser.WebBrowserAuthSessionResult> => {
  try {
    // Generate PKCE parameters
    const codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store code verifier for later use in token exchange
    await SecureStore.setItemAsync(STORAGE_KEYS.CODE_VERIFIER, codeVerifier);

    // Build authorization URL manually
    const params = new URLSearchParams({
      client_id: scalekitConfig.clientId,
      redirect_uri: scalekitConfig.redirectUri,
      response_type: 'code',
      scope: 'openid profile email',
      code_challenge: codeChallenge,
      code_challenge_method: 'S256',
    });

    const authUrl = `${scalekitConfig.authorizationEndpoint}?${params.toString()}`;

    // Start auth session using WebBrowser
    const result = await WebBrowser.openAuthSessionAsync(
      authUrl,
      scalekitConfig.redirectUri
    );

    return result;
  } catch (error) {
    console.error('Error initiating login:', error);
    throw error;
  }
};

/**
 * Exchange authorization code for tokens
 */
export const exchangeCodeForTokens = async (
  code: string
): Promise<AuthTokens> => {
  try {
    // Retrieve stored code verifier
    const codeVerifier = await SecureStore.getItemAsync(STORAGE_KEYS.CODE_VERIFIER);
    if (!codeVerifier) {
      throw new Error('Code verifier not found. Please restart the login flow.');
    }

    // Exchange code for tokens
    const response = await axios.post(
      scalekitConfig.tokenEndpoint,
      new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: scalekitConfig.redirectUri,
        client_id: scalekitConfig.clientId,
        client_secret: scalekitConfig.clientSecret,
        code_verifier: codeVerifier,
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const tokens: AuthTokens = {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      idToken: response.data.id_token,
      tokenType: response.data.token_type,
      expiresIn: response.data.expires_in,
      expiresAt: Date.now() + response.data.expires_in * 1000,
    };

    // Store tokens securely
    await SecureStore.setItemAsync(STORAGE_KEYS.TOKENS, JSON.stringify(tokens));

    // Clean up code verifier
    await SecureStore.deleteItemAsync(STORAGE_KEYS.CODE_VERIFIER);

    return tokens;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error;
  }
};

/**
 * Decode JWT id_token to get user information
 */
const decodeIdToken = (idToken: string): UserInfo => {
  try {
    // JWT has three parts: header.payload.signature
    const parts = idToken.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed
    const paddedPayload = payload + '='.repeat((4 - (payload.length % 4)) % 4);
    // Decode from base64
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    const userInfo = JSON.parse(decodedPayload);

    return userInfo;
  } catch (error) {
    console.error('Error decoding id_token:', error);
    throw new Error('Failed to decode user information from id_token');
  }
};

/**
 * Fetch user information from id_token
 */
export const fetchUserInfo = async (idToken: string): Promise<UserInfo> => {
  try {
    // Decode the id_token JWT to extract user information
    const userInfo = decodeIdToken(idToken);

    // Store user info
    await SecureStore.setItemAsync(STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));

    return userInfo;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
};

/**
 * Get stored tokens from secure storage
 */
export const getStoredTokens = async (): Promise<AuthTokens | null> => {
  try {
    const tokensJson = await SecureStore.getItemAsync(STORAGE_KEYS.TOKENS);
    return tokensJson ? JSON.parse(tokensJson) : null;
  } catch (error) {
    console.error('Error retrieving stored tokens:', error);
    return null;
  }
};

/**
 * Get stored user info from secure storage
 */
export const getStoredUserInfo = async (): Promise<UserInfo | null> => {
  try {
    const userInfoJson = await SecureStore.getItemAsync(STORAGE_KEYS.USER_INFO);
    return userInfoJson ? JSON.parse(userInfoJson) : null;
  } catch (error) {
    console.error('Error retrieving stored user info:', error);
    return null;
  }
};

/**
 * Check if tokens are expired
 */
export const areTokensExpired = (tokens: AuthTokens): boolean => {
  // Add 60 second buffer to handle clock skew
  return Date.now() >= tokens.expiresAt - 60000;
};

/**
 * Logout and clear all stored data
 */
export const logout = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(STORAGE_KEYS.TOKENS),
      SecureStore.deleteItemAsync(STORAGE_KEYS.USER_INFO),
      SecureStore.deleteItemAsync(STORAGE_KEYS.CODE_VERIFIER),
    ]);
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};
