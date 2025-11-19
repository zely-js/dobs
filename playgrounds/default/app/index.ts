import { defineRouter } from 'dobs';

export default defineRouter({
  $GET(req, res) {
    setTimeout(() => {
      res.send('Dynamic Handler~!');
    }, 1000);
  },
  POST: { message: 'This is static data' },
});
