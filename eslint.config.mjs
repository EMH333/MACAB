import js from "@eslint/js";

export default [js.configs.recommended, {
    languageOptions: {
        globals: {
            location: false,
            document: false,
            navigator: false,
            //add any needed browser globals here
        },

        ecmaVersion: 12,
        sourceType: "module",
    },

    rules: {
        indent: ["error", 4],
        "linebreak-style": ["error", "unix"],
        semi: ["error", "always"],
        "no-console": "off",
        "no-undef": "off",
        "no-trailing-spaces": "warn",
    },
}];