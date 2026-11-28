import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { waveScale } from "../../../../utils/progression";

export const WRAITH = {
  keepAway: 64,
  hover: 48,
  sense: 140,
  draw: 0.9,
  lock: 0.7,
  scream: 0.5,
  spent: 1.3,
  sag: 26,
  top: 24,
} as const;
export const WRAITH_HITS = { keen: 17 } as const;

export const drawTime = (): number => WRAITH.draw * waveScale(game.wave).windup;
export const mouthAt = (e: Enemy): [number, number] => [e.x + e.face * 3, e.y - 5];
