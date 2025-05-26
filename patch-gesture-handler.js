/**
 * This script patches react-native-gesture-handler to use the transform plugin instead of the proposal plugin
 */
const fs = require('fs');
const path = require('path');

// Paths
const basePath = path.resolve(__dirname, 'node_modules');
const gestureHandlerPath = path.join(basePath, 'react-native-gesture-handler');
const babelPluginDir = path.join(gestureHandlerPath, 'node_modules', '@babel');
const proposalPluginPath = path.join(babelPluginDir, 'plugin-proposal-optional-chaining');
const transformPluginPath = path.join(basePath, '@babel', 'plugin-transform-optional-chaining');

// Create directories if they don't exist
if (!fs.existsSync(babelPluginDir)) {
  fs.mkdirSync(babelPluginDir, { recursive: true });
}

// Copy the transform plugin to the proposal plugin location
if (fs.existsSync(transformPluginPath) && !fs.existsSync(proposalPluginPath)) {
  console.log('Patching react-native-gesture-handler...');
  fs.cpSync(transformPluginPath, proposalPluginPath, { recursive: true });
  console.log('Successfully patched react-native-gesture-handler!');
} else if (fs.existsSync(proposalPluginPath)) {
  console.log('Patch already applied.');
} else {
  console.error('Error: Transform plugin not found at', transformPluginPath);
}
