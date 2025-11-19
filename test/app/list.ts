import { defineRouter } from 'dobs';

export default defineRouter({
  GET(req, res) {
    res.send([1, 2, 3, 4, 5]);
  },
});
