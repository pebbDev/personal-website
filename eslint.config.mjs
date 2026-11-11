import { readFileSync } from "node:fs";

import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";
import typescriptPlugin from "@typescript-eslint/eslint-plugin";
import globals from "globals";

const legacy = JSON.parse(readFileSync(new URL("./.eslintrc.json", import.meta.url), "utf8"));

// Next.js 16 provides a native flat config, while the retained .eslintrc.json
// describes legacy-compatible rules. Apply its recommended presets here.
const config = [
  { ignores: ["public/assets/**"] },
  js.configs.recommended,
  ...nextVitals,
  {
    files: ["**/*.{js,jsx,mjs,ts,tsx}"],
    languageOptions: {
      ecmaVersion: legacy.parserOptions.ecmaVersion,
      sourceType: legacy.parserOptions.sourceType,
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node,
      },
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    rules: {
      ...typescriptPlugin.configs.recommended.rules,
      ...legacy.rules,
    },
  },
  prettier,
];

export default config;
