/** the saved job of each hero, keeping only string values under string keys; anything unreadable is no choice */
export function parseJobChoice(raw: unknown): Record<string, string> {
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
  );
}
