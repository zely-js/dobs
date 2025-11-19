import { defineRouter } from 'dobs';

export default defineRouter({
  GET(req, res) {
    res.send('Dynamic Handler');
  },
  POST: { message: 'This is static data' },
});
