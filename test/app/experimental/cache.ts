import { defineRoutes } from 'dobs';
import { useCache } from 'dobs/experimental';

export default defineRoutes(
  (req, res) => {
    setInterval(() => {
      res.send('hello');
    }, 100);
  },
  [useCache({ ttl: 500 })],
);
