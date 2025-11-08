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
 */
export function defineRoutes(routes: Routes, wrappers: any[] = []) {
  return wrappers.reduce((acc, wrapper) => wrapper(acc), routes);
}
