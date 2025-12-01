import { websocket } from '@dobsjs/websocket';
import { logger } from '@dobsjs/logger';

import { cachePlugin } from 'dobs/experimental';

export default {
  port: 3001,
  devtool: true,
  plugins: [
    logger(),
    cachePlugin({ ttl: 1000 }),
    websocket({
      open() {
        console.log('[ws] connected');
      },
      message(ws, message) {
        console.log('[ws] message ' + message.toString());
      },
    }),
  ],
} satisfies import('dobs').ServerConfig;
