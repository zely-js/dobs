#!/usr/bin/env node

import animaux from 'animaux';
import { load } from 'module-loader-ts';

import { createDobsServer } from '~/dobs/server';

import { version } from '../package.json';
import { ServerConfig } from './config';

const app = animaux({ name: 'dobs', version: version });

app
  .command('dev')
  .option('--config, -c', 'Provide config file path')
  .option('--port, -p', 'Provide server port')
  .option('--cwd', 'Provide cwd', process.cwd())
  .action(async ({ options }) => {
    const config: ServerConfig =
      (await load('dobs.config', {
        extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'],
      })) ?? {};

    console.log(config);
    if (options.port) config.port = options.port;
    if (options.cwd) config.cwd = options.cwd;

    const server = await createDobsServer(config);

    server.on('listening', () => {
      const port = options.port ?? config.port ?? 8080;
      console.log(`server is running on http://localhost:${port}`);
    });
  });

app.parse(process.argv.slice(2));
