const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Support .wasm files (required by expo-sqlite on web / exports)
config.resolver.assetExts.push('wasm');

module.exports = withNativeWind(config, { input: './global.css' });

