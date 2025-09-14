module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*): '<rootDir>/src/$1',
    '\\.(css|less|scss|sass): 'identity-obj-proxy',
  },
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.{test,spec}.{ts,tsx}',
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  transform: {
    '^.+\\.tsx?: ['ts-jest', {
      tsconfig: '<rootDir>/tsconfig.json',
    }],
    'node_modules/react-markdown/.+\\.js: 'ts-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!react-markdown).+\\.js,
  ],
};