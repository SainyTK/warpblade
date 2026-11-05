import { SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { SpriteImage } from "../../../types/sprite";
import { hex } from "../../../utils/color";

/** Button icons as pixel rows, one character per pixel, "." empty; each gets a dark outline. */
export interface IconArt {
  rows: readonly string[];
  colors: Record<string, Color>;
}

const OUTLINE = hex("#0a0612");
export const ICON_WHITE = hex("#ffffff");

const cache = new Map<string, SpriteImage>();

/** pixel art with its outline, drawn once and kept under `key` */
export function iconFrom(key: string, art: IconArt): SpriteImage {
  const hit = cache.get(key);
  if (hit) return hit;
  const w = Math.max(...art.rows.map((r) => r.length));
  const canvas = new SpriteCanvas(w + 2, art.rows.length + 2, 0, 0);
  canvas.begin();
  canvas.pixels(art.rows, art.colors, 1, 1);
  canvas.commit(false);
  canvas.outline(OUTLINE);
  const icon = canvas.snapshot();
  cache.set(key, icon);
  return icon;
}

/** a ring of three marks, one per choice, with a white core on the selected one */
export function ringArt(selected: number, colors: readonly [Color, Color, Color]): IconArt {
  const rows = ["...A...", "..AAA..", "...A...", ".......", ".B...C.", "BBB.CCC", ".B...C."];
  const cores: [number, number][] = [
    [3, 1],
    [1, 5],
    [5, 5],
  ];
  const [cx, cy] = cores[selected] ?? cores[0];
  const marked = rows.map((row, y) => (y === cy ? `${row.slice(0, cx)}W${row.slice(cx + 1)}` : row));
  return { rows: marked, colors: { A: colors[0], B: colors[1], C: colors[2], W: ICON_WHITE } };
}
