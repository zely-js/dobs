import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: './src/index.ts',
    platform: 'node',
    format: ['cjs', 'esm'],
    external: ['@dobsjs/dev'],
  },
  {
    entry: './src/builder/exports.ts',
    platform: 'node',
    external: ['@dobsjs/dev'],
    format: ['cjs', 'esm'],
  },
  {
    entry: './src/experimental.ts',
    platform: 'node',
    external: ['@dobsjs/dev'],
    format: ['cjs', 'esm'],
  },
  {
    entry: './src/cli.ts',
    platform: 'node',
    format: ['cjs'],
    external: ['@dobsjs/dev'],
    dts: false,
  },
]);
