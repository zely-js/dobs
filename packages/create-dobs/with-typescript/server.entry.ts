import type { ServerEntry } from 'dobs';

// You can directly access the server instance.
// https://dobs.vercel.app/docs/entry

export default ((server) => {
  server.use((req, res, next) => {
    next();
  });
}) satisfies ServerEntry;
