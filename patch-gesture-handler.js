/**
 * This script creates a more robust patch for react-native-gesture-handler
 * to resolve the Babel plugin error with @babel/plugin-proposal-optional-chaining
 */
const fs = require('fs');
const path = require('path');

// Paths
const basePath = path.resolve(__dirname, 'node_modules');
const gestureHandlerPath = path.join(basePath, 'react-native-gesture-handler');
const babelPluginDir = path.join(gestureHandlerPath, 'node_modules', '@babel');
const proposalPluginPath = path.join(babelPluginDir, 'plugin-proposal-optional-chaining');

console.log('Starting robust Babel plugin patch for react-native-gesture-handler...');

// Create the plugin directory structure
try {
  fs.mkdirSync(path.join(proposalPluginPath, 'lib'), { recursive: true });
  console.log('Created plugin directory structure');
} catch (err) {
  console.log('Directory structure already exists or could not be created:', err.message);
}

// Create a package.json for the proposal plugin
try {
  const packageJson = {
    "name": "@babel/plugin-proposal-optional-chaining",
    "version": "7.21.0",
    "main": "lib/index.js",
    "description": "Shim for @babel/plugin-transform-optional-chaining"
  };
  
  fs.writeFileSync(
    path.join(proposalPluginPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );
  console.log('Created package.json for the proposal plugin');
} catch (err) {
  console.log('Could not create package.json:', err.message);
}

// Create the index.js file that redirects to the transform plugin
try {
  const indexContent = `
/**
 * This is a shim that redirects to the transform plugin
 * It resolves the Babel plugin error in react-native-gesture-handler
 */
module.exports = require('@babel/plugin-transform-optional-chaining');
`;
  
  fs.writeFileSync(path.join(proposalPluginPath, 'lib', 'index.js'), indexContent);
  console.log('Created index.js shim that redirects to the transform plugin');
} catch (err) {
  console.log('Could not create index.js:', err.message);
}

console.log('Babel plugin patch completed successfully!');
