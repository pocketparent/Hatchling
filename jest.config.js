// jest.config.js
module.exports = {
    preset: 'jest-expo',
    testEnvironment: 'node',
    transform: {
      '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleFileExtensions: ['ts','tsx','js','jsx','json','node'],
    roots: ['<rootDir>/src', '<rootDir>/__tests__'],
    testPathIgnorePatterns: ['/node_modules/', '/.expo/'],
  };
  