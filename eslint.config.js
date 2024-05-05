import jest from 'eslint-plugin-jest';
import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    plugins: { jest },
    rules: {
      ...jest.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest
      }
    }
  },
  pluginJs.configs.recommended
];
