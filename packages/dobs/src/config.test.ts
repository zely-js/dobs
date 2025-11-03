import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG, resolveConfig } from './config';

describe('resolve config', () => {
  it('should resolve the config', () => {
    expect(resolveConfig({})).toStrictEqual(DEFAULT_CONFIG);
  });
});
