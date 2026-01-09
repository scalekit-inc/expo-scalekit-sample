const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add the SDK directory to watchFolders so Metro can watch for changes
const sdkRoot = path.resolve(__dirname, '../scalekit-expo-sdk');

config.watchFolders = [__dirname, sdkRoot];

// Configure resolver to handle the local package
config.resolver = {
  ...config.resolver,
  nodeModulesPaths: [
    path.resolve(__dirname, 'node_modules'),
    path.resolve(sdkRoot, 'node_modules'),
  ],
  extraNodeModules: {
    '@scalekit-sdk/expo': sdkRoot,
  },
};

module.exports = config;
