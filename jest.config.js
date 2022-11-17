module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
      '@addressbook/(.*)': '<rootDir>/src/$1',
  },
}
