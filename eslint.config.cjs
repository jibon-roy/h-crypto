// Flat configuration that mirrors the project's existing legacy .eslintrc.cjs
// This avoids needing the @eslint/eslintrc package while providing a
// modern eslint.config.cjs file. It applies to TypeScript files in `src`.
const tsParser = require("@typescript-eslint/parser");
const tsPlugin = require("@typescript-eslint/eslint-plugin");

module.exports = [
  // migrate ignore patterns from .eslintignore into the new config
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".turbo/**",
      ".pnp.*",
      "coverage/**",
    ],
  },

  // Shared language options and parser setup
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
      },
      // environment globals are intentionally omitted in this flat config.
      // If needed, add `globals` or `languageOptions.ecmaVersion` instead.
    },
    plugins: { "@typescript-eslint": tsPlugin },
    files: ["**/*.ts"],
    rules: {
      // replicate project-specific rules from .eslintrc.cjs
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
    },
  },
];
