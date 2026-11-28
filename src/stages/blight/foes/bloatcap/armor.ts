import { fxRng, particles } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { BLIGHT_SPARKS } from "../../colors";
import { BLOAT_ARMOR } from "./timing";

export const gillsOpen = (e: Enemy): boolean => e.state !== "drift";

export function bloatTakes(e: Enemy, dmg: number, loud: boolean): number {
  if (gillsOpen(e)) return dmg;
  if (loud)
    for (let i = 0; i < 4; i++)
      particles.spawn(PK.SPARK, e.x, e.y - 6, fxRng.range(-50, 50), -fxRng.range(20, 70), fxRng.range(0.15, 0.3), {
        sparks: BLIGHT_SPARKS.bark,
      });
  return dmg * BLOAT_ARMOR;
}
