/** A salted SHA-256 hash of the caller's IP, so the store never keeps the IP itself. */
export async function hashCallerIp(request: Request, salt: string): Promise<string> {
  const ip = request.headers.get("CF-Connecting-IP") ?? "unknown";
  const data = new TextEncoder().encode(`${salt}:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
