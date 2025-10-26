import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BaseServer } from '../src/';
import http from 'node:http';

function httpRequest(options: http.RequestOptions, body?: string) {
  return new Promise<{ status: number; data: string }>((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk.toString()));
      res.on('end', () => resolve({ status: res.statusCode || 0, data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

describe('BaseServer', () => {
  let server: BaseServer;
  const port = 3001;

  beforeAll(() => {
    server = new BaseServer();
    server.listen(port);
  });

  afterAll(() => {
    server.server.close();
  });

  it('should call middleware in order and modify body', async () => {
    let mw1Called = false;
    let mw2Called = false;

    server.middlewares = [];

    server.use(async (req, res, next) => {
      mw1Called = true;
      req._body = req._body?.toUpperCase();
      await next();
    });

    server.use((req, res) => {
      mw2Called = true;
      res.end(`Hello ${req._body || ''}`);
    });

    const response = await httpRequest(
      { hostname: 'localhost', port, path: '/', method: 'POST' },
      'world',
    );

    expect(mw1Called).toBe(true);
    expect(mw2Called).toBe(true);
    expect(response.data).toBe('Hello WORLD');
  });

  it('should emit and handle custom events', () => {
    let eventCalled = false;
    server.on('testEvent', (arg) => {
      eventCalled = true;
      expect(arg).toBe(123);
    });

    server.emit('testEvent', 123);
    expect(eventCalled).toBe(true);
  });

  it('should return 404 if no middleware', async () => {
    server.middlewares = [];

    const response = await httpRequest({
      hostname: 'localhost',
      port,
      path: '/',
      method: 'GET',
    });
    expect(response.status).toBe(404);
    expect(response.data).toBe('');
  });
});
