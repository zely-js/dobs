import { statSync } from 'node:fs';
import { join } from 'node:path';
import { Plugin } from '~/dobs/plugin';

function _dynamic(prefix: string, directory: string): Plugin {
  return {
    name: 'dobs/experimental/public-plugin:dynamic',
    server(server) {
      server.use((req, res, next) => {
        if (!req.pathname.startsWith(prefix)) {
          return next();
        }

        const filePath = join(directory, req.pathname.slice(prefix.length));

        try {
          const stat = statSync(filePath);

          if (!stat.isDirectory()) {
            return res.sendFile(filePath);
          }

          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (e) {
          // res.status(404).send('File not found');
        }

        next();
      });
    },
  };
}
export function publicPlugin(prefix: string, directory: string): Plugin {
  return _dynamic(prefix, directory);
}
