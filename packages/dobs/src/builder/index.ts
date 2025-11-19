import { unlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { build, BuildOptions } from 'rolldown';
import chalk from 'chalk';
import { compileModule } from 'module-loader-ts';

import nodeExternal from '~/dobs/server/plugins/rolldown/external';
import { buildFiles, createRoutes, findFile } from '~/dobs/server/router';
import { ResolvedServerConfig } from '~/dobs/config';

export async function buildServer(config: ResolvedServerConfig) {
  const routesDirectory = join(config.cwd, 'app');
  const tempDirectory = join(config.cwd, config.temp, 'routes');

  const tempFile = join(tempDirectory, '_temp.js');
  const outputFile = join(config.cwd, config.build.directory, 'index.js');
  const outputFilePackageJSON = join(config.cwd, config.build.directory, 'package.json');

  const routes = createRoutes(config);
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

  const output = await build(buildOption());
  const builtMap = buildFiles(output, tempDirectory);

  const rawRoutes = [];
  const rawFiles = [];

  for (const route of routes) {
    const foundFile = findFile(join(routesDirectory, route.relativePath), builtMap);
    const str = JSON.stringify(foundFile).replace(/\\/g, '/');
    rawFiles.push(str.slice(1, -1));
    rawRoutes.push(`${JSON.stringify(route.relativePath)}: require(${str})`);
  }

  const [, configFileTemp] = await compileModule('dobs.config', {
    extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'],
  });
  const [, serverEntryTemp] = await compileModule(config.serverEntry, {
    extensions: ['', '.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'],
  });
  const formattedConfigFile = JSON.stringify(configFileTemp).replace(/\\/g, '/');
  const formattedServerEntry = JSON.stringify(serverEntryTemp).replace(/\\/g, '/');

  writeFileSync(
    join(tempDirectory, '_temp.js'),
    `
const _dobs = require("dobs");
const _internal = require("dobs/_build");
const _dobs_http = _internal.createHTTPServer;

const _config = _dobs.resolveConfig(${configFileTemp ? `require(${formattedConfigFile})` : '{}'} ?? {});
const _server_entry = (${serverEntryTemp ? `require(${formattedServerEntry})` : '(() => {})'} ?? (() => {}));
const _middlewares = _config?.middlewares;

const _app = _dobs_http();

(async function() {
  _server_entry(_app);

  _app.use(...[..._middlewares, await _internal._buildInternalMiddleware({${rawRoutes.join(',\n')}}, _config)]);

  _app.listen(process.env.PORT ?? _config.port, () => {console.log("server is running on " + (process.env.PORT ?? _config.port))});
})();
`,
  );

  await build({
    input: tempFile,
    output: {
      format: 'cjs',
      file: outputFile,
      minify: true,
    },
    plugins: [
      nodeExternal({
        allow: [
          formattedConfigFile.slice(1, -1),
          formattedServerEntry.slice(1, -1),
          ...rawFiles,
        ],
      }),
    ],
  });

  writeFileSync(outputFilePackageJSON, JSON.stringify({ type: 'commonjs' }));
  if (configFileTemp) unlinkSync(configFileTemp);

  console.log(
    `${chalk.green('compiled')} compiled successfully. - ${chalk.underline(outputFile)} ${chalk.dim('[minified]')}`,
  );

  return outputFile;
}
