import { cachePlugin } from 'dobs/experimental';

export default {
  port: 3000,
  plugins: [cachePlugin({ ttl: 1000 })],
} satisfies import('dobs').ServerConfig;
