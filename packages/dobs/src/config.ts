import { createServer } from 'node:http';
import type { BaseServer, Middleware } from '@dobsjs/http';
import { deepmerge } from 'deepmerge-ts';
import { createPluginRunner, Plugin } from './plugin';
import chalk from 'chalk';
import { isAbsolute } from 'node:path';

// utils

export function getByPath<T extends Record<string, any>, R = any>(
  obj: T,
  path: string,
): R | undefined {
  return path
    .split('.')
    .reduce<any>((acc, key) => (acc != null ? acc[key] : undefined), obj);
}

type LooseKey<T> = keyof T | (string & {});

type TypeList =
  | 'string'
  | 'number'
  | 'bigint'
  | 'boolean'
  | 'symbol'
  | 'undefined'
  | 'object'
  | 'function';

const warn = (message: string) => console.log(chalk.yellow(`(!) ${message}`));

function validateConfig(config: ResolvedServerConfig) {
  const type = (key: LooseKey<ResolvedServerConfig>, type: TypeList) => {
    const value = getByPath(config, key);
    if (typeof value !== type && typeof value !== 'undefined')
      warn(`config.${key} must be a ${type}.`);
  };

  const relative = (key: LooseKey<ResolvedServerConfig>) => {
    const value = getByPath(config, key);
    if (isAbsolute(value) && typeof value !== 'undefined')
      warn(`config.${key} must be a relative path.`);
  };

  const absolute = (key: LooseKey<ResolvedServerConfig>) => {
    const value = getByPath(config, key);
    if (!isAbsolute(value) && typeof value !== 'undefined')
      warn(`config.${key} must be a relative path.`);
  };

  const value = (key: LooseKey<ResolvedServerConfig>, allowedValues: any[]) => {
    const value = getByPath(config, key);
    if (!allowedValues.includes(value) && typeof value !== 'undefined')
      warn(
        `config.${key} must be one of: ${allowedValues.map((v) => `"${v}"`).join(', ')}. - (current: ${value})`,
      );
  };

  type('build', 'object');
  type('build.directory', 'string');
  type('createServer', 'function');
  type('cwd', 'string');
  type('devtool', 'boolean');
  type('middlewares', 'object');
  type('mode', 'string');
  type('onNotFound', 'function');
  type('plugins', 'object');
  type('port', 'number');
  type('serverEntry', 'string');
  type('temp', 'string');

  relative('build.directory');
  relative('temp');
  relative('serverEntry');

  absolute('cwd');

  value('mode', ['serve', 'middleware']);
}

export type ServerEntry = (server: BaseServer) => void;

export interface ResolvedServerConfig {
  /** port to serve (default: 8080) */
  port: number;
  /** middlewares */
  middlewares: Middleware[];
  /** base server */
  createServer: typeof createServer;
  /** cwd */
  cwd: string;
  /**
   * + `serve` : return server instance (default)
   * + `middleware` : return dobs middleware
   */
  mode: 'serve' | 'middleware';
  /**
   * temp path (relative, default: `./.dobs/`)
   */
  temp: string;

  build: {
    /**
     * build output directory (relative)
     */
    directory: string;
  };

  plugins: Plugin[];

  serverEntry: string;

  /** enable devtool. (@dobsjs/dev package must have been installed.) */
  devtool: boolean;

  onNotFound: Middleware;
}

export type ServerConfig = Partial<ResolvedServerConfig>;

export const DEFAULT_CONFIG: ResolvedServerConfig = {
  port: 8080,
  middlewares: [],
  createServer: undefined,
  cwd: process.cwd(),
  mode: 'serve',
  temp: './.dobs/',
  build: {
    directory: 'dist',
  },
  plugins: [],
  serverEntry: 'server.entry',
  devtool: false,
  onNotFound: (req, res, next) => {
    res.status(404).end();
    next();
  },
};

export function resolveConfig(config: ServerConfig): ResolvedServerConfig {
  // skip if already resolved
  if ((config as any).__resolved__) return config as ResolvedServerConfig;

  const runner = createPluginRunner(config?.plugins ?? []);

  // [plugin] execute plugin.config
  runner.execute('config', config);

  const resolvedConfig = deepmerge(DEFAULT_CONFIG, config) as ResolvedServerConfig;

  // [plugin] execute plugin.resolvedConfig
  runner.execute('resolvedConfig', resolvedConfig);

  validateConfig(resolvedConfig);

  // mark as resolved
  (resolvedConfig as any).__resolved__ = true;

  return resolvedConfig;
}
