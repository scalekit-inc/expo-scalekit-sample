/**
 * Authentication-related type definitions
 */

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  tokenType: string;
  expiresIn: number;
  expiresAt: number; // Timestamp when token expires
}

export interface UserInfo {
  sub: string; // User ID
  email?: string;
  emailVerified?: boolean;
  name?: string;
  givenName?: string;
  familyName?: string;
  picture?: string;
  [key: string]: any; // Allow additional OIDC claims
}

export interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: UserInfo | null;
  tokens: AuthTokens | null;
  error: string | null;
}
