import jest from 'eslint-plugin-jest'
import globals from 'globals'
import pluginJs from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'
import prettier from 'prettier'

export default [
  {
    plugins: { jest },
    rules: {
      ...jest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
    },
  },
  pluginJs.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': 'error',
    },
  },
]
