import { defineRouter } from 'dobs';
import { useCache } from 'dobs/experimental';

export default defineRouter(
  (req, res) => {
    setInterval(() => {
      res.send('hello');
    }, 100);
  },
  [useCache({ ttl: 500 })],
);
