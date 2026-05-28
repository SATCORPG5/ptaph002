// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // Block raw portal brand hex (#14B8A6 teal, #080812 surface) inside JSX
  // className attributes. Tokens live in globals.css; use bg-portal-accent /
  // bg-portal-surface-1 (and variants) instead.
  {
    files: ["src/components/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector:
            "JSXAttribute[name.name='className'] Literal[value=/#(14B8A6|080812)/i]",
          message:
            "Raw portal brand hex (#14B8A6 / #080812) is banned in className. Use bg-portal-accent / bg-portal-surface-1 (or text-/border-/from-/to- variants).",
        },
        {
          selector:
            "JSXAttribute[name.name='className'] TemplateElement[value.raw=/#(14B8A6|080812)/i]",
          message:
            "Raw portal brand hex (#14B8A6 / #080812) is banned in className templates. Use bg-portal-accent / bg-portal-surface-1.",
        },
      ],
    },
  },
  ...storybook.configs["flat/recommended"]
]);

export default eslintConfig;
