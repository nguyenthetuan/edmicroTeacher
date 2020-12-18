module.exports = {
  root: true,
  extends: '@react-native-community',
  "extends": "rallycoding",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
      "modules": true,
      "experimentalObjectRestSpread": true
    }
  },
  "plugins": [
    "react"
  ],
  "extends": ["eslint:recommended", "plugin:react/recommended"],
  "rules": {
    "comma-dangle": 0,
    "react/jsx-uses-vars": 1,
    "react/display-name": 1,
    "no-unused-vars": "warn",
    "no-console": 1,
    "no-unexpected-multiline": "warn",
    "no-undef": "off",
    "max-len": [2, 120, 4, { "ignoreUrls": true }],
    "no-irregular-whitespace": "off",
    "react/prop-types": "off",
    "no-console": "off",
    "no-empty": "off",
    "no-useless-escape": "off",
    "no-extra-boolean-cast": "off",
    "react/display-name": "off"
  },
  "settings": {
    "react": {
      "pragma": "React",
      "version": "15.6.1"
    }
  }
};
