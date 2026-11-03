import type { ServerResponse } from 'node:http';

export function json(res: ServerResponse, status: number, body: unknown): void {
  const data = Buffer.from(JSON.stringify(body));
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': data.length,
    'Cache-Control': 'no-store',
  });
  res.end(data);
}

export function error(res: ServerResponse, status: number, message: string): void {
  json(res, status, { error: message });
}

/** An image the browser may cache: its URL never changes content. */
export function image(res: ServerResponse, mediaType: string, data: Buffer): void {
  res.writeHead(200, {
    'Content-Type': mediaType,
    'Content-Length': data.length,
    'Cache-Control': 'private, max-age=86400, immutable',
    'X-Content-Type-Options': 'nosniff',
  });
  res.end(data);
}
