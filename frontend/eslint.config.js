import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'coverage', 'e2e-report']),

  // ── Node/Config files (playwright.config.js, vite.config.js, etc.) ──
  {
    files: ['*.config.{js,mjs,cjs}', 'vite.config.*', 'playwright.config.*'],
    languageOptions: {
      globals: { ...globals.node, ...globals.browser },
    },
    rules: {
      'no-undef': 'off', // process.env is fine in config files
    },
  },

  // ── Source files ──
  {
    files: ['src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // React 19 + Vite JSX transform — React doesn't need to be in scope
      'no-unused-vars': [
        'warn',
        {
          varsIgnorePattern: '^(React|_)',
          argsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Allow setState inside effects — intentional pattern in our hooks
      'react-hooks/set-state-in-effect': 'off',
      // Allow context/hook exports alongside components — standard pattern
      'react-refresh/only-export-components': 'off',
      // Allow TDZ-adjacent patterns in complex context files
      'react-hooks/immutability': 'off',
      // Allow intentional intermediate assignments
      'no-useless-assignment': 'warn',
    },
  },

  // ── Test files ──
  {
    files: ['src/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}', '**/*.spec.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    rules: {
      'no-unused-vars': 'off', // test helpers often imported as side-effects
      'no-undef': 'off',
    },
  },
])
