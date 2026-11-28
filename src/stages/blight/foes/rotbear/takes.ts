import { fxRng, particles } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { BLIGHT_SPARKS } from "../../colors";
import { exposed } from "./behavior";
import { BEAR_MOVE } from "./constants";

export function bearTakes(e: Enemy, dmg: number, loud: boolean): number {
  if (!exposed(e)) return dmg;
  if (loud)
    for (let i = 0; i < 5; i++)
      particles.spawn(
        PK.SPARK,
        e.x + e.face * 8,
        e.y - 14,
        fxRng.range(-50, 50),
        -fxRng.range(30, 90),
        fxRng.range(0.2, 0.35),
        {
          sparks: BLIGHT_SPARKS.flesh,
        },
      );
  return dmg * BEAR_MOVE.exposed;
}
