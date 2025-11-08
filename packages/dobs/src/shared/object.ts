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
