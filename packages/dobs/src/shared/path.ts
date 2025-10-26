import { join, normalize, parse, resolve } from 'node:path';

/** changeExtension("/a/b/c.ts", ".tsx") */
export function changeExtension(filename: string, to: string) {
  const { dir, name } = parse(filename);

  return join(dir, name + to).replace(/\\/g, '/');
}

export function isSamePath(
  pathA: string,
  pathB: string,
  cwd: string = process.cwd(),
): boolean {
  const normalizedA = normalize(resolve(cwd, pathA));
  const normalizedB = normalize(resolve(cwd, pathB));

  if (process.platform === 'win32') {
    return normalizedA.toLowerCase() === normalizedB.toLowerCase();
  }
  return normalizedA === normalizedB;
}
