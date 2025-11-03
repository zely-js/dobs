# module-loader-ts

Module loader supporting TypeScript, JavaScript, and JSON loading

```ts
import { load } from 'module-loader-ts';
import path from 'path';

await load('./config.ts'); // load relative path
await load(path.resolve('config.ts')); // load absolute path
await load('./config', {
  // capture config.ts, config.js, config.json, config.extension, config.extension2
  extension: [
    '.ts', // config.ts
    '.js', // config.js
    '.json', // config.json
    { ext: '.extension1', as: 'js' }, // config.extension1 (loaded as js)
    { ext: '.extension2', as: 'ts' }, // config.extension2 (loaded as ts)
    { ext: '.extension3', as: 'json' }, // config.extension3 (loaded as json)
    '', // config
  ],
});
```

## Auto Classification Extension

```ts
const MODULE_TYPE = {
  TYPESCRIPT: ['.ts', '.mts', '.cts', '.tsx'],
  JAVASCRIPT: ['.js', '.mjs', '.cjs', '.jsx'],
  JSON: ['.jsonc', '.json'],
};
```

For extensions other than these, please manually classify them in the extension array.

> If the module type is unknown, it is classified as js

## Options

#### `extensions?`

Specifies the file extensions to search for, in order of priority (from index 0).
Each entry can be a string or an object defining how the extension should be treated.

```json
[".ts", ".js", { "ext": ".custom", "as": "ts" }]
```

#### `tsconfig?`

Path to a `tsconfig.json` file.

#### `resolveRolldownOptions?`

A function that allows customizing the Rolldown build options before the build starts.

```ts
resolveRolldownOptions?: (opt: BuildOptions) => BuildOptions | Promise<BuildOptions>;
```

You can modify or extend the build configuration dynamically by returning a modified `BuildOptions` object.

## LICENSE

MIT
