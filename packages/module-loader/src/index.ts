import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, join, parse } from 'node:path';
import { build, BuildOptions } from 'rolldown';
import { dynamicImport } from '~/dobs/server/load';
import nodeExternal from '~/dobs/server/plugins/rolldown/external';

const MODULE_TYPE = {
  TYPESCRIPT: ['.ts', '.mts', '.cts', '.tsx'],
  JAVASCRIPT: ['.js', '.mjs', '.cjs', '.jsx'],
  JSON: ['.jsonc', '.json'],
};

export interface Extension {
  ext: string;
  as: 'js' | 'ts' | 'json';
}

export interface LoadOption {
  /**
   * extensions to find.
   *
   * Search in order from the 0th index.
   * ```json
   * [
   * ".ts",
   * ".js",
   * { "ext": ".custom", as: "ts" }
   * ]
   * ```
   */
  extensions?: Array<Extension | string>;
  /** provide tsconfig path */
  tsconfig?: string;

  /** rolldown build options */
  resolveRolldownOptions?: (opt: BuildOptions) => BuildOptions | Promise<BuildOptions>;
}

function getModuleType(ext: string) {
  if (MODULE_TYPE.JAVASCRIPT.includes(ext)) return 'js';
  if (MODULE_TYPE.TYPESCRIPT.includes(ext)) return 'ts';
  if (MODULE_TYPE.JSON.includes(ext)) return 'json';
  return 'unknown';
}

function resolveExtension(extensions: LoadOption['extensions'] = []) {
  const resolvedExtensions: Extension[] = [];

  for (const extension of extensions) {
    if (typeof extension === 'string') {
      const moduleType = getModuleType(extension);
      resolvedExtensions.push({
        ext: extension,
        as: moduleType === 'unknown' ? 'js' : moduleType,
      });
    } else {
      resolvedExtensions.push(extension);
    }
  }

  return resolvedExtensions;
}

function findTarget(
  target: string,
  options?: LoadOption,
): { file: string; type: 'js' | 'ts' | 'json' } | null {
  if (!options?.extensions && existsSync(target)) {
    const { ext } = parse(target);
    const moduleType = getModuleType(ext);

    return { file: target, type: moduleType === 'unknown' ? 'js' : moduleType };
  }

  const extensions = resolveExtension(options?.extensions);

  for (const extension of extensions) {
    const file = `${target}${extension.ext}`;

    if (existsSync(file)) {
      return { file, type: extension.as };
    }
  }

  return null;
}

function randomString(length = 8) {
  return Math.random()
    .toString(36)
    .slice(2, 2 + length);
}

export async function load(input: string, options?: LoadOption) {
  const [mod, temp] = await compileModule(input, options);

  if (temp) unlinkSync(temp);

  return mod;
}

export async function compileModule(
  input: string,
  options?: LoadOption,
): Promise<[any, string]> {
  const target = findTarget(input, options);

  if (!target) return [null, null];

  if (target.type === 'js' || target.type === 'json') {
    return [await dynamicImport(target.file), null];
  }

  const temp = join(__dirname, `../../.temp/${randomString()}.js`);
  const tempPackagejson = join(__dirname, `../../.temp/package.json`);
  const tsconfig = options?.tsconfig ?? join(process.cwd(), 'tsconfig.json');

  mkdirSync(dirname(temp), { recursive: true });
  writeFileSync(tempPackagejson, '{"type": "commonjs"}');

  // console.log(target.file);

  const buildOptions: BuildOptions = {
    input: target.file,

    output: {
      file: temp,
      format: 'cjs',
      esModule: true,
    },

    tsconfig: existsSync(tsconfig) ? tsconfig : undefined,

    platform: 'node',
    logLevel: 'silent',
    plugins: [nodeExternal()],
  };

  if (options?.resolveRolldownOptions) await options.resolveRolldownOptions(buildOptions);

  await build(buildOptions);

  const mod = await dynamicImport(temp);

  return [mod, temp];
}
