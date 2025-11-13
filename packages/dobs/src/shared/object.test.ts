import { describe, it, expect } from 'vitest';
import { lowercaseKeyObject, mutateObjectKeys, mutateObjectValues } from './object';

describe('lowercaseKeyObject', () => {
  it('should lowercase keys of object', () => {
    expect(lowercaseKeyObject({ A: 0, B: 1, c: 2 })).toStrictEqual({ a: 0, b: 1, c: 2 });
  });
});

describe('mutateObjectValues', () => {
  it('should mutate values of object', () => {
    expect(mutateObjectValues({ a: 5, b: 10 }, (v) => v * 2)).toStrictEqual({
      a: 10,
      b: 20,
    });
  });
});

describe('mutateObjectKeys', () => {
  it('should mutate keys of object', () => {
    expect(mutateObjectKeys({ a: 5, b: 10 }, (k) => k + '0')).toStrictEqual({
      a0: 5,
      b0: 10,
    });
  });
});
