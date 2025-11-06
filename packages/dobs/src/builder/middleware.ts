import { Middleware } from '@dobsjs/http';

import { createInternalRouter } from '~/dobs/server/router';
import { convertPathToRegex } from '~/dobs/shared/urlPath';
import { ResolvedServerConfig } from '~/dobs/config';

interface Route {
  regex: RegExp;
  params: string[];
  relativePath: string;
}

export function _buildInternalMiddleware(
  routes: Record<string, any>,
  cfg: ResolvedServerConfig,
): Middleware {
  const builtRoutes: Route[] = Object.keys(routes).map((file) => {
    const normalized = file.replace(/\\/g, '/').replace(/^\/?/, '');
    return { ...convertPathToRegex(normalized), relativePath: normalized };
  });

  const builtMap = new Map<string, string>();
  const preloadedModules = new Map<string, any>(
    Object.entries(routes).map(([k, v]) => [
      k.replace(/\\/g, '/').replace(/^\/?/, ''),
      v,
    ]),
  );

  return createInternalRouter(cfg, builtRoutes, builtMap, preloadedModules);
}
