import { join, relative } from 'node:path';

import type { AppRequest, AppResponse, Middleware } from '@dobsjs/http';
import { build, BuildOptions, RolldownOutput } from 'rolldown';
import chokidar from 'chokidar';
import chalk from 'chalk';

import type { ResolvedServerConfig } from '~/dobs/config';
import { scanDirectory } from '~/dobs/shared/fs';
import { convertPathToRegex, matchUrlToRoute } from '~/dobs/shared/urlPath';
import { isSamePath } from '~/dobs/shared/path';
import { lowercaseKeyObject } from '~/dobs/shared/object';

import { dynamicImport } from './load';
import nodeExternal from './plugins/external';
import { writeFileSync } from 'node:fs';

type HandlerType = ((req: AppRequest, res: AppResponse) => any) | Record<string, any>;

interface PageTypeObject {
  [method: string]: HandlerType;
}

type PageType = PageTypeObject | HandlerType;

function routeScore(route: { params: string[]; regex: RegExp }) {
  let score = 0;

  for (const param of route.params) {
    if (param.startsWith('...')) score += 999;
    else score += 1;
  }

  return score;
}

/**
 * Create routes by filename and sort it by params length
 */
function createRoutes(config: ResolvedServerConfig) {
  const routesDirectory = join(config.cwd, 'app');
  const files = scanDirectory(routesDirectory);
  const relativeFiles = files.map((file) => relative(routesDirectory, file));
  const rawRoutes = relativeFiles.map((file) => {
    file = file.replace(/\\/g, '/');

    // remove ./, /
    if (file.startsWith('.')) file = file.slice(1);
    if (file.startsWith('/')) file = file.slice(1);

    return { ...convertPathToRegex(file), relativePath: file };
  });

  return rawRoutes.sort((a, b) => routeScore(a) - routeScore(b));
}

function buildFiles(output: RolldownOutput, tempDirectory: string) {
  const fileMap = new Map<string, string>();

  for (const chunk of output.output) {
    if (chunk.type === 'chunk') {
      const filePath = join(tempDirectory, chunk.fileName);
      writeFileSync(filePath, chunk.code, 'utf8');
      for (const inputPath of Object.keys(chunk.modules)) {
        fileMap.set(inputPath, filePath);
      }
    } else if (chunk.type === 'asset' && typeof chunk.source === 'string') {
      const filePath = join(tempDirectory, chunk.fileName);
      writeFileSync(filePath, chunk.source, 'utf8');
    }
  }

  return fileMap;
}

function findFile(file: string, map: Map<string, string>) {
  for (const [key, value] of map) {
    if (isSamePath(key, file)) return value;
  }
  return null;
}

export async function createRouterMiddleware(
  config: ResolvedServerConfig,
): Promise<Middleware> {
  const routesDirectory = join(config.cwd, 'app');
  const tempDirectory = join(config.cwd, config.temp, 'routes');
  const cachedModule = new Map<string, any>();
  const matchRoute = (url: string) => routes.find((route) => route.regex.test(url));
  const buildOption: () => BuildOptions = () => ({
    input: routes.map((route) => join(routesDirectory, route.relativePath)),
    output: {
      format: 'cjs',
      sourcemap: true,
      esModule: true,
      dir: tempDirectory,
    },
    write: false,
    // exclude /node_modules/
    plugins: [nodeExternal()],
  });
  let routes = createRoutes(config);

  // build initially (prod/dev)
  const output = await build(buildOption());
  let builtMap = buildFiles(output, tempDirectory);

  // development mode / $ dobs dev
  if (process.env.NODE_ENV === 'development') {
    const watcher = chokidar.watch(routesDirectory, {
      ignoreInitial: true,
      cwd: config.cwd,
    });

    watcher.on('all', async (evt, path) => {
      // rebuild server
      routes = createRoutes(config);

      const output = await build(buildOption());
      builtMap = buildFiles(output, tempDirectory);

      // find updated page
      const matchedPage = Array.from(cachedModule.keys()).find((key) =>
        isSamePath(join(routesDirectory, key), path, config.cwd),
      );

      if (matchedPage) cachedModule.delete(matchedPage);

      console.log(
        `${chalk.blue('info')} server updated. ${chalk.gray.dim(`(${path})`.replace(/\\/g, '/'))}`,
      );
    });
  }

  return async (req, res, next) => {
    const url = req.URL.pathname;
    const route = matchRoute(url);

    if (!route) return next(); // 404
    if (!cachedModule.has(route.relativePath)) {
      const foundFile = findFile(join(routesDirectory, route.relativePath), builtMap);

      cachedModule.set(route.relativePath, await dynamicImport(foundFile));
    }

    const pageModule = cachedModule.get(route.relativePath);
    const params = matchUrlToRoute(url, route);

    // set params
    req.params = params;

    try {
      const method = (req.method || '').toLocaleLowerCase();
      const handlers: PageType = pageModule;

      const execute = async (handler: HandlerType) => {
        // static data
        if (typeof handler !== 'function') return res.send(handler);

        // dynamic data
        const response = await handler(req, res);

        if (!res.isWritable() && response) {
          res.send(response);
        }
      };

      if (typeof handlers === 'function') {
        return execute(handlers);
      }

      const handlerObject: Record<string, HandlerType> = lowercaseKeyObject(
        handlers,
      ) as any;

      if (handlerObject.all) execute(handlerObject.all);
      if (handlerObject[method]) execute(handlerObject[method]);
    } catch (e) {
      console.error(e);
    }
  };
}
