# @dobs/http

http base server

```ts
import server from '@dobs/http';

const app = server();

app.use((req, res, next) => {
  // ...
  next();
});

app.listen(8080);
```
