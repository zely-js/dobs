import { describe, it, expect } from 'vitest';
import { changeExtension, isSamePath } from './path';
import { join } from 'node:path';

describe('changeExtension', () => {
  it('should change extension', () => {
    expect(changeExtension('/a/b/c.ts', '.tsx')).toBe('/a/b/c.tsx');
    expect(changeExtension('/a/b/c.test.ts', '.tsx')).toBe('/a/b/c.test.tsx');
    expect(changeExtension('/a/.b/c.test.ts', '.tsx')).toBe('/a/.b/c.test.tsx');
    expect(changeExtension('/a/.b/.c.test.ts', '.tsx')).toBe('/a/.b/.c.test.tsx');
  });
});

describe('isSamePath', () => {
  it('should check if paths are the same', () => {
    expect(isSamePath(join(process.cwd(), 'package.json'), 'package.json'));
    expect(
      isSamePath(
        join(process.cwd(), 'package.json').replace(/\\/g, '/'),
        '/package.json\\',
      ),
    );
  });
});
