/**
 * functions used by build file
 * require("dobs/_build");
 */

export { _buildInternalMiddleware } from './middleware';
export { default as createHTTPServer } from '@dobsjs/http';
export { createPluginRunner } from '~/dobs/plugin';

export function init() {
  process.env.NODE_ENV = 'production';
}
