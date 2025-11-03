# @dobsjs/http

http base server

```ts
import server from '@dobsjs/http';

const app = server();

app.use((req, res, next) => {
  // ...
  next();
});

app.listen(8080);
```
