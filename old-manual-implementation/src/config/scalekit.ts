/**
 * Scalekit Configuration
 *
 * Environment variables must be prefixed with EXPO_PUBLIC_ to be accessible in the app.
 * Make sure to update .env file with your Scalekit credentials.
 */

export const scalekitConfig = {
  // Base URL for your Scalekit environment
  envUrl: process.env.EXPO_PUBLIC_SCALEKIT_ENV_URL || '',

  // OAuth Client ID from Scalekit dashboard
  clientId: process.env.EXPO_PUBLIC_SCALEKIT_CLIENT_ID || '',

  // OAuth Client Secret from Scalekit dashboard
  clientSecret: process.env.EXPO_PUBLIC_SCALEKIT_CLIENT_SECRET || '',

  // Redirect URI configured in Scalekit dashboard
  redirectUri: process.env.EXPO_PUBLIC_REDIRECT_URI || 'exp://localhost:8081/--/auth/callback',

  // OAuth endpoints
  get authorizationEndpoint() {
    return `${this.envUrl}/oauth/authorize`;
  },

  get tokenEndpoint() {
    return `${this.envUrl}/oauth/token`;
  },

  get userInfoEndpoint() {
    return `${this.envUrl}/oauth/userinfo`;
  },
};

/**
 * Validates that all required configuration is present
 */
export const validateConfig = () => {
  const missing: string[] = [];

  if (!scalekitConfig.envUrl) missing.push('EXPO_PUBLIC_SCALEKIT_ENV_URL');
  if (!scalekitConfig.clientId) missing.push('EXPO_PUBLIC_SCALEKIT_CLIENT_ID');
  if (!scalekitConfig.clientSecret) missing.push('EXPO_PUBLIC_SCALEKIT_CLIENT_SECRET');

  if (missing.length > 0) {
    throw new Error(
      `Missing required Scalekit configuration:\n${missing.join('\n')}\n\n` +
      'Please update your .env file with the correct values.'
    );
  }
};
