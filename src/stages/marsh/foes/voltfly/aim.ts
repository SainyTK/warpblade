import { hero } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { VOLTFLY } from "./constants";

export function aimTarget(e: Enemy): [number, number] {
  const dx = hero.x - e.x;
  const dy = hero.y - 16 - e.y;
  const len = Math.hypot(dx, dy) || 1;
  const reach = len + VOLTFLY.overshoot;
  return [e.x + (dx / len) * reach, e.y + (dy / len) * reach];
}
