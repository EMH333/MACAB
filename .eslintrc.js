module.exports = {
    "env": {
        "browser": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        /*
        "quotes": [
            "error",
            "double"
        ],
        */
        "semi": [
            "error",
            "always"
        ],
        // disable rules from base configurations
        "no-console": "off",
        "no-undef": "off",
        "no-unused-vars": "off",
        "no-trailing-spaces":"warn",
    },
    "parserOptions": {
        "ecmaVersion": 6
      }
};