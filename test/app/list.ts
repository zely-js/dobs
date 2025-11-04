import { defineRoutes } from 'dobs';

export default defineRoutes({
  GET(req, res) {
    res.send([1, 2, 3, 4, 5]);
  },
});
