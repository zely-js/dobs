/* eslint-disable @typescript-eslint/ban-ts-comment */

import { buildServer, resolveConfig } from 'dobs';
import { join } from 'node:path';
import { sharedTests } from './sharedTest';

// ## build server ##

beforeAll(async () => {
  await buildServer(resolveConfig({ port: 8888, cwd: __dirname }));

  // @ts-expect-error
  process.env.PORT = 8888;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  require(join(__dirname, 'dist', 'index.js').replace(/\\/g, '/'));
});

// ## test ##
sharedTests(8888);
