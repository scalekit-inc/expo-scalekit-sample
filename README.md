# Expo Scalekit Sample

Sample Expo mobile app demonstrating authentication with Scalekit using the official **@scalekit-sdk/expo** SDK.

[![Scalekit](https://img.shields.io/badge/Powered%20by-Scalekit-blue)](https://scalekit.com)

## ✨ Features

- 🔐 **OAuth 2.0 with PKCE** - Secure authentication flow
- 🚀 **Simple Integration** - Just 3 lines of code
- 🔄 **Auto Session Management** - Persistent auth across app restarts
- 🏢 **Enterprise SSO** - SAML, OIDC, and social logins
- 🎯 **TypeScript** - Full type safety
- 📱 **React Hooks** - Modern React patterns

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Scalekit Credentials

Create/update `.env` file:

```env
EXPO_PUBLIC_SCALEKIT_ENV_URL=https://your-env.scalekit.com
EXPO_PUBLIC_SCALEKIT_CLIENT_ID=your_client_id
EXPO_PUBLIC_SCALEKIT_CLIENT_SECRET=your_client_secret
```

Get these credentials from your [Scalekit Dashboard](https://app.scalekit.com).

### 3. Configure Redirect URI

In your Scalekit dashboard, add this redirect URI:

- **Development (Expo Go):** `exp://localhost:8081/--/auth/callback`
- **Production:** `expo-auth-sample://auth/callback`

### 4. Run the App

```bash
# Start Expo development server
npm start

# Then scan QR code with Expo Go app
# Or run on simulator:
npm run ios
npm run android
```

## 📝 Implementation

This app demonstrates a complete authentication flow in just one file!

### App.tsx Overview

```tsx
import { ScalekitProvider, useScalekit } from '@scalekit-sdk/expo';

// 1. Wrap your app with ScalekitProvider
export default function App() {
  return (
    <ScalekitProvider
      envUrl={process.env.EXPO_PUBLIC_SCALEKIT_ENV_URL}
      clientId={process.env.EXPO_PUBLIC_SCALEKIT_CLIENT_ID}
      clientSecret={process.env.EXPO_PUBLIC_SCALEKIT_CLIENT_SECRET}
    >
      <AppScreen />
    </ScalekitProvider>
  );
}

// 2. Use the useScalekit hook
function AppScreen() {
  const { login, logout, user, isAuthenticated } = useScalekit();

  // 3. Implement your UI
  if (isAuthenticated) {
    return (
      <View>
        <Text>Welcome, {user?.name}!</Text>
        <Button onPress={logout}>Logout</Button>
      </View>
    );
  }

  return <Button onPress={login}>Login with Scalekit</Button>;
}
```

That's it! The SDK handles all the complexity for you.

## 🎯 What the SDK Handles

The `@scalekit-sdk/expo` SDK automatically manages:

- ✅ **OAuth 2.0 + PKCE Flow** - Cryptographically secure authentication
- ✅ **Token Management** - Automatic storage and refresh
- ✅ **Session Persistence** - Auto-restore on app restart
- ✅ **Deep Linking** - Automatic native configuration
- ✅ **JWT Decoding** - Extract user info from id_token
- ✅ **Error Handling** - Graceful failure recovery
- ✅ **TypeScript** - Full type safety

## 🔧 Configuration

### app.json

The SDK plugin is automatically configured:

```json
{
  "expo": {
    "scheme": "expo-auth-sample",
    "plugins": [
      "@scalekit-sdk/expo"
    ]
  }
}
```

This automatically sets up:
- iOS URL schemes for deep linking
- Android intent filters
- OAuth callback handling

### Environment Variables

All configuration is via environment variables (prefixed with `EXPO_PUBLIC_`):

```env
EXPO_PUBLIC_SCALEKIT_ENV_URL=https://your-env.scalekit.com
EXPO_PUBLIC_SCALEKIT_CLIENT_ID=your_client_id
EXPO_PUBLIC_SCALEKIT_CLIENT_SECRET=your_client_secret
```

## 🎨 Features Demonstrated

This sample app shows:

- ✅ **Login Flow** - OAuth 2.0 with PKCE
- ✅ **User Profile Display** - Show authenticated user information
- ✅ **Logout** - Clear session and return to login
- ✅ **Session Persistence** - Auto-login on app restart
- ✅ **Loading States** - Proper UX during auth flow
- ✅ **Error Handling** - Display auth errors to user

## 🏗️ Project Structure

```
expo-auth-sample/
├── .env                    # Environment variables (your credentials)
├── .env.example            # Template for credentials
├── app.json                # Expo config (includes SDK plugin)
├── App.tsx                 # Main app file - all code in one place!
├── package.json            # Dependencies (includes @scalekit-sdk/expo)
└── README.md               # This file
```

## 📱 Testing

### With Expo Go

```bash
npm start
# Scan QR code with your phone
```

### With iOS Simulator

```bash
npm run ios
```

### With Android Emulator

```bash
npm run android
```

## 🐛 Troubleshooting

### "Cannot find module '@scalekit-sdk/expo'"

Make sure you've installed all dependencies:

```bash
npm install
```

If the issue persists, try clearing the cache:

```bash
rm -rf node_modules package-lock.json
npm install
npx expo start --clear
```

### Deep Linking Not Working

Make sure redirect URI in Scalekit dashboard matches your app scheme:
- Development: `exp://localhost:8081/--/auth/callback`
- Production: `expo-auth-sample://auth/callback`

### Tokens Not Persisting (Android Expo Go)

SecureStore has limitations in Expo Go on Android. Build a development build:

```bash
npx expo run:android
```

## 🔗 Learn More

### SDK Documentation
- **GitHub:** [scalekit-inc/scalekit-expo-sdk](https://github.com/scalekit-inc/scalekit-expo-sdk)
- **npm:** [@scalekit-sdk/expo](https://www.npmjs.com/package/@scalekit-sdk/expo)

### Scalekit
- **Dashboard:** [app.scalekit.com](https://app.scalekit.com)
- **Documentation:** [docs.scalekit.com](https://docs.scalekit.com)
- **Website:** [scalekit.com](https://scalekit.com)

## 📄 License

MIT

## 🤝 Support

- 📧 Email: support@scalekit.com
- 📖 Docs: [docs.scalekit.com](https://docs.scalekit.com)

---

Powered by [@scalekit-sdk/expo](https://github.com/scalekit-inc/scalekit-expo-sdk)
