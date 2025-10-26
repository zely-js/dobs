import { extname } from 'node:path';

export function convertPathToRegex(path: string) {
  const params: string[] = [];
  let processedPath = path;
  const ext = extname(processedPath);
  if (ext) {
    processedPath = processedPath.slice(0, -ext.length);
  }
  if (processedPath.endsWith('index')) {
    processedPath = processedPath.slice(0, -5);
  }

  const parts = processedPath.split('/').filter((part) => part !== '');

  const regexParts = parts.map((part) => {
    if (part.startsWith('[...') && part.endsWith(']')) {
      const paramName = part.slice(1, -1);
      params.push(paramName);
      return '(.*)';
    }
    if (part.startsWith('[') && part.endsWith(']')) {
      const paramName = part.slice(1, -1);
      params.push(paramName);
      return '([^/]+)';
    }

    return part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  });

  const regexString = `^/${regexParts.join('/')}/?$`;
  const regex = new RegExp(regexString);
  return { regex, params };
}

interface RouteResult {
  regex: RegExp;
  params: string[];
}

export function matchUrlToRoute(
  url: string,
  routeResult: RouteResult,
): { [key: string]: string | string[] } | null {
  const { regex, params } = routeResult;
  const match = regex.exec(url);

  if (!match) {
    return null;
  }

  const result: { [key: string]: string | string[] } = {};

  for (let i = 0; i < params.length; i++) {
    const paramName = params[i];
    const capturedValue = match[i + 1];

    const value = capturedValue || '';

    if (paramName.startsWith('...')) {
      result[paramName.slice(3)] = value.split('/').filter(Boolean);
    } else {
      result[paramName] = value;
    }
  }

  return result;
}
