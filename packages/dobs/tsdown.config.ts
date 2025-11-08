import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: './src/index.ts',
    platform: 'node',
    format: ['cjs', 'esm'],
  },
  {
    entry: './src/builder/exports.ts',
    platform: 'node',
    format: ['cjs', 'esm'],
  },
  {
    entry: './src/experimental.ts',
    platform: 'node',
    format: ['cjs', 'esm'],
  },
  {
    entry: './src/cli.ts',
    platform: 'node',
    format: ['cjs'],
    dts: false,
  },
]);
