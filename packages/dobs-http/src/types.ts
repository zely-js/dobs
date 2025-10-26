import 'node:http';

import type { AppRequest, AppResponse } from './context';

export type Middleware = (
  req: AppRequest,
  res: AppResponse,
  next: () => Promise<void>,
) => void | Promise<void>;

export type HandlerResponse = object | bigint | number;

export type Handler<Params = any> = (
  req: AppRequest<Params>,
  res: AppResponse,
) => HandlerResponse;

declare module 'node:http' {
  interface IncomingMessage {
    _body?: string;
  }
}
