module.exports = {
  root: true,
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false, // lets ESLint work without separate babel config if needed
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: ['@react-native-community', 'eslint:recommended', 'plugin:react/recommended'],
  plugins: ['react'],
  rules: {},
};
