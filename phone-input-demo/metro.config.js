const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');
const demoAppEntry = path.resolve(__dirname, 'index.js');
const rootNodeModules = path.resolve(root, 'node_modules');

// Normalize rootNodeModules to regex that matches on Windows regardless of drive letter case or slashes
const normalizedRootNodeModules = rootNodeModules.replace(/\\/g, '/');
const escapedRootNodeModules = normalizedRootNodeModules.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
const rootNodeModulesPattern = escapedRootNodeModules.replace(/\//g, '[/\\\\]');
const rootNodeModulesRegex = new RegExp(`^${rootNodeModulesPattern}([/\\\\].*)?$`, 'i');

/**
 * Metro configuration
 * Redirects library source files to use phone-input-demo's react and react-native
 * to avoid duplicate instances between the library root and the demo project.
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  watchFolders: [root],
  resolver: {
    blockList: [rootNodeModulesRegex],
    extraNodeModules: {
      'react-native-phone-input-kit': path.resolve(root, 'src'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-native': path.resolve(__dirname, 'node_modules', 'react-native'),
      'libphonenumber-js': path.resolve(__dirname, 'node_modules', 'libphonenumber-js'),
      'react-native-safe-area-context': path.resolve(__dirname, 'node_modules', 'react-native-safe-area-context'),
    },
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react-native-phone-input-kit') {
        return context.resolveRequest(context, path.resolve(root, 'src/index.ts'), platform);
      }

      // Ensure all shared packages are strictly resolved from phone-input-demo's node_modules
      const isSharedDependency =
        moduleName === 'react' ||
        moduleName.startsWith('react/') ||
        moduleName === 'react-native' ||
        moduleName.startsWith('react-native/') ||
        moduleName.startsWith('@react-native/') ||
        moduleName === 'libphonenumber-js' ||
        moduleName.startsWith('libphonenumber-js/') ||
        moduleName === 'react-native-safe-area-context' ||
        moduleName.startsWith('react-native-safe-area-context/');

      if (isSharedDependency) {
        const demoContext = {
          ...context,
          originModulePath: demoAppEntry,
        };
        return context.resolveRequest(demoContext, moduleName, platform);
      }

      return context.resolveRequest(context, moduleName, platform);
    },
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
