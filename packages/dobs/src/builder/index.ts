import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { build, BuildOptions } from 'rolldown';
import { compileModule } from 'module-loader-ts';

import nodeExternal from '~/dobs/server/plugins/external';
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

  for (const route of routes) {
    const foundFile = findFile(join(routesDirectory, route.relativePath), builtMap);
    rawRoutes.push(
      `${JSON.stringify(route.relativePath)}: require(${JSON.stringify(foundFile).replace(/\\/g, '/')})`,
    );
  }

  const [, configFileTemp] = await compileModule('dobs.config', {
    extensions: ['.js', '.mjs', '.cjs', '.ts', '.mts', '.cts'],
  });
  const formattedConfigFile = JSON.stringify(configFileTemp).replace(/\\/g, '/');

  writeFileSync(
    join(tempDirectory, '_temp.js'),
    `
const _dobs = require("dobs");
const _internal = require("dobs/_build");
const _dobs_http = _internal.createHTTPServer;

const _config = _dobs.resolveConfig(${configFileTemp ? `require(${formattedConfigFile})` : '{}'} ?? {});
const _middlewares = _config?.middlewares;

const _app = _dobs_http();

_app.use(...[..._middlewares, _internal._buildInternalMiddleware({${rawRoutes.join(',\n')}}, _config)]);

_app.listen(process.env.PORT ?? _config.port, () => {console.log("server is running on " + process.env.PORT ?? _config.port)});
`,
  );

  await build({
    input: tempFile,
    output: {
      format: 'cjs',
      file: outputFile,
    },
    plugins: [nodeExternal({ allow: [formattedConfigFile.slice(1, -1)] })],
  });

  writeFileSync(outputFilePackageJSON, JSON.stringify({ type: 'commonjs' }));

  return outputFile;
}
