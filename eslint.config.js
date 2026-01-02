import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    ignores: ['dist/'],
    rules: {
      'space-before-function-paren': 'off',
      semi: ['error', 'always'],
    },
    languageOptions: {
      globals: globals.browser
    },
  }
);
