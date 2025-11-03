/**
 * This code exists solely to support TypeScript.
 */

import { AppRequest, AppResponse } from '@dobsjs/http';
import { ServerConfig } from './config';
import type { LooseObject, Promisable } from './_types';

export type Handler = (req: AppRequest, res: AppResponse) => Promisable<any>;

export type Routes = LooseObject<'ALL' | 'GET' | 'POST' | 'DELETE' | 'UPDATE', Handler>;

/**
 * Define route object.
 *
 * ```ts
 * export default defineRoutes({
 *    GET(req, res) { ... }
 * });
 * ```
 *
 * @param routes routes object.
 */
export function defineRoutes(routes: Routes) {
  return routes;
}

export function defineConfig(userConfig: Omit<ServerConfig, 'mode'>) {
  return userConfig;
}
