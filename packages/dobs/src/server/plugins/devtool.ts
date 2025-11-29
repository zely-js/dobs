import { readFileSync } from 'node:fs';
import type { ResolvedServerConfig, Plugin } from 'dobs';

export function devtool(): Plugin {
  let config: ResolvedServerConfig;
  return {
    name: 'dobs/devtool',

    resolvedConfig(_config) {
      config = _config;
    },

    server(server) {
      server.use(async (req, res, next) => {
        if (!req.URL.pathname.startsWith('/_dev_')) return next();

        try {
          const path = await import('@dobsjs/dev');
          const rawHTML = readFileSync(path.path).toString();

          const replaced = rawHTML.replace(
            /<script type="application\/json" id="_config">\s*([\s\S]*?)\s*<\/script>/,
            () => {
              const newJSON = JSON.stringify({ port: config.port }, null, 2);
              return `<script type="application/json" id="_config">\n${newJSON}\n</script>`;
            },
          );

          res.html(replaced);
        } catch (e) {
          console.error(e);
          throw new Error(
            'You have to install @dobsjs/dev to enable devtool plugin.\nnpm i --save-dev @dobsjs/dev',
          );
        }
      });
    },
  };
}
