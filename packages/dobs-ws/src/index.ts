import WebSocket, { WebSocketServer } from 'ws';
import type { Plugin } from 'dobs';
import type { Promisable } from '~/dobs/_types';

export interface WebSocketOptions {
  open?(ws: WebSocket): Promisable<void>;
  message?(ws: WebSocket, data: WebSocket.RawData): Promisable<void>;
  error?(err: Error): Promisable<void>;
}

export function websocket(websocketOptions: WebSocketOptions): Plugin {
  return {
    name: '@dobsjs/websocket',

    server(server) {
      const wss = new WebSocketServer({ server: server.server });

      wss.on('connection', async (ws) => {
        if (websocketOptions?.open) await websocketOptions.open(ws);

        ws.on('message', async (data) => {
          if (websocketOptions?.message) await websocketOptions.message(ws, data);
        });

        ws.on('error', async (err) => {
          if (websocketOptions?.error) await websocketOptions.error(err);
        });
      });
    },
  };
}
