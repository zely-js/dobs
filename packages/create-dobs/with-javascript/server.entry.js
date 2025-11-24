// You can directly access the server instance.
// https://dobs.vercel.app/docs/entry

module.exports = (server) => {
  server.use((req, res, next) => {
    next();
  });
};
