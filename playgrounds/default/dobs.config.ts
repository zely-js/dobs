import { websocket } from '@dobsjs/websocket';

import { cachePlugin } from 'dobs/experimental';

export default {
  port: 3000,
  plugins: [
    cachePlugin({ ttl: 1000 }),
    websocket({
      open(ws) {
        console.log('[ws] connected');
      },
      message(ws, message) {
        console.log('[ws] message ' + message.toString());
      },
    }),
  ],
} satisfies import('dobs').ServerConfig;
