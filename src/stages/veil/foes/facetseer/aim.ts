import { hero } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { SEER } from "./constants";

export const eyeAt = (e: Enemy): [number, number] => [e.x + e.face * 3, e.y];

export const aimAtHero = (e: Enemy): number => {
  const [x, y] = eyeAt(e);
  return Math.atan2(hero.y - 16 - y, hero.x - x);
};

export const beamEnd = (e: Enemy): [number, number] => {
  const [x, y] = eyeAt(e);
  return [x + Math.cos(e.ax) * SEER.reach, y + Math.sin(e.ax) * SEER.reach];
};
