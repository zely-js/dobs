import { defineRouter } from 'dobs';

export default defineRouter({
  GET(req, res) {
    res.send(`${req.params.id}`);
  },
});
