import js from '@eslint/js';
import globals from 'globals';
export default [
  { ignores: ['dist/**', 'node_modules/**', 'memory/**', 'my-project-view/**', 'supabase/**', 'compliance/**'] },
  js.configs.recommended,
  { files: ['**/*.{js,jsx,mjs}'], languageOptions: { globals: { ...globals.browser, ...globals.node, ...globals.serviceworker }, parserOptions: { ecmaFeatures: { jsx: true } } },
    rules: { 'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', args: 'none', caughtErrors: 'none' }], 'no-eval': 'error', 'no-implied-eval': 'error', 'no-new-func': 'error' } },
];
