module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn', // Change from 'error' to 'warn'
    'react-hooks/exhaustive-deps': 'warn' // Change from 'error' to 'warn'
  }
}; 