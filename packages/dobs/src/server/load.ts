/* eslint-disable @typescript-eslint/no-unused-vars */
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';

type ModuleExports = Record<string, any>;

export async function dynamicImport(filePath: string): Promise<ModuleExports> {
  try {
    const fileUrl = pathToFileURL(filePath);
    // cache-busting query param so ESM import treats it as a new specifier
    const moduleUrl = `${fileUrl.href}?t=${Date.now()}`;
    return await import(moduleUrl);
  } catch (_e) {
    const require = createRequire(import.meta.url);
    try {
      const resolved = require.resolve(filePath);
      // remove from require cache to force re-require for CommonJS modules
      if (require.cache && require.cache[resolved]) {
        delete require.cache[resolved];
      }
    } catch {
      // nothing
    }
    const exports = require(filePath);
    return exports && exports.__esModule && exports.default ? exports.default : exports;
  }
}
