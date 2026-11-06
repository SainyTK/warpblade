import { SpriteCanvas } from "../engine/sprite";
import type { Color } from "../types/color";
import { spriteUrl } from "./spriteUrl";

const cache = new Map<string, string>();

/** a small pixel image from rows of letters, each letter a colour and "." clear, as a PNG data URL drawn once per key */
export function pixelIconUrl(key: string, rows: readonly string[], colors: Record<string, Color>): string {
  const hit = cache.get(key);
  if (hit) return hit;
  const s = new SpriteCanvas(rows[0].length, rows.length, 0, 0);
  s.begin();
  s.pixels(rows, colors, 0, 0);
  s.commit(false);
  const url = spriteUrl(s);
  cache.set(key, url);
  return url;
}
