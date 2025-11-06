import { describe, it, expect } from 'vitest';

import { buildServer, resolveConfig } from 'dobs';
import { join } from 'node:path';

// ## build server ##

beforeAll(async () => {
  await buildServer(resolveConfig({ port: 8888, cwd: __dirname }));

  // @ts-ignore
  process.env.PORT = 8888;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require(join(__dirname, 'dist', '_temp.js').replace(/\\/g, '/'));
});

// ## test ##

const fetchPage = (path: string, method: string = 'get') =>
  fetch(`http://localhost:8888${path}`, { method });
const fetchAsJSON = async (path: string, method: string = 'get') =>
  await (await fetchPage(path, method)).json();
const fetchAsText = async (path: string, method: string = 'get') =>
  await (await fetchPage(path, method)).text();

describe('core server', () => {
  it('should pages exist', async () => {
    expect(await fetchPage('/')).not.toBeNull();
    expect(await fetchPage('/list')).not.toBeNull();
    // expect(await fetchPage('/user')).toBeNull(); // error (intended)
    expect(await fetchPage('/user/param')).not.toBeNull();
    expect(await fetchPage('/dynamic/')).not.toBeNull(); // (intended)
    expect(await fetchPage('/dynamic/a')).not.toBeNull();
    expect(await fetchPage('/dynamic/a/b')).not.toBeNull();
  });

  it('should send exact static data', async () => {
    expect(await fetchAsText('/')).toBe('Dynamic Handler');
    expect(await fetchAsJSON('/', 'post')).toStrictEqual({
      message: 'This is static data',
    });

    expect(await fetchAsJSON('/list')).toStrictEqual([1, 2, 3, 4, 5]);
  });

  it('should send exact data with dynamic routes', async () => {
    expect(await fetchAsText('/user/1')).toBe('1');
    expect(await fetchAsText('/user/2')).toBe('2');

    expect(await fetchAsText('/dynamic/')).toBe('');
    expect(await fetchAsText('/dynamic/a')).toBe('a');
    expect(await fetchAsText('/dynamic/a/b')).toBe('a,b');
  });
});
