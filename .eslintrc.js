module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
  },
  plugins: [
    'react',
  ],
  rules: {
    "no-console": "off",
    "linebreak-style": "off",
    "consistent-return": "off",
    "indent": 0,
    "import/no-cycle": "off",
    "func-names": "off",
    "no-use-before-define": "off",
    "import/prefer-default-export": "off",
    "max-len": "off",
    "no-tabs": "off",
    "react-hooks/exhaustive-deps": "off"
  },
};