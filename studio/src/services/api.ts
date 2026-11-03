/** JSON over the studio server. Errors carry the server's message. */
export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: init.body ? { 'Content-Type': 'application/json', ...init.headers } : init.headers,
  });
  const body = (await response.json().catch(() => ({}))) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? `The studio server answered HTTP ${response.status}.`);
  }
  return body;
}

export const send = <T>(path: string, method: 'POST' | 'PUT' | 'DELETE', body?: unknown) =>
  request<T>(path, { method, body: body === undefined ? undefined : JSON.stringify(body) });
