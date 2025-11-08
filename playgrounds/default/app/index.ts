import { defineRoutes } from 'dobs';
import { useCache } from 'dobs/experimental';

export default defineRoutes(
  {
    GET(req, res) {
      setTimeout(() => {
        res.send('Dynamic Handler~!');
      }, 1000);
    },
    POST: { message: 'This is static data' },
  },
  [useCache({ ttl: 1000 })],
);
