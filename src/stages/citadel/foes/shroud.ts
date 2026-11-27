import { game } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";

export const SHROUD = { share: 0.4, seconds: 5 } as const;

const shrouds = new WeakMap<Enemy, { by: Enemy; until: number }>();

export function shroudFoe(e: Enemy, by: Enemy): void {
  shrouds.set(e, { by, until: game.t + SHROUD.seconds });
}

export function shroudKeeper(e: Enemy): Enemy | null {
  const s = shrouds.get(e);
  if (!s || game.t > s.until || s.by.hp <= 0 || e.hp <= 0) return null;
  return s.by;
}

export const shroudTakes = (e: Enemy, dmg: number): number => (shroudKeeper(e) ? dmg * SHROUD.share : dmg);
