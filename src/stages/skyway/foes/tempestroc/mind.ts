import type { Enemy } from "../../../../types/enemy";
import type { RocMove } from "./moves";

export interface SwoopPath {
  x0: number;
  y0: number;
  cx: number;
  cy: number;
  x1: number;
  y1: number;
  duration: number;
}

export interface RocMind {
  last: RocMove | null;
  gustDir: number;
  swoop: SwoopPath | null;
  strikes: number[];
  fired: number;
  breathFrom: number;
  breathTo: number;
  struck: Set<number>;
  lit: boolean;
}

const minds = new WeakMap<Enemy, RocMind>();

export function mindOf(e: Enemy): RocMind {
  let mind = minds.get(e);
  if (!mind) {
    mind = {
      last: null,
      gustDir: 1,
      swoop: null,
      strikes: [],
      fired: 0,
      breathFrom: 0,
      breathTo: 0,
      struck: new Set(),
      lit: false,
    };
    minds.set(e, mind);
  }
  return mind;
}

export function swoopPoint(p: SwoopPath, u: number): readonly [number, number] {
  const a = (1 - u) * (1 - u);
  const b = 2 * u * (1 - u);
  const c = u * u;
  return [a * p.x0 + b * p.cx + c * p.x1, a * p.y0 + b * p.cy + c * p.y1];
}
