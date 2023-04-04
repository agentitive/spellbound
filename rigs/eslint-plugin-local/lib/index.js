/**
 * @fileoverview Linting configuration for solid projects
 * @author Dustin
 */
"use strict"

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const requireIndex = require("requireindex")
const path = require("path")
//------------------------------------------------------------------------------
// Plugin Definition
//------------------------------------------------------------------------------

module.exports = {
    configs: {
        node: {
            ignorePatterns: [
                "node_modules",
                "dist",
                "docs",
                "deploy",
            ],
            extends: [
                "eslint:recommended",
                "plugin:@typescript-eslint/recommended"
            ],
            parser: "@typescript-eslint/parser",
            parserOptions: {
                project: ["./tsconfig.json"],
                sourceType: "module",
                ecmaFeatures: {
                    modules: true,
                },
                extraFileExtensions: [".md", ".json"],
            },
            env: {
                node: true,
                es6: true,
            },
            plugins: [
                "@typescript-eslint",
                "import",
                "import-newlines",
                "simple-import-sort",
                "unused-imports",
                "decorator-position",
            ],
            rules: {
                indent: ["error", 4, { SwitchCase: 1 }],
                semi: ["error", "never"],
                camelcase: "off",
                "no-constant-condition": "off",
                "no-unused-vars": "off",
                "no-invalid-this": "off",
                "no-useless-escape": "off",
                "no-useless-constructor": "off",

                "@typescript-eslint/no-floating-promises": "error",
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/ban-types": "off",
                "@typescript-eslint/no-empty-function": "off",
                "@typescript-eslint/no-var-requires": "off",
                "@typescript-eslint/explicit-member-accessibility": [
                    "error",
                    {
                        overrides: {
                            accessors: "off",
                            constructors: "no-public",
                            methods: "off",
                            properties: "explicit",
                            parameterProperties: "off",
                        },
                    },
                ],
                "@typescript-eslint/no-invalid-this": ["error"],
                "@typescript-eslint/no-shadow": ["warn"],
                "@typescript-eslint/interface-name-prefix": "off",
                "@typescript-eslint/array-type": [
                    "error",
                    { default: "array-simple" },
                ],
                "@typescript-eslint/no-use-before-define": "off",
                "@typescript-eslint/explicit-member-accessibility": "off",
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/no-non-null-assertion": "off",
                "@typescript-eslint/no-unused-vars": "error",
                "@typescript-eslint/explicit-module-boundary-types": "off",

                "unused-imports/no-unused-imports": "error",
                "import/no-duplicates": "error",
                "import/first": "error",
                "import/newline-after-import": [
                    "error",
                    {
                        count: 2,
                    },
                ],
                "import-newlines/enforce": [
                    "error",
                    {
                        semi: false,
                        maxLen: 80,
                        items: 4,
                        forceSingleLine: false,
                    },
                ],
                "simple-import-sort/imports": "error",
                "simple-import-sort/exports": "error",

                "decorator-position/decorator-position": [
                    "error",
                    {
                        properties: "above",
                    },
                ],
            },
            overrides: [
                {
                    files: ["src/**/*.spec.ts"],
                    env: {
                        jest: true,
                        node: true
                    },
                    parserOptions: {
                        project: ["tsconfig.json"],
                        sourceType: "module",
                        ecmaFeatures: {
                            modules: true,
                        },
                        extraFileExtensions: [".md", ".json"],
                    },
                },
            ],
        },
    },
}
