import { game } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";

export const STORM_WARD = { taken: 0.35 } as const;

const wards = new WeakMap<Enemy, number>();

export const wardLeft = (e: Enemy): number => Math.max(0, (wards.get(e) ?? 0) - game.t);

export function wardFoe(e: Enemy, seconds: number): void {
  wards.set(e, game.t + Math.max(wardLeft(e), seconds));
}

export function dropWard(e: Enemy): void {
  wards.delete(e);
}

export const stormWardTakes = (e: Enemy, dmg: number): number => (wardLeft(e) > 0 ? dmg * STORM_WARD.taken : dmg);
