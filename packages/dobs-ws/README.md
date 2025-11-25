# @dobsjs/websocket

Simplest WebSocket Plugin for [dobs](https://dobs.vercel.app)

## Usage

```ts
import { websocket } from '@dobsjs/websocket';
import { defineConfig } from 'dobs';

export default defineConfig({
  plugins: [
    websocket({
      open(ws) {
        console.log('[ws] connected');
      },
      message(ws, message) {
        console.log('[ws] message ' + message.toString());
      },
    }),
  ],
});
```
