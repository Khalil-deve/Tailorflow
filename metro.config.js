const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Fix for "Failed to resolve module '@expo/vector-icons/build/vendor/react-native-vector-icons'"
// We need to tell Metro to resolve these missing modules to their actual location in node_modules
const extraNodeModules = {
  '@expo/vector-icons/build/vendor/react-native-vector-icons': require.resolve('react-native-vector-icons'),
  'react-native-vector-icons': require.resolve('react-native-vector-icons'),
};

// Update resolve options with our extra modules
config.resolver.extraNodeModules = extraNodeModules;

// Update transformer options to include the new resolver config
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');

module.exports = withNativeWind(config, { input: './global.css' });
