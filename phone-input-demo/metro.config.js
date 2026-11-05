const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');

const rootReact = path.resolve(root, 'node_modules', 'react').replace(/[/\\]/g, '[/\\\\]');
const rootReactNative = path.resolve(root, 'node_modules', 'react-native').replace(/[/\\]/g, '[/\\\\]');

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
    blockList: [
      new RegExp(`^${rootReact}([/\\\\].*)?$`),
      new RegExp(`^${rootReactNative}([/\\\\].*)?$`),
    ],
    extraNodeModules: {
      'react-native-phone-input-kit': path.resolve(root, 'src'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-native': path.resolve(__dirname, 'node_modules', 'react-native'),
    },
    resolveRequest: (context, moduleName, platform) => {
      if (moduleName === 'react-native-phone-input-kit') {
        return context.resolveRequest(context, path.resolve(root, 'src/index.ts'), platform);
      }
      if (
        (moduleName === 'react' ||
          moduleName.startsWith('react/') ||
          moduleName === 'react-native' ||
          moduleName.startsWith('react-native/') ||
          moduleName === 'libphonenumber-js') &&
        context.originModulePath.startsWith(root) &&
        !context.originModulePath.startsWith(__dirname)
      ) {
        const redirectPath = path.resolve(__dirname, 'node_modules', moduleName);
        return context.resolveRequest(context, redirectPath, platform);
      }
      return context.resolveRequest(context, moduleName, platform);
    },
    nodeModulesPaths: [
      path.resolve(__dirname, 'node_modules'),
    ],
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
