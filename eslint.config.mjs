import js from "@eslint/js"
import tseslint from "typescript-eslint"
import solid from "eslint-plugin-solid/configs/typescript"
import prettier from "eslint-config-prettier"

export default tseslint.config(
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.turbo/**",
      "**/sst-env.d.ts",
      "**/*.gen.ts",
      "**/generated/**",
      "**/.output/**",
      "**/.astro/**",
      "**/public/**/*.js"
    ]
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // TypeScript-specific rules - warnings for gradual migration
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-namespace": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-this-alias": "warn",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "warn",
      // Base ESLint rules - warnings for upstream code patterns
      "no-console": "off",
      "no-useless-escape": "warn",
      "no-constant-condition": "warn",
      "no-control-regex": "warn",
      "no-async-promise-executor": "warn",
      "no-empty": "warn",
      "no-fallthrough": "warn",
      "prefer-const": "warn",
    },
  },
  {
    files: [
      "packages/app/**/*.tsx",
      "packages/ui/**/*.tsx",
      "packages/desktop/**/*.tsx",
      "packages/enterprise/**/*.tsx"
    ],
    ...solid,
    rules: {
      ...solid.rules,
      // Downgrade to warnings - these are valid patterns in the upstream codebase
      "solid/prefer-for": "warn",
      "solid/reactivity": "warn",
      "solid/components-return-once": "warn",
      "solid/style-prop": "warn",
      "solid/no-innerhtml": "warn",
    },
  },
  // Relaxed rules for opencode package (core CLI) which uses namespaces and dynamic typing extensively
  {
    files: ["packages/opencode/**/*.ts"],
    rules: {
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "off",
      "no-case-declarations": "off",
    },
  },
  // Relaxed rules for console app's zen util (API proxy with dynamic types)
  {
    files: ["packages/console/app/src/routes/zen/util/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_"
      }],
    },
  },
  // Relaxed rules for SDK (generated code patterns)
  {
    files: ["packages/sdk/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  // Allow namespaces in util package
  {
    files: ["packages/util/**/*.ts"],
    rules: {
      "@typescript-eslint/no-namespace": "off",
    },
  },
  // JavaScript/MJS files - relax rules for scripts and fixtures
  {
    files: ["**/*.mjs", "**/*.js"],
    rules: {
      "no-undef": "off",
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/no-require-imports": "warn",
    },
  },
  // Relaxed rules for console core (database/billing utilities)
  {
    files: ["packages/console/core/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Relaxed rules for function package (Cloudflare Workers)
  {
    files: ["packages/function/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  // Relaxed rules for slack/plugin packages
  {
    files: ["packages/slack/**/*.ts", "packages/plugin/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  prettier,
)
