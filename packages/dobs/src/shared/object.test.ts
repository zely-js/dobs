import { describe, it, expect } from 'vitest';
import { lowercaseKeyObject } from './object';

describe('lowercaseKeyObject', () => {
  it('should lowercase keys of object', () => {
    expect(lowercaseKeyObject({ A: 0, B: 1, c: 2 })).toStrictEqual({ a: 0, b: 1, c: 2 });
  });
});
