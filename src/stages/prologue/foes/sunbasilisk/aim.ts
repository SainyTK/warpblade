import { GROUND } from "../../../../constants/stage";
import { hero } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { BASILISK } from "./constants";

export interface GazeLine {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

const line: GazeLine = { x0: 0, y0: 0, x1: 0, y1: 0 };

export const eyeX = (e: Enemy): number => e.x + e.face * BASILISK.eye.x;
export const eyeY = (e: Enemy): number => e.y + BASILISK.eye.y;

export function aimAtHero(e: Enemy): void {
  e.ax = hero.x;
  e.ay = Math.min(hero.y - 16, GROUND - 12);
}

export function gazeLine(e: Enemy): GazeLine {
  const x0 = eyeX(e);
  const y0 = eyeY(e);
  const angle = clamp(Math.atan2(e.ay - y0, Math.max(8, (e.ax - x0) * e.face)), -0.6, 0.3);
  const dx = Math.cos(angle) * e.face;
  const dy = Math.sin(angle);
  const toFloor = dy > 0 ? (GROUND - 1 - y0) / dy : Number.POSITIVE_INFINITY;
  const reach = Math.min(BASILISK.gazeRange, toFloor);
  Object.assign(line, { x0, y0, x1: x0 + dx * reach, y1: y0 + dy * reach });
  return line;
}
