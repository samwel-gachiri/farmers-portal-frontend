// Legacy ESLint config for vue-cli-service (webpack dev build) which does not yet read flat eslint.config.js
// Keep in sync with rules in eslint.config.js until you migrate away from Vue CLI or disable the old eslint loader.
module.exports = {
    root: true,
    env: { node: true },
    extends: [
        'plugin:vue/essential',
        'eslint:recommended',
        'plugin:sonarjs/recommended',
    ],
    plugins: ['sonarjs'],
    parserOptions: {
        parser: '@babel/eslint-parser',
        requireConfigFile: false,
    },
    rules: {
        'vue/multi-word-component-names': 'off',
        'prefer-destructuring': 'off',
        'linebreak-style': 'off',
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'max-len': 'off',
        'sonarjs/cognitive-complexity': 'off',
        'sonarjs/no-identical-functions': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': ['error', 'always', {
            js: 'always',
            mjs: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
            vue: 'always',
        }],
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
            ],
            env: { jest: true },
        },
    ],
}; module.exports = {
    root: false,
    env: {
        node: true,
    },
    extends: [
        'plugin:vue/essential',
        '@vue/airbnb',
        'plugin:sonarjs/recommended',
    ],
    plugins: [
        'sonarjs',
    ],
    rules: {
        'vue/multi-word-component-names': 'off',
        'prefer-destructuring': 'off',
        'linebreak-style': 0,
        'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        // Allow using or omitting .js/.vue extensions freely
        // 'import/extensions': 'off',
        'import/extensions': ['error', 'always', { // Enforce extensions
            js: 'always', // .js files don't need extensions
            mjs: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
            vue: 'always', // .vue files must have extensions
        }],
        'max-len': 0,
        // "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
        'sonarjs/cognitive-complexity': 'off',
        'sonarjs/no-identical-functions': 'off',
        'import/no-extraneous-dependencies': 'off',
    },
    parserOptions: {
        parser: 'babel-eslint',
    },
    overrides: [
        {
            files: [
                '**/__tests__/*.{j,t}s?(x)',
                '**/tests/unit/**/*.spec.{j,t}s?(x)',
            ],
            env: {
                jest: true,
            },
        },
    ],
};
