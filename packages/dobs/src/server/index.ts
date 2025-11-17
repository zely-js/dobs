import { Server } from 'node:http';
import httpServer, { Middleware } from '@dobsjs/http';

import { resolveConfig, ServerConfig } from '~/dobs/config';
import { createPluginRunner } from '~/dobs/plugin';

import { createRouterMiddleware } from './router';

type CreateServerReturn<T extends ServerConfig> = T['mode'] extends 'middleware'
  ? Middleware[]
  : Server;

export async function createDobsServer<T extends ServerConfig>(
  config?: T,
): Promise<CreateServerReturn<T>> {
  const plugins = config?.plugins || [];
  const runner = createPluginRunner(plugins);

  // [plugin] execute plugin.config
  await runner.execute('config', config);

  const resolvedConfig = resolveConfig(config);
  const server = httpServer(resolvedConfig.createServer);

  // [plugin] execute plugin.server
  await runner.execute('server', server);

  // user middleware
  server.middlewares.push(...resolvedConfig.middlewares);
  // router middleware
  server.middlewares.push(await createRouterMiddleware(resolvedConfig));

  // return middleware
  if (resolvedConfig.mode === 'middleware')
    return server.middlewares as unknown as CreateServerReturn<T>;
  // return server instance
  return server.listen(resolvedConfig.port, () => {
    // TODO
  }) as unknown as CreateServerReturn<T>;
}
