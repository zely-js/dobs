import { Middleware } from '@dobsjs/http';

import { createInternalRouter } from '~/dobs/server/router';
import { convertPathToRegex } from '~/dobs/shared/urlPath';
import { ResolvedServerConfig } from '~/dobs/config';
import { createPluginRunner } from '../plugin';

interface Route {
  regex: RegExp;
  params: string[];
  relativePath: string;
}

export async function _buildInternalMiddleware(
  routes: Record<string, any>,
  cfg: ResolvedServerConfig,
): Promise<Middleware> {
  const builtRoutes: Route[] = Object.keys(routes).map((file) => {
    const normalized = file.replace(/\\/g, '/').replace(/^\/?/, '');
    return { ...convertPathToRegex(normalized), relativePath: normalized };
  });
  const runner = createPluginRunner(cfg.plugins);

  const builtMap = new Map<string, string>();
  const preloadedModules = new Map<string, any>(
    await Promise.all(
      Object.entries(routes).map(async ([k, v]) => {
        return [
          k.replace(/\\/g, '/').replace(/^\/?/, ''),
          await runner.execute('generateRoute', v),
        ] as const;
      }),
    ),
  );

  return createInternalRouter(cfg, builtRoutes, builtMap, preloadedModules);
}
