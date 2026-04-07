module.exports = {
  root: true,
  extends: [
    '@react-native-community',
    'plugin:react/recommended',
    'plugin:react-native-a11y/ios',
    'universe/native',
    'plugin:@tanstack/eslint-plugin-query/recommended',
    'prettier'
  ],
  rules: {
    'react/no-unescaped-entities': 0,
    'react-native/no-inline-styles': 0
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],

  ignorePatterns: ['ios', 'android', '*.lock', '.husky']
}
