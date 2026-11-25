import { GROUND } from "../../../constants/stage";
import type { Point } from "../../../types/world";
import { grain } from "../../../utils/grain";
import type { Hall } from "./structures";

const SAW_TOOTH = 8;
const SAW_RISE = 0.7;
const GABLE = 0.32;
const DOME_SQUASH = 0.7;
const SPIRE = 9;
const WINDOW = { first: 3, across: 4, down: 6, from: 6 } as const;
const MOUTH = { half: 9, height: 20 } as const;

const middle = (h: Hall): number => (h.x0 + h.x1) / 2;

export function roofAt(h: Hall, x: number): number | null {
  const mid = middle(h);
  const half = (h.x1 - h.x0) / 2;
  if (h.shape === "stack") {
    if (x >= h.x0 - 1 && x < h.x1 + 1) return x < h.x0 || x >= h.x1 ? h.top + 2 : h.top;
    return null;
  }
  if (h.shape === "dome") {
    if (Math.abs(x - mid) < 0.75) return h.top - SPIRE;
    if (x < h.x0 || x >= h.x1) return null;
    const dx = x - mid;
    return h.top + (half - Math.sqrt(Math.max(0, half * half - dx * dx))) * DOME_SQUASH;
  }
  if (x < h.x0 || x >= h.x1) return null;
  if (h.shape === "saw") return h.top + (SAW_TOOTH - ((x - h.x0) % SAW_TOOTH)) * SAW_RISE;
  if (h.shape === "furnace") {
    const shoulder = Math.max(0, Math.abs(x - mid) - half + 8);
    return h.top + shoulder * shoulder * 0.12;
  }
  return h.top + Math.abs(x - mid) * GABLE;
}

export function inMouth(h: Hall, x: number, y: number): number {
  if (h.shape !== "furnace") return -1;
  const dx = Math.abs(x - middle(h));
  const rise = GROUND - y;
  if (rise < 0 || dx >= MOUTH.half) return -1;
  const archTop = MOUTH.height - (dx * dx) / (MOUTH.half * 1.6);
  if (rise > archTop) return -1;
  return 1 - rise / MOUTH.height;
}

const windowSeed = (h: Hall): number => h.x0 * 7 + h.top;

export function windowAt(h: Hall, x: number, y: number, chance: number): 0 | 1 | 2 {
  if (h.shape === "dome" || h.shape === "furnace") return 0;
  const roof = roofAt(h, h.x0 + 1) ?? h.top;
  const u = x - h.x0 - WINDOW.first;
  const v = y - roof - WINDOW.from;
  if (u < 0 || v < 0 || x >= h.x1 - 2) return 0;
  const i = Math.floor(u / WINDOW.across);
  const j = Math.floor(v / WINDOW.down);
  if (u - i * WINDOW.across >= 1 || v - j * WINDOW.down >= 2) return 0;
  if (h.shape === "stack" && (h.x1 - h.x0 < 9 || i > 0)) return 0;
  return grain(i + windowSeed(h), j) < chance ? (v - j * WINDOW.down < 1 ? 2 : 1) : 0;
}

export function litWindows(halls: readonly Hall[], chance: number): Point[] {
  const found: Point[] = [];
  for (const h of halls) {
    for (let x = h.x0; x < h.x1; x++)
      for (let y = h.top; y < GROUND; y++) if (windowAt(h, x + 0.5, y + 0.5, chance) === 2) found.push({ x, y });
    if (h.shape === "furnace") found.push({ x: middle(h), y: GROUND - MOUTH.height * 0.4 });
  }
  return found;
}
