# dobs

Fast Backend Framework

## Features

- **🔥 Fully TypeScript support**
- **🚀 Automatic server reload**
- **🎯 File-based routing**

## Getting Started

You can create a project using the `dobs` CLI tool:

```bash
npm create dobs
```

Available templates:

- TypeScript _(recommended)_
- JavaScript

## Routes

Dobs uses a simple and intuitive file-based routing system.
All route files must be placed inside the `/app/` directory.
Each file automatically becomes a route based on its path.

For example:

```
project/
 └─ app/
     ├─ index.ts       →  /
     ├─ user.ts        →  /user
     └─ post/
         └─ [id].ts    →  /post/:id
```

### Example

```ts
import { defineRoutes } from 'dobs';

export default defineRoutes((req, res) => {
  res.send('Hello from Dobs!');
});
```

This route responds with `"Hello from Dobs!"` for all HTTP methods.

If you want to handle methods separately:

```ts
import { defineRoutes } from 'dobs';

export default defineRoutes({
  GET(req, res) {
    res.send({ message: 'This is GET' });
  },
  POST(req, res) {
    res.send({ message: 'This is POST' });
  },
});
```

## LICENSE

MIT
