import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";

export const WARD = { seconds: 5, blows: 3, share: 0.4 } as const;

interface Ward {
  until: number;
  blows: number;
}

const wards = new WeakMap<Enemy, Ward>();

export function warded(e: Enemy): boolean {
  const ward = wards.get(e);
  return !!ward && ward.blows > 0 && game.t < ward.until && e.hp > 0;
}

export function raiseWard(e: Enemy): void {
  wards.set(e, { until: game.t + WARD.seconds, blows: WARD.blows });
}

export function spendWard(e: Enemy): boolean {
  const ward = wards.get(e);
  if (!ward) return false;
  ward.blows -= 1;
  return ward.blows <= 0;
}
