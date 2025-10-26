import {
  createServer as defaultCreateServer,
  IncomingMessage,
  Server,
  ServerResponse,
} from 'node:http';
import { createRequest, createResponse } from './context';
import { Middleware } from './types';

function getBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
  });
}

class BaseServer {
  middlewares: Middleware[];

  server: Server;

  on: Server['on'];
  off: Server['off'];
  once: Server['once'];
  addListener: Server['addListener'];
  removeListener: Server['removeListener'];
  removeAllListeners: Server['removeAllListeners'];
  emit: Server['emit'];
  listeners: Server['listeners'];
  listenerCount: Server['listenerCount'];
  listen: Server['listen'];

  constructor(cs: typeof defaultCreateServer = defaultCreateServer) {
    this.middlewares = [];
    this.server = cs(this.handle.bind(this));

    // binding
    this.on = this.server.on.bind(this.server);
    this.off = this.server.off.bind(this.server);
    this.once = this.server.once.bind(this.server);
    this.addListener = this.server.addListener.bind(this.server);
    this.removeListener = this.server.removeListener.bind(this.server);
    this.removeAllListeners = this.server.removeAllListeners.bind(this.server);
    this.emit = this.server.emit.bind(this.server);
    this.listeners = this.server.listeners.bind(this.server);
    this.listenerCount = this.server.listenerCount.bind(this.server);
    this.listen = this.server.listen.bind(this.server);
  }

  /**
   * append middlewares
   * ```ts
   * app.use(middleware);
   * ```
   * @param middlewares Middlewares
   */
  use(...middlewares: Middleware[]) {
    middlewares.forEach((middleware) => {
      // check is function
      if (typeof middleware !== 'function') {
        // console.error('middleware must be function.');
      } else {
        this.middlewares.push(middleware);
      }
    });

    return this;
  }

  private handle(req: IncomingMessage, res: ServerResponse) {
    if (this.middlewares.length === 0) {
      res.statusCode = 404;
      res.end();
    }

    let index = -1;

    const request = createRequest(req);
    const response = createResponse(res);

    const loop = async () => {
      if (index < this.middlewares.length && !res.writableEnded) {
        const middleware = this.middlewares[(index += 1)];

        if (middleware) {
          let called = false;
          const next = async () => {
            if (called) throw new Error('next() called multiple times');
            called = true;
            await loop();
          };

          await middleware(request, response, next);
        }
      }
    };

    getBody(req).then((body) => {
      (request as any)._body = body;
      loop();
    });
  }
}

function app(cs: typeof defaultCreateServer = defaultCreateServer) {
  return new BaseServer(cs);
}

export { BaseServer };
export * from './context';
export * from './types';
export default app;
