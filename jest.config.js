module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: './tsconfig.json'
    }]
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  transformIgnorePatterns: [
    'node_modules/(?!(node-fetch)/)'
  ]
};