# @dobsjs/logger

Simplest Logger Plugin for [dobs](https://dobs.vercel.app)

## Usage

```ts
import { logger } from '@dobsjs/logger';
import { defineConfig } from 'dobs';

export default defineConfig({
  plugins: [logger()],
});
```

```
2025-12-01T21:11:31.992Z GET / 200 1.92ms
2025-12-01T21:11:33.483Z GET /api/users 200 13.52ms
2025-12-01T21:11:35.224Z POST /api/login 401 42.16ms
2025-12-01T21:11:38.911Z GET /favicon.ico 304 0.91ms
2025-12-01T21:11:40.114Z GET /api/admin 403 3.00ms
2025-12-01T21:11:43.902Z POST /api/items 201 27.71ms
```
