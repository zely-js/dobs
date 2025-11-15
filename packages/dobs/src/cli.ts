#!/usr/bin/env node
import { join } from 'node:path';

import animaux from 'animaux';
import { load } from 'module-loader-ts';
import chalk from 'chalk';

import { createDobsServer } from '~/dobs/server';

import { resolveConfig, ServerConfig } from './config';
import { buildServer } from './builder';
import { version } from '../package.json';

const app = animaux({ name: 'dobs', version: version });

app
  .command('dev')
  .option('--config, -c', 'Provide config file path')
  .option('--port, -p', 'Provide server port')
  .option('--cwd', 'Provide cwd', process.cwd())
  .action(async ({ options }) => {
    const startTime = performance.now();
    let config: ServerConfig = {};

    const cwd = options.cwd ?? process.cwd();

    if (options.config) {
      config = await load(options.config);
    } else {
      config = await load(join(cwd, './dobs.config'), {
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

app
  .command('build')
  .option('--config, -c', 'Provide config file path')
  .option('--cwd', 'Provide cwd', process.cwd())
  .action(async ({ options }) => {
    const startTime = performance.now();
    let config: ServerConfig = {};

    const cwd = options.cwd ?? process.cwd();

    if (options.config) {
      config = await load(options.config);
    } else {
      config = await load(join(cwd, './dobs.config'), {
        extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'],
      });
    }
    await buildServer(resolveConfig(config));

    console.log(`Done in ${(performance.now() - startTime).toFixed(2)}ms`);
  });

app.parse(process.argv.slice(2));
