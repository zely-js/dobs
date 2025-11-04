import { defineRoutes } from 'dobs';

export default defineRoutes({
  GET(req, res) {
    res.send(`${req.params.id}`);
  },
});
