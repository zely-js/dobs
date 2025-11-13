export function lowercaseKeyObject(obj) {
  return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k.toLowerCase(), v]));
}

export function mutateObjectValues<Key = string, Value = any>(
  obj,
  fn: (value: Value, key: Key) => any,
) {
  if (typeof obj !== 'object' || obj === null) return obj;

  const result: any = Array.isArray(obj) ? [] : {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] =
      typeof value === 'object' && value !== null
        ? mutateObjectValues(value as Record<string, any>, fn)
        : fn(value as any, key as any);
  }
  return result;
}

export function mutateObjectKeys<T extends Record<string, any>>(
  obj: T,
  fn: (key: string) => string,
): any {
  if (typeof obj !== 'object' || obj === null) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => mutateObjectKeys(item, fn));
  }

  const result: Record<string, any> = {};

  for (const [key, value] of Object.entries(obj)) {
    const newKey = fn(key);
    result[newKey] =
      typeof value === 'object' && value !== null ? mutateObjectKeys(value, fn) : value;
  }

  return result;
}
