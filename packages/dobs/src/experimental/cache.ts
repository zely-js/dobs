import { Routes, Handler } from '../types';
import { mutateObjectKeys, mutateObjectValues } from '../shared/object';
import { Plugin } from '../plugin';

export interface CacheOptions {
  /**
   * Time to live (default: 2 * 60 * 1000 ms = 2m)
   */
  ttl?: number;

  customCache?: typeof TtlCache;
}

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

export class TtlCache<K = string, V = any> {
  private cache: Map<K, CacheEntry<V>> = new Map();
  private readonly defaultTtl: number;

  constructor(defaultTtl: number = 2 * 6 * 1000) {
    if (defaultTtl <= 0) {
      throw new Error('ttl must be more than 0.');
    }
    this.defaultTtl = defaultTtl;
  }

  public set(key: K, value: V, ttl?: number): void {
    const timeToLive = ttl ?? this.defaultTtl;
    const expiry = Date.now() + timeToLive;
    this.cache.set(key, { value, expiry });
  }

  public get(key: K): V | undefined {
    const entry = this.cache.get(key);

    if (!entry) {
      return undefined;
    }

    if (entry.expiry < Date.now()) {
      this.cache.delete(key);
      return undefined;
    }

    return entry.value;
  }

  public has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  public delete(key: K): boolean {
    return this.cache.delete(key);
  }

  public clear(): void {
    this.cache.clear();
  }

  public get size(): number {
    return this.cache.size;
  }
}

function normalizePath(path: string) {
  if (!path) return '/';
  if (!path.startsWith('/')) path = '/' + path;
  if (!path.endsWith('/')) path += '/';
  return path;
}

function createWrapper(
  handler: Handler,
  cache: TtlCache<string, any>,
  method?: string,
): Handler {
  return (req, res) => {
    const customResponse = { ...res };
    const defaultSend = res.send;

    const id =
      normalizePath(req.URL.pathname) + '-' + (method ?? req.method.toUpperCase());

    // has cached data
    if (cache.has(id)) {
      return defaultSend(cache.get(id));
    }

    customResponse.send = (data) => {
      cache.set(id, data);
      return defaultSend(data);
    };

    return handler(req, customResponse as any);
  };
}

/**
 * cache wrapper

 *
 * @example
 * ```ts
 * import { defineRoutes } from "dobs";
 * import { useCache } from "dobs/experimental";
 *
 * export default defineRoutes((req, res) => {}, [useCache()])
 * ``` 
 * 
 * The values included in the ID generation are as follows: handler ID (GET, ALL, etc.) and pathname.
 * Values not included are: query, req.body, etc. 
 */
export function useCache(cacheOptions?: CacheOptions) {
  const cache = new (cacheOptions?.customCache ?? TtlCache)(cacheOptions?.ttl);

  // return wrapper

  return (router: Routes): Routes => {
    const routerType = typeof router === 'function' ? 'function' : 'object';

    if (routerType === 'function') {
      return createWrapper(router as any, cache, 'all');
    }

    return mutateObjectValues<string, Handler>(router as any, (value, key) =>
      createWrapper(value, cache, key),
    );
  };
}

// internal cache plugin
// concept: $ALL => ALL (caching enabled)

/**
 * Plugin that enables data caching
 */
export function cachePlugin(cacheOptions?: CacheOptions): Plugin {
  const cache = new (cacheOptions?.customCache ?? TtlCache)(cacheOptions?.ttl);

  return {
    name: 'dobs/experimental/cache-plugin',

    generateRoute(router) {
      const routerType = typeof router === 'function' ? 'function' : 'object';

      if (routerType === 'function') {
        return router;
      }

      const wrappedRouter = mutateObjectValues<string, Handler>(
        router as any,
        (value, key) => {
          if (key.startsWith('$')) {
            return createWrapper(value, cache, key);
          }
          return value;
        },
      );

      return mutateObjectKeys(wrappedRouter, (key) => {
        if (key.startsWith('$')) return key.slice(1);
        return key;
      });
    },
  };
}
