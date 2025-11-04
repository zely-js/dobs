import { defineRoutes } from 'dobs';

export default defineRoutes({
  GET(req, res) {
    res.send('Dynamic Handler');
  },
  POST: { message: 'This is static data' },
});
