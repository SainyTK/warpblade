import { fxRng, particles } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { GARGOYLE_SPARKS } from "./colors";
import { GARGOYLE } from "./constants";

export const grounded = (e: Enemy): boolean => e.ay > 0;
export const armoured = (e: Enemy): boolean => !grounded(e) && (e.state === "drift" || e.state === "wind");

function chip(e: Enemy): void {
  for (let i = 0; i < 5; i++)
    particles.spawn(PK.SHARD, e.x, e.y - 2, fxRng.range(-60, 60), -fxRng.range(30, 90), fxRng.range(0.25, 0.45), {
      col: fxRng.pick(GARGOYLE_SPARKS.chip),
      size: fxRng.range(0.8, 1.6),
    });
  sfx.block();
}

export function takeOnHide(e: Enemy, dmg: number, loud: boolean): number {
  if (!armoured(e)) return dmg;
  if (loud) chip(e);
  return dmg * GARGOYLE.armour;
}
