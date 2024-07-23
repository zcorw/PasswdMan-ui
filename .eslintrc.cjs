/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
  ],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prettier/prettier': [
      'error',
      {
        endOfLine: 'auto',
        trailingComma: 'all',
        arrowParens: 'always',
      },
    ],
    'comma-dangle': ['off', 'always-multiline'],
    'react/prop-types': 'off',
    'no-unused-vars': [
      'error',
      {
        varsIgnorePattern: '.*',
        args: 'none',
      },
    ],
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 2, // 在单行中最多允许两个属性
        multiline: {
          max: 1, // 在多行中每行最多允许一个属性
          allowFirstLine: false, // 是否允许在第一行中有多个属性
        },
      },
    ],
  },
}
