import type { Plugin } from 'rolldown';

export interface ExcludeNodeModulesOptions {
  allow?: string[];
}

/**
 * Rolldown plugin for exclude node_modules from bundle
 */
export default function nodeExternal(options: ExcludeNodeModulesOptions = {}): Plugin {
  const { allow = [] } = options;
  const allowSet = new Set(allow);

  return {
    name: 'dobs:exclude-node-modules',
    async resolveId(source: string, importer?: string | undefined) {
      // console.log(source, allowSet.has(source), allowSet);

      // entry module
      if (!importer) return null;
      // virtual module
      if (source.startsWith('\0')) return null;
      // allowed module
      if (allowSet.has(source)) return null;
      // include relative path
      if (source.startsWith('.') || source.startsWith('/')) return null;

      return { id: source, external: true } as any;
    },
  };
}
