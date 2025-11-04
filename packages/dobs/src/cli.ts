#!/usr/bin/env node

import animaux from 'animaux';
import { load } from 'module-loader-ts';

import chalk from 'chalk';

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
    const startTime = performance.now();
    let config: ServerConfig = {};

    if (options.config) {
      config = await load(options.config);
    } else {
      config = await load('dobs.config', {
        extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'],
      });
    }

    // development mode
    process.env.NODE_ENV = 'development';

    // console.log(config);
    if (options.port) config.port = options.port;
    if (options.cwd) config.cwd = options.cwd;

    const server = await createDobsServer(config);

    server.on('listening', () => {
      const port = options.port ?? config.port ?? 8080;
      console.log(
        chalk.white(
          `\n${chalk.dim('$')} Server is running on ${chalk.cyan(chalk.underline(chalk.bold(`http://localhost:${port}`)))}`,
        ) + chalk.dim(` (Ready in ${(performance.now() - startTime).toFixed(2)}ms)\n`),
      );
    });
  });

app.parse(process.argv.slice(2));
