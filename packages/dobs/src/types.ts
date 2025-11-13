/**
 * This code exists solely to support TypeScript.
 */

import { AppRequest, AppResponse } from '@dobsjs/http';
import { ServerConfig } from './config';
import type { LooseObject, Promisable } from './_types';

export type Handler = (req: AppRequest, res: AppResponse) => Promisable<any>;

export type RouterKey = 'ALL' | 'GET' | 'POST' | 'DELETE' | 'UPDATE';

export type Routes =
  | LooseObject<RouterKey | `$${RouterKey}`, Handler | Record<string, any>>
  | Handler;

export function defineConfig(userConfig: Omit<ServerConfig, 'mode'>) {
  return userConfig;
}
