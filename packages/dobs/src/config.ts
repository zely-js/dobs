import { createServer } from 'node:http';
import type { Middleware } from '@dobsjs/http';
import { deepmerge } from 'deepmerge-ts';

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
}

export type ServerConfig = Partial<ResolvedServerConfig>;

export const DEFAULT_CONFIG: ResolvedServerConfig = {
  port: 8080,
  middlewares: [],
  createServer: undefined,
  cwd: process.cwd(),
  mode: 'serve',
  temp: './.dobs/',
};

export function resolveConfig(config: ServerConfig): ResolvedServerConfig {
  return deepmerge(DEFAULT_CONFIG, config) as ResolvedServerConfig;
}
