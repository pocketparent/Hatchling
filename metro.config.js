// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Blacklist the problematic file
config.resolver = {
  ...config.resolver,
  blacklistRE: [
    /node_modules\/react-native-gesture-handler\/src\/handlers\/gestures\/hoverGesture\.ts$/
  ]
};

module.exports = config;
