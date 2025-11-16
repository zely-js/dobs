export type LooseObject<KnownKeys extends string, ValueType> = Partial<
  Record<KnownKeys, ValueType>
> &
  Record<string, ValueType>;

export type LooseKey<K extends string> = K | (string & {});

export type Promisable<T> = T | Promise<T>;
export type Maybe<T> = T | null | undefined | void;
