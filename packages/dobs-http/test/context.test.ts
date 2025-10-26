import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createRequest, createResponse } from '../src/context';
import http from 'node:http';
import { writeFileSync, unlinkSync } from 'node:fs';
import path from 'node:path';

describe('Request/Response', () => {
  let server: http.Server;
  const port = 3002;

  beforeAll(() => {
    server = http.createServer((req, res) => {
      const request = createRequest(req);
      const response = createResponse(res);

      // test routing
      if (request.url === '/json') {
        response.json({ hello: 'world' });
      } else if (request.url === '/text') {
        response.text('hello text');
      } else if (request.url === '/html') {
        response.html('<h1>hi</h1>');
      } else if (request.url === '/redirect') {
        response.redirect('https://example.com');
      } else if (request.url === '/status') {
        response.status(201).message('Created').send('ok');
      } else if (request.url === '/file') {
        const filePath = path.join(__dirname, 'test.txt');
        writeFileSync(filePath, 'file content');
        response.sendFile(filePath);
      } else {
        response.send('default');
      }
    });

    server.listen(port);
  });

  afterAll(() => {
    server.close();
  });

  function request(path: string, body?: string) {
    return new Promise<{
      status: number;
      data: string;
      headers: http.IncomingHttpHeaders;
    }>((resolve, reject) => {
      const req = http.request(
        { hostname: 'localhost', port, path, method: body ? 'POST' : 'GET' },
        (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk.toString()));
          res.on('end', () =>
            resolve({ status: res.statusCode || 0, data, headers: res.headers }),
          );
        },
      );
      req.on('error', reject);
      if (body) req.write(body);
      req.end();
    });
  }

  it('Request should parse URL and query correctly', async () => {
    const { data } = await request('/?foo=bar&baz=qux');
    expect(data).toBe('default');
  });

  it('Response should send JSON correctly', async () => {
    const { data, headers } = await request('/json');
    expect(data).toBe(JSON.stringify({ hello: 'world' }));
    expect(headers['content-type']).toMatch(/application\/json/);
  });

  it('Response should send text correctly', async () => {
    const { data, headers } = await request('/text');
    expect(data).toBe('hello text');
    expect(headers['content-type']).toMatch(/text\/plain/);
  });

  it('Response should send HTML correctly', async () => {
    const { data, headers } = await request('/html');
    expect(data).toBe('<h1>hi</h1>');
    expect(headers['content-type']).toMatch(/text\/html/);
  });

  it('Response should redirect correctly', async () => {
    const { status, headers } = await request('/redirect');
    expect(status).toBe(302);
    expect(headers.location).toBe('https://example.com/');
  });

  it('Response should set status and message', async () => {
    const { status, data } = await request('/status');
    expect(status).toBe(201);
    expect(data).toBe('ok');
  });

  it('Response should send file', async () => {
    const filePath = path.join(__dirname, 'test.txt');
    const { data } = await request('/file');
    expect(data).toBe('file content');
    unlinkSync(filePath); // cleanup
  });
});
