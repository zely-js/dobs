import { defineRoutes } from 'dobs';

export default defineRoutes({
  $GET(req, res) {
    setTimeout(() => {
      res.send('Dynamic Handler~!');
    }, 1000);
  },
  POST: { message: 'This is static data' },
});
