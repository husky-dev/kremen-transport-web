module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules:  {
    'react/prop-types': 'off',
    // Interface name must not be prefixed with "I"
    '@typescript-eslint/interface-name-prefix': 'off',
    // Missing return type on functions
    '@typescript-eslint/explicit-function-return-type': 'off',
    // 'iLatLngToCoordArray' was used before it was defined
    '@typescript-eslint/no-use-before-define': 'off',
    // Type boolean trivially inferred from a boolean literal, remove type annotation
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-inferrable-types': 'off',
    'no-extra-boolean-cast': 'off',
    'max-len': ['warn', { code: 120, tabWidth: 2, ignoreStrings: true }],
    'no-console': 'error',
    'no-import-assign': 'error',
    'quotes': ['error', 'single', { allowTemplateLiterals: true }],
  }
};
