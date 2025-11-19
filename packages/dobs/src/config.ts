import { createServer } from 'node:http';
import type { BaseServer, Middleware } from '@dobsjs/http';
import { deepmerge } from 'deepmerge-ts';
import { createPluginRunner, Plugin } from './plugin';

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
};

export function resolveConfig(config: ServerConfig): ResolvedServerConfig {
  const runner = createPluginRunner(config?.plugins ?? []);

  // [plugin] execute plugin.config
  runner.execute('config', config);

  const resolvedConfig = deepmerge(DEFAULT_CONFIG, config) as ResolvedServerConfig;

  // [plugin] execute plugin.resolvedConfig
  runner.execute('resolvedConfig', resolvedConfig);

  return resolvedConfig;
}
