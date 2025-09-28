import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

export default [
    {
        ignores: [
            "node_modules/**",
            ".next/**",
            ".turbo/**",
            "dist/**",
        ],
    },
    ...compat.extends("next/core-web-vitals", "next/typescript"),
    {
        files: ["**/*.ts", "**/*.tsx"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json", // 타입 체크 활성화
                tsconfigRootDir: __dirname,
            },
        },
        plugins: {
            "@typescript-eslint": tsPlugin,
        },
        rules: {
            // 타입체크 기반 규칙 켜기
            ...tsPlugin.configs["recommended-type-checked"].rules,
            ...tsPlugin.configs["strict-type-checked"].rules,

            // 커스텀 추가
            "@typescript-eslint/no-unused-vars": "error",
        },
    },
];
