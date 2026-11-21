import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'
import stylistic from '@stylistic/eslint-plugin'
import react from 'eslint-plugin-react'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      '@stylistic': stylistic,
      react
    },
    rules: {
      // JSX-komponentti, jota ei ole importattu tai määritelty (esim. <Button> ilman importtia)
      'react/jsx-no-undef': 'error',
      // Disallow unused variables; names starting with an uppercase letter or _ (and _-prefixed arguments) are ignored
      'no-unused-vars': ['warn', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
      // Always use === and !== instead of == and !=
      eqeqeq: ['error', 'always'],
      // Use let/const instead of var
      'no-var': 'error',
      // Use const for variables that are never reassigned
      'prefer-const': 'error',
      // Warn when blocks are nested deeper than 3 levels
      'max-depth': ['warn', 3],
      // Indent with 2 spaces; case clauses are indented one level inside switch
      '@stylistic/indent': ['warn', 2, {
        SwitchCase: 1
      }],
      // Use single quotes; template literals are still allowed
      '@stylistic/quotes': ['warn', 'single', {
        allowTemplateLiterals: 'always'
      }],
      // Do not use semicolons at the end of statements
      '@stylistic/semi': ['warn', 'never'],
      // Tallennuksessa (Ctrl + S) korjattavat muotoilut
      '@stylistic/no-multiple-empty-lines': ['warn', { max: 1, maxBOF: 0, maxEOF: 0 }],
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/eol-last': 'warn',
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/comma-spacing': 'warn',
      '@stylistic/key-spacing': 'warn',
      '@stylistic/space-before-blocks': 'warn',
      '@stylistic/keyword-spacing': 'warn',
      '@stylistic/arrow-spacing': 'warn',
      '@stylistic/jsx-indent-props': ['warn', 2],
      '@stylistic/jsx-closing-tag-location': 'warn',
      '@stylistic/jsx-equals-spacing': 'warn',
    }
  }
])
