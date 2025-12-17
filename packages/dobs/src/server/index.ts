import { Server } from 'node:http';
import httpServer, { Middleware } from '@dobsjs/http';

import { resolveConfig, ServerConfig } from '~/dobs/config';
import { createPluginRunner } from '~/dobs/plugin';

import { createRouterMiddleware } from './router';
import { loadServerEntry } from './server-entry';
import { devtool } from './plugins/devtool';
import chalk from 'chalk';

type CreateServerReturn<T extends ServerConfig> = T['mode'] extends 'middleware'
  ? Middleware[]
  : Server;

export async function createDobsServer<T extends ServerConfig>(
  config?: T,
): Promise<CreateServerReturn<T>> {
  config ??= {} as any;
  config.plugins ??= [];

  // optional plugins
  if (config?.devtool) {
    config.plugins.push(devtool());
  }

  const runner = createPluginRunner(config.plugins);

  const resolvedConfig = resolveConfig(config);
  const server = httpServer(resolvedConfig.createServer);
  const serverEntry = await loadServerEntry(resolvedConfig);

  // [plugin] execute plugin.server
  await runner.execute('server', server);

  // user server entry
  if (serverEntry) serverEntry(server);
  // user middleware
  server.middlewares.push(...resolvedConfig.middlewares);
  // router middleware
  server.middlewares.push(await createRouterMiddleware(resolvedConfig));

  // 404 handler
  server.middlewares.push(resolvedConfig.onNotFound);

  // return middleware
  if (resolvedConfig.mode === 'middleware')
    return server.middlewares as unknown as CreateServerReturn<T>;
  // return server instance
  return server.listen(resolvedConfig.port, () => {
    // $ dobs dev --internal-show-plugins
    if (process.argv.includes('--dobs-show-plugins')) {
      for (const plugin of runner.plugins) {
        const front = chalk.gray(`${chalk.dim('plugins/')}${plugin.name || 'unknown'}`);
        const frontlen = `plugins/${plugin.name || 'unknown'}`.length;
        console.log(
          ` - ${front}${' '.repeat(50 - frontlen > 0 ? 50 - frontlen : 1)} | ${Object.keys(plugin).join(', ')}`,
        );
      }
    }
  }) as unknown as CreateServerReturn<T>;
}
