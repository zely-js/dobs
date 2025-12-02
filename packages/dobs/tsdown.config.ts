import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['./src/index.ts', './src/builder/exports.ts', './src/experimental.ts'],
    platform: 'node',
    format: ['cjs', 'esm'],
    external: ['@dobsjs/dev'],
  },
  {
    entry: './src/cli.ts',
    platform: 'node',
    format: ['cjs'],
    external: ['@dobsjs/dev'],
    dts: false,
  },
]);
