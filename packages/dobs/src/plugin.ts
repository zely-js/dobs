import type { BuildOptions } from 'rolldown';
import type { BaseServer } from '@dobsjs/http';

import type { ResolvedServerConfig, ServerConfig } from './config';
import type { Promisable, Maybe } from './_types';
import type { Routes } from './types';

import { errorTracker } from '~/dobs/server/plugins/builtin-tracker';

export interface ErrorContext {
  error: Error;
}

export interface Plugin {
  name: string;

  /** modify server config */
  config?(config: ServerConfig): Maybe<ServerConfig>;

  /** access to resolved server config */
  resolvedConfig?(config: ResolvedServerConfig): Maybe<ResolvedServerConfig>;

  /**
   * resolve rolldown build options
   * https://rolldown.rs/options/input
   */
  resolveBuildOptions?(buildOptions: BuildOptions): Maybe<BuildOptions>;

  server?(server: BaseServer): Promisable<Maybe<BaseServer>>;

  generateRoute?(route: Routes): Promisable<Routes>;

  handleError?(error: ErrorContext): Promisable<void>;
}

type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

export function createPluginRunner(plugins: Plugin[]) {
  const builtin_plugins = [errorTracker()];
  plugins = plugins.concat(builtin_plugins);

  return {
    plugins,

    async execute<K extends FunctionKeys<Plugin>>(
      key: K,
      ...args: Parameters<NonNullable<Plugin[K]>>
    ): Promise<ReturnType<NonNullable<Plugin[K]>>> {
      let result: any = args[0];

      for (const plugin of plugins) {
        const fn = plugin[key];
        if (typeof fn !== 'function') continue;

        try {
          const returned = await (fn as any).apply(plugin, [result]);
          if (returned !== undefined && returned !== null) {
            result = returned;
          }
        } catch (e) {
          throw new Error(`[${plugin.name}] ${e.message}`);
        }
      }

      return result;
    },
  };
}
