import { ALLOWED_ORIGINS } from "./constants";

export function json(body: unknown, status = 200): Response {
  return Response.json(body, { status });
}

export function errorResponse(status: number, error: string): Response {
  return json({ error }, status);
}

/** The request body as parsed JSON, or undefined when it is not valid JSON. */
export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return undefined;
  }
}

function allowedOrigin(request: Request): string | null {
  const origin = request.headers.get("Origin");
  if (origin === null) {
    return null;
  }
  if (!ALLOWED_ORIGINS.includes(origin)) {
    return null;
  }
  return origin;
}

/** Answers a CORS preflight: allowed origins get 204, others get 403. `withCors` adds the origin headers. */
export function preflight(request: Request): Response {
  if (allowedOrigin(request) === null) {
    return errorResponse(403, "This site is not allowed to call the feedback API.");
  }
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Access-Control-Max-Age": "86400",
    },
  });
}

/** Adds the CORS headers to a response when the request comes from an allowed origin. */
export function withCors(request: Request, response: Response): Response {
  const origin = allowedOrigin(request);
  const headers = new Headers(response.headers);
  headers.append("Vary", "Origin");
  if (origin !== null) {
    headers.set("Access-Control-Allow-Origin", origin);
  }
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}
