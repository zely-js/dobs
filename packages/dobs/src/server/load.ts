import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

type ModuleExports = Record<string, any>;

export async function dynamicImport(filePath: string): Promise<ModuleExports> {
  try {
    const resolved = require.resolve(filePath);
    if (require.cache[resolved]) {
      delete require.cache[resolved]; // ignore cache
    }
    const exports = require(filePath);
    return exports && exports.__esModule && exports.default ? exports.default : exports;
  } catch (e) {
    console.error('Failed to require:', filePath, e);
    throw e;
  }
}
