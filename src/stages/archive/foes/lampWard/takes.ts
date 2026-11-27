import { enemyCenter } from "../../../../game/enemies/enemy";
import { fxRng, particles } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { FOE_SPARKS } from "../colors";
import { wardHolds } from "./state";

const WARD_SHARE = 0.3;

export function wardedTakes(e: Enemy, dmg: number, loud: boolean): number {
  if (!wardHolds(e)) return dmg;
  if (loud) {
    const [cx, cy] = enemyCenter(e);
    for (let i = 0; i < 4; i++)
      particles.spawn(PK.SPARK, cx, cy, fxRng.range(-60, 60), fxRng.range(-60, 20), 0.25, {
        sparks: FOE_SPARKS.glyph,
      });
  }
  return dmg * WARD_SHARE;
}
