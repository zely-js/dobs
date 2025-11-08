import { createDobsServer } from 'dobs';
import { sharedTests } from './sharedTest';

// ## create server ##

beforeAll(async () => {
  await createDobsServer({ cwd: __dirname, port: 5555 });
});

sharedTests(5555);
