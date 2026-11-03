// A drawn effect frame as pixel rows with a color key, the same shape as the game's HEAD sprite rows.
import type { EffectCel } from '../sketch';

/** Characters that name colors in the rows; "." is empty. */
const KEYS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

export interface CelRows {
  /** Top-left of the rows in art pixels from Kael's feet. */
  x: number;
  y: number;
  rows: string[];
  /** Row character to "#rrggbb". */
  colors: Record<string, string>;
}

export const pixelKey = (x: number, y: number): string => `${x},${y}`;

export function parsePixelKey(key: string): [number, number] {
  const [x = 0, y = 0] = key.split(',').map(Number);
  return [x, y];
}

const hex = (color: number): string => `#${color.toString(16).padStart(6, '0')}`;

export function celRows(cel: EffectCel): CelRows | null {
  const entries = Object.entries(cel.pixels).map(([key, color]) => [...parsePixelKey(key), color]);
  if (!entries.length) {
    return null;
  }
  const xs = entries.map(([x]) => x);
  const ys = entries.map(([, y]) => y);
  const x0 = Math.min(...xs);
  const y0 = Math.min(...ys);
  const width = Math.max(...xs) - x0 + 1;
  const height = Math.max(...ys) - y0 + 1;
  const keyOf = new Map<number, string>();
  const grid = Array.from({ length: height }, () => Array<string>(width).fill('.'));
  for (const [x, y, color] of entries) {
    let key = keyOf.get(color);
    if (!key) {
      key = KEYS[keyOf.size % KEYS.length] ?? '#';
      keyOf.set(color, key);
    }
    const row = grid[y - y0];
    if (row) {
      row[x - x0] = key;
    }
  }
  return {
    x: x0,
    y: y0,
    rows: grid.map((row) => row.join('')),
    colors: Object.fromEntries([...keyOf].map(([color, key]) => [key, hex(color)])),
  };
}
