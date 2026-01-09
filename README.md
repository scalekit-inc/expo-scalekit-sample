# Expo Auth Sample with Scalekit

A simple React Native mobile application demonstrating secure authentication using Scalekit's OIDC provider with PKCE (Proof Key for Code Exchange) flow.

## Features

- **Secure Authentication**: OAuth 2.0 with PKCE flow for mobile security
- **Scalekit Integration**: Fully compliant OIDC provider
- **Token Management**: Secure token storage using Expo SecureStore
- **Auto Session Restore**: Persisted authentication across app restarts
- **User Profile**: Display authenticated user information
- **TypeScript**: Full type safety throughout the application

## Architecture

### Authentication Flow

1. User taps "Login with Scalekit"
2. App generates PKCE code verifier and challenge
3. Browser opens to Scalekit's hosted login page
4. User authenticates (Scalekit handles the UI)
5. Scalekit redirects back to app with authorization code
6. App exchanges code for tokens using PKCE verifier
7. App fetches and displays user information

### Project Structure

```
expo-auth-sample/
├── src/
│   ├── config/
│   │   └── scalekit.ts         # Scalekit configuration
│   ├── context/
│   │   └── AuthContext.tsx     # Auth state management
│   ├── screens/
│   │   ├── LoginScreen.tsx     # Login trigger screen
│   │   └── HomeScreen.tsx      # Authenticated home screen
│   ├── services/
│   │   └── authService.ts      # PKCE & OAuth implementation
│   └── types/
│       └── auth.ts             # TypeScript definitions
├── App.tsx                     # Root component
├── app.json                    # Expo configuration
└── .env                        # Environment variables
```

## Prerequisites

- Node.js 20.19.4+ (for React Native 0.81)
- Expo CLI
- Scalekit account ([Sign up here](https://app.scalekit.com))
- iOS Simulator or Android Emulator (or Expo Go app)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Scalekit

1. Go to [Scalekit Dashboard](https://app.scalekit.com)
2. Create a new application or use an existing one
3. Note your **Environment URL**, **Client ID**, and **Client Secret**
4. Configure the redirect URI in Scalekit dashboard:
   - For development: `exp://localhost:8081/--/auth/callback`
   - For production: `exp://your-app-scheme/--/auth/callback`

### 3. Update Environment Variables

Edit the `.env` file with your Scalekit credentials:

```env
# Your Scalekit Environment URL
EXPO_PUBLIC_SCALEKIT_ENV_URL=https://your-env.scalekit.com

# Your Scalekit Client ID
EXPO_PUBLIC_SCALEKIT_CLIENT_ID=your_client_id_here

# Your Scalekit Client Secret
EXPO_PUBLIC_SCALEKIT_CLIENT_SECRET=your_client_secret_here

# Redirect URI (must match Scalekit dashboard configuration)
EXPO_PUBLIC_REDIRECT_URI=exp://localhost:8081/--/auth/callback
```

**Important**: In production, use environment-specific redirect URIs:
- Update `EXPO_PUBLIC_REDIRECT_URI` to use your app's scheme
- Configure the same URI in Scalekit dashboard

## Running the App

### Development Mode

```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android
```

### Testing Authentication

1. Launch the app in simulator/emulator
2. Tap "Login with Scalekit"
3. Browser will open showing Scalekit's login page
4. Authenticate with your credentials
5. You'll be redirected back to the app
6. Home screen displays your user information

## Key Components

### Authentication Service (`src/services/authService.ts`)

- **PKCE Implementation**: Generates code verifier and challenge
- **Token Exchange**: Securely exchanges authorization code for tokens
- **User Info Fetching**: Retrieves user profile from Scalekit
- **Secure Storage**: Stores tokens using Expo SecureStore
- **Token Expiry**: Checks and handles expired tokens

### Auth Context (`src/context/AuthContext.tsx`)

- **Global State**: Manages authentication state across the app
- **Session Restoration**: Automatically restores valid sessions on app start
- **Auth Methods**: Provides `login()`, `logout()`, and `refreshUserInfo()`
- **React Hooks**: Easy access via `useAuth()` hook

### Screens

- **LoginScreen**: Simple trigger button to start OAuth flow
- **HomeScreen**: Displays authenticated user information with logout option

## Security Features

1. **PKCE Flow**: Protects against authorization code interception
2. **Secure Storage**: Tokens stored in device keychain/keystore
3. **Token Expiry**: Automatic detection of expired tokens
4. **HTTPS Only**: All API communication over HTTPS
5. **Client Secret**: Required for token exchange

## Deep Linking Configuration

The app uses Expo's deep linking to handle OAuth callbacks:

- **Scheme**: `expo-auth-sample`
- **Path**: `/--/auth/callback`
- **Full URI**: `expo-auth-sample://--/auth/callback` (production)

For development with Expo Go:
- **URI**: `exp://localhost:8081/--/auth/callback`

## Troubleshooting

### Configuration Errors

If you see "Missing required Scalekit configuration" error:
- Verify all environment variables in `.env` are set
- Ensure variable names are prefixed with `EXPO_PUBLIC_`
- Restart the Expo development server after changing `.env`

### Authentication Fails

- Check Scalekit dashboard redirect URI matches your `.env` configuration
- Verify Client ID and Client Secret are correct
- Ensure your Scalekit application is active
- Check console logs for detailed error messages

### App Not Redirecting After Login

- Verify deep linking scheme in `app.json` matches redirect URI
- On iOS, rebuild the app after changing `app.json`
- Check that browser can open the app's custom scheme

## Production Deployment

### iOS

1. Update `ios.bundleIdentifier` in `app.json`
2. Configure redirect URI: `your-scheme://auth/callback`
3. Update `.env` with production credentials
4. Build with EAS: `eas build --platform ios`

### Android

1. Update `android.package` in `app.json`
2. Configure redirect URI: `your-scheme://auth/callback`
3. Update `.env` with production credentials
4. Build with EAS: `eas build --platform android`

## API Reference

### useAuth Hook

```typescript
const {
  isLoading,        // boolean: Auth state loading
  isAuthenticated,  // boolean: User is logged in
  user,            // UserInfo | null: User profile
  tokens,          // AuthTokens | null: Access/refresh tokens
  error,           // string | null: Error message
  login,           // () => Promise<void>: Start login flow
  logout,          // () => Promise<void>: Clear session
  refreshUserInfo, // () => Promise<void>: Refresh user data
} = useAuth();
```

## Dependencies

- **expo**: ~52.0.21
- **expo-auth-session**: OAuth/PKCE implementation
- **expo-secure-store**: Secure token storage
- **expo-crypto**: Cryptographic operations for PKCE
- **expo-web-browser**: OAuth browser flow
- **axios**: HTTP client for API calls
- **react-native**: ^0.81.5
- **typescript**: ~5.3.3

## License

MIT

## Support

For Scalekit-related issues:
- [Scalekit Documentation](https://docs.scalekit.com)
- [Scalekit Support](https://support.scalekit.com)

For Expo-related issues:
- [Expo Documentation](https://docs.expo.dev)
- [Expo Forums](https://forums.expo.dev)
