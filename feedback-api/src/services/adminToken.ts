const BEARER_PREFIX = "Bearer ";

async function sha256(text: string): Promise<ArrayBuffer> {
  return crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
}

/** True when the request carries the admin bearer token. Compares hashes in constant time. */
export async function hasAdminToken(request: Request, adminToken: string): Promise<boolean> {
  const header = request.headers.get("Authorization");
  if (header === null) {
    return false;
  }
  if (!header.startsWith(BEARER_PREFIX)) {
    return false;
  }
  if (adminToken === "") {
    return false;
  }
  const given = await sha256(header.slice(BEARER_PREFIX.length));
  const expected = await sha256(adminToken);
  return crypto.subtle.timingSafeEqual(given, expected);
}
