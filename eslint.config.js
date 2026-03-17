import js from "@eslint/js";
import globals from "globals";
import lit from "eslint-plugin-lit";
import css from "@eslint/css";

export default [
  {
    ...js.configs.recommended,
    files: ["src/**/*.js", "importmap.js"],
  },
  {
    files: ["src/**/*.js", "importmap.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      lit,
    },
    rules: {
      ...lit.configs.recommended.rules,
      "no-unused-vars": ["error", { 
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
    },
  },
  {
    files: ["src/**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.mocha,
      },
    },
  },
  {
    files: ["src/**/*.css"],
    plugins: {
      css,
    },
    language: "css/css",
    rules: {
      "css/no-duplicate-imports": "error",
      // Lint CSS files to ensure they are using
      // only Baseline Widely available features:
      "css/use-baseline": ["warn", {
        available: "widely"
      }]
    },
  },
];
