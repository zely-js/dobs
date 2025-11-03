import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: './src/index.ts',
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
