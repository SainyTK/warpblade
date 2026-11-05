/** fields that point at foes, effects or methods-bearing objects: a guest's HUD never reads them */
const SKIPPED = new Set(["lastHit", "warpTarget", "carried", "sword", "move", "anchor"]);
const DEPTH = 5;

/** a copy of game state that survives JSON: sets, maps and endless numbers tagged, functions and foe links left out */
export function toWire(value: unknown, depth = 0): unknown {
  if (typeof value === "number" && !Number.isFinite(value)) return { $num: String(value) };
  if (value === null || typeof value !== "object") return typeof value === "function" ? undefined : value;
  if (depth > DEPTH) return undefined;
  if (value instanceof Set) return { $set: [...value].map((v) => toWire(v, depth + 1)) };
  if (value instanceof Map) return { $map: [...value].map(([k, v]) => [k, toWire(v, depth + 1)]) };
  if (Array.isArray(value)) return value.map((v) => toWire(v, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(value)) {
    if (SKIPPED.has(key)) {
      out[key] = null;
      continue;
    }
    const wired = toWire(v, depth + 1);
    if (wired !== undefined) out[key] = wired;
  }
  return out;
}

/** undo toWire: tagged sets, maps and numbers come back */
export function fromWire(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(fromWire);
  const record = value as Record<string, unknown>;
  if (typeof record.$num === "string") return Number(record.$num);
  if (Array.isArray(record.$set)) return new Set(record.$set.map(fromWire));
  if (Array.isArray(record.$map))
    return new Map((record.$map as [unknown, unknown][]).map(([k, v]) => [k, fromWire(v)] as [unknown, unknown]));
  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(record)) out[key] = fromWire(v);
  return out;
}
