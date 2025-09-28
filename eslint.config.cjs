const nx = require('@nx/eslint-plugin');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  // Disable stylistic rules that conflict with Prettier
  eslintConfigPrettier,
  {
    ignores: ['**/dist'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?js$'],
          // Projects must respect scope and type layering
          depConstraints: [
            // Apps (frontend/backend) can depend on libs of same scope or shared, and never on other apps
            {
              sourceTag: 'type:app',
              onlyDependOnLibsWithTags: ['type:lib'],
            },
            // E2E can depend on the app it tests and shared libs
            {
              sourceTag: 'type:e2e',
              onlyDependOnLibsWithTags: ['type:app', 'type:lib'],
            },
            // Scope constraints: frontend pieces cannot depend on backend, and vice versa
            {
              sourceTag: 'scope:frontend',
              notDependOnLibsWithTags: ['scope:backend'],
            },
            {
              sourceTag: 'scope:backend',
              notDependOnLibsWithTags: ['scope:frontend'],
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
