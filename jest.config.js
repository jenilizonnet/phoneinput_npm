module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  moduleNameMapper: {
    '^react-native$': '<rootDir>/__mocks__/react-native.js',
  },
  testPathIgnorePatterns: ['/node_modules/', '/phone-input-demo/'],
  transformIgnorePatterns: [
    'node_modules/(?!(libphonenumber-js)/)',
  ],
};

