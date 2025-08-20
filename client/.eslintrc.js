module.exports = {
  extends: [
    'react-app',
    'react-app/jest'
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'off', // Completely disable unused vars
    'react-hooks/exhaustive-deps': 'off', // Disable exhaustive deps
    '@typescript-eslint/no-explicit-any': 'off', // Allow any types
    'no-unused-vars': 'off' // Disable base unused vars rule
  }
}; 