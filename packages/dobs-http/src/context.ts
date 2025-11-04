import type { IncomingMessage, ServerResponse } from 'node:http';
import { URL } from 'node:url';

import encodeUrl from 'encodeurl';
import { contentType } from 'mime-types';
import { createReadStream, statSync } from 'node:fs';
import { extname } from 'node:path';

interface Request<Params = any> extends IncomingMessage {
  /** URL pathname */
  pathname: string;

  /** URL href */
  href: string;

  /** URL search params */
  search: URLSearchParams;

  /** URL search (string) */
  searchString: string;

  /** URL query */
  query: Record<string, string>;

  /** URL instance */
  URL: URL;

  /** raw body */
  rawBody: string;

  /** params */
  params: Params;
}

export function createRequest(req: IncomingMessage): Request {
  const request: Request = req as Request;

  const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  const _body = (req as any)._body;

  request.pathname = url.pathname;
  request.href = url.href;
  request.search = url.searchParams;
  request.searchString = url.search;
  request.query = Object.fromEntries(url.searchParams);
  request.URL = url;
  request.rawBody = _body;

  return request;
}

interface Response extends ServerResponse {
  /**
   * Set status code
   * @param statusCode status code
   */
  status: (statusCode: number) => this;

  /**
   * Set message
   * @param message message
   */
  message: (message: string) => this;

  /**
   * Set Content-Type
   *
   * ```ts
   * res.type(".json");
   * res.type("json");
   * res.type("application/json");
   * ```
   * @param type type
   */
  type: (type: string) => this;

  /**
   * Redirect to url with 302 code
   * @param url url
   */
  redirect: (url: string) => this;

  /**
   * Set response header
   *
   * ```ts
   * res.set("foo","bar");
   * res.set({
   *   foo: "bar"
   * });
   * ```
   * @param field field or header object
   * @param value value
   */
  set: (field: string | Record<string, any>, value?: any) => this;

  /**
   * Get header
   * @param field field
   * @returns header
   */
  get: (field: string) => any;

  /**
   * Remove header
   * @param field field
   */
  remove: (field: string) => this;

  /**
   * Check has header
   * @param field field
   * @returns has header
   */
  has: (field: string) => boolean;

  /**
   * Check writable
   * @returns is writable
   */
  isWritable: () => boolean;

  // data sending

  /**
   * Automatically detects the data type and sends it in the appropriate format (supports Buffer, string, object, number, etc.).
   *
   * Use `res.end()` if you want to send raw data directly.
   * ```ts
   * res.send(""); // string
   * res.send({}); // object
   * ```
   * @param data data
   */
  send: (data: any) => void;

  /**
   * Send raw data (type: application/text)
   * @param data data
   */
  text: (data: any) => void;

  /**
   * Send json data (type: application/json)
   * @param data data
   */
  json: (data: any) => void;

  /**
   * Send html data (type: application/html)
   * @param data data
   */
  html: (data: string) => void;

  /**
   * Send file
   * @param file filename
   */
  sendFile: (file: string) => void;
}

export function createResponse(res: ServerResponse): Response {
  const response: Response = res as Response;

  // response.status(code)
  response.status = (code) => {
    response.statusCode = code;
    return response;
  };

  // response.message(msg)
  response.message = (message) => {
    response.statusMessage = message;
    return response;
  };

  // response.set({a: "b"})
  // response.set("a", "b")
  response.set = (field, value) => {
    if (typeof field === 'string') {
      response.setHeader(field, value);
    } else {
      Object.keys(field).forEach((header) => response.setHeader(header, field[header]));
    }

    return this;
  };

  // response.get("a")
  response.get = (field) => {
    return response.getHeader(field);
  };

  // response.remove("a")
  response.remove = (field) => {
    response.removeHeader(field);

    return response;
  };

  // response.has("a")
  response.has = (field) => {
    return response.hasHeader(field);
  };

  // response.redirect(url)
  response.redirect = (url) => {
    if (/^https?:\/\//i.test(url)) {
      url = new URL(url).toString();
    }

    response.set('Location', encodeUrl(url));
    response.status(302);
    response.end();

    return response;
  };

  // response.type(type)
  response.type = (type) => {
    const mimeType = contentType(type);

    if (mimeType) response.set('Content-Type', mimeType);
    else response.remove('Content-Type');

    return response;
  };

  // response.isWritable
  // https://github.com/koajs/koa/blob/master/lib/response.js#L587
  response.isWritable = () => {
    if (response.writableEnded || response.finished) return false;

    const socket = response.socket;
    if (!socket) return true;
    return socket.writable;
  };

  // response.send(data)
  response.send = (data) => {
    // Handle different data types
    let body: string | Buffer;

    if (Buffer.isBuffer(data)) {
      body = data;
    } else if (typeof data === 'string') {
      body = data;
    } else if (data === null || data === undefined) {
      body = '';
    } else if (typeof data === 'object' || Array.isArray(data)) {
      // Automatically stringify objects and arrays as JSON
      response.type('json');
      body = JSON.stringify(data);
    } else if (typeof data === 'number' || typeof data === 'boolean') {
      body = String(data);
    } else {
      body = String(data);
    }

    // Set content length if not already set
    if (!response.has('Content-Length')) {
      response.set('Content-Length', Buffer.byteLength(body));
    }

    response.end(body);
  };

  // response.text(data)
  response.text = (data) => {
    response.type('text').send(data);
  };

  // response.json(data)
  response.json = (data) => {
    response.type('json').send(JSON.stringify(data));
  };

  // response.html(data)
  response.html = (data) => {
    response.type('html').send(data);
  };

  // response.sendFile(file)
  response.sendFile = (file) => {
    const stat = statSync(file);

    response.status(200);
    response.type(extname(file));
    response.set('Content-Length', stat.size);

    const readStream = createReadStream(file);
    readStream.pipe(response);
  };

  return response;
}

export { Request as AppRequest, Response as AppResponse };
