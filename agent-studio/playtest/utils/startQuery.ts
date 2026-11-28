import type { RunStart } from "../types/session";

export function startQuery(start: RunStart | undefined): string {
  if (!start) {
    return "";
  }
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(start)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
