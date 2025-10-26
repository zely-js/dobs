import { describe, it, expect } from 'vitest';
import { convertPathToRegex, matchUrlToRoute } from './urlPath';

describe('convertPathToRegex', () => {
  it('should match static route', () => {
    const { regex, params } = convertPathToRegex('/about');
    expect(regex.test('/about')).toBe(true);
    expect(regex.test('/about/')).toBe(true);
    expect(regex.test('/about/me')).toBe(false);
    expect(params).toEqual([]);
  });

  it('should match dynamic route', () => {
    const { regex, params } = convertPathToRegex('/users/[id]');
    expect(regex.test('/users/123')).toBe(true);
    expect(regex.test('/users/')).toBe(false);
    expect(regex.test('/users')).toBe(false);
    expect(params).toEqual(['id']);
  });

  it('should match catch-all route', () => {
    // note: .ts 확장자를 붙이지 않으면 .path]가 확장자로 인식되서 짤리는 현상이 발생
    //       이건 어쩔 수 없음
    const { regex, params } = convertPathToRegex('/files/[...path].ts');
    expect(regex.test('/files')).toBe(false);
    expect(regex.test('/files/a')).toBe(true);
    expect(regex.test('/files/a/b/c')).toBe(true);
    expect(params).toEqual(['...path']);
  });

  it('should remove extensions like .ts or .js', () => {
    const { regex, params } = convertPathToRegex('/users/[id].ts');
    expect(regex.test('/users/42')).toBe(true);
    expect(regex.test('/users')).toBe(false);
    expect(params).toEqual(['id']);
  });

  it('should remove trailing /index', () => {
    const { regex, params } = convertPathToRegex('/blog/index');
    expect(regex.test('/blog')).toBe(true);
    expect(regex.test('/blog/')).toBe(true);
    expect(params).toEqual([]);
  });
});

describe('matchUrlToRoute', () => {
  it('should match static route', () => {
    const route = convertPathToRegex('/about');
    const match = matchUrlToRoute('/about', route);
    expect(match).toEqual({});
  });

  it('should extract dynamic param', () => {
    const route = convertPathToRegex('/users/[id]');
    const match = matchUrlToRoute('/users/123', route);
    expect(match).toEqual({ id: '123' });
  });

  it('should extract multiple segments from catch-all param', () => {
    const route = convertPathToRegex('/files/[...path].ts');
    const match = matchUrlToRoute('/files/a/b/c', route);
    expect(match).toEqual({ path: ['a', 'b', 'c'] });
  });

  it('should return null for unmatched route', () => {
    const route = convertPathToRegex('/users/[id]');
    const match = matchUrlToRoute('/posts/1', route);
    expect(match).toBeNull();
  });

  it('should match root index', () => {
    const route = convertPathToRegex('/index');
    const match = matchUrlToRoute('/', route);
    expect(match).toEqual({});
  });
});
