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
  {
    files: ["src/**/*.tsx"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Literal[value=/\\brounded(-[a-z]{1,2})?-\\[|\\bshadow-\\[/]",
          message:
            "Arbitrary radius or shadow. Use rounded-input, rounded-card, rounded-panel, rounded-full, rounded-xs, shadow-card or shadow-lift. A deliberate one-off shape gets an eslint-disable-next-line with a `token-exempt:` reason.",
        },
        {
          selector: "TemplateElement[value.raw=/\\brounded(-[a-z]{1,2})?-\\[|\\bshadow-\\[/]",
          message:
            "Arbitrary radius or shadow. Use rounded-input, rounded-card, rounded-panel, rounded-full, rounded-xs, shadow-card or shadow-lift. A deliberate one-off shape gets an eslint-disable-next-line with a `token-exempt:` reason.",
        },
        {
          selector:
            "Literal[value=/\\b(bg|text|ring|border|from|via|to|fill|stroke|decoration|outline|shadow|divide|accent|caret|placeholder)-\\[#/]",
          message:
            "Arbitrary colour. Add it to @theme in globals.css and use the token, so the palette stays one list rather than a set of hex values spread across components. A deliberate one-off gets an eslint-disable-next-line with a `token-exempt:` reason.",
        },
        {
          selector:
            "TemplateElement[value.raw=/\\b(bg|text|ring|border|from|via|to|fill|stroke|decoration|outline|shadow|divide|accent|caret|placeholder)-\\[#/]",
          message:
            "Arbitrary colour. Add it to @theme in globals.css and use the token, so the palette stays one list rather than a set of hex values spread across components. A deliberate one-off gets an eslint-disable-next-line with a `token-exempt:` reason.",
        },
      ],
    },
  },
]);

export default eslintConfig;
