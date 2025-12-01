import type { Plugin } from 'dobs';

function leftPad(str: string | number, len: number, char = ' ') {
  str = String(str);
  if (str.length >= len) return str;
  return char.repeat(len - str.length) + str;
}
function rightPad(str: string | number, len: number, char = ' ') {
  str = String(str);
  if (str.length >= len) return str;
  return str + char.repeat(len - str.length);
}

const gray = (t: string) => `\x1b[90m${t}\x1b[0m`;
const green = (t: string) => `\x1b[32m${t}\x1b[0m`;
const cyan = (t: string) => `\x1b[36m${t}\x1b[0m`;
const yellow = (t: string) => `\x1b[33m${t}\x1b[0m`;
const red = (t: string) => `\x1b[31m${t}\x1b[0m`;

export function logger(): Plugin {
  return {
    name: '@dobsjs/logger',

    server(server) {
      server.use((req, res, next) => {
        const start = performance.now();

        res.on('finish', () => {
          const ms = (performance.now() - start).toFixed(2);
          const status = res.statusCode;
          const method = req.method;
          const url = req.url;

          const time = new Date().toISOString();

          const statusColor =
            status >= 500
              ? red
              : status >= 400
                ? yellow
                : status >= 300
                  ? cyan
                  : status >= 200
                    ? green
                    : (t: string) => t;

          const methodColor =
            method === 'GET'
              ? cyan
              : method === 'POST'
                ? green
                : method === 'PUT'
                  ? yellow
                  : method === 'PATCH'
                    ? yellow
                    : method === 'DELETE'
                      ? red
                      : gray;

          const METHOD_W = 6;
          const URL_W = 24;

          const paddedMethod = leftPad(method, METHOD_W);
          const paddedStatus = leftPad(status, 3);
          const paddedUrl = rightPad(url, URL_W);
          const paddedTime = leftPad(ms + 'ms', 8);

          console.log(
            `${gray(time)} ` +
              `${methodColor(paddedMethod)} ` +
              `${gray(paddedUrl)} ` +
              `${statusColor(paddedStatus)} ` +
              `${gray(paddedTime)}`,
          );
        });

        next();
      });
    },
  };
}
