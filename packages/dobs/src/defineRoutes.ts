import { Routes } from './types';

/**
 * Define route object.
 *
 * ```ts
 * export default defineRoutes({
 *    GET(req, res) { ... }, // dynamic handler
 *    POST: { message: "hello world" } // static handler
 * });
 * ```
 *
 * @deprecated use `defineRouter()` instead
 */
export function defineRoutes(routes: Routes, wrappers: any[] = []): Routes {
  return defineRouter(routes, wrappers);
}

/**
 * Define route object.
 *
 * ```ts
 * export default defineRouter({
 *    GET(req, res) { ... }, // dynamic handler
 *    POST: { message: "hello world" } // static handler
 * });
 * ```
 */
export function defineRouter(routes: Routes, wrappers: any[] = []): Routes {
  return wrappers.reduce((acc, wrapper) => wrapper(acc), routes);
}
