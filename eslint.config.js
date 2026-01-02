import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    rules: {
      'space-before-function-paren': 'off',
      semi: ['error', 'always'],
    },
    languageOptions: { globals: globals.browser },
  },
]);
