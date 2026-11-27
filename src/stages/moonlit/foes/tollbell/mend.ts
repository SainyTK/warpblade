import { fxRng, game, particles } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { MOON_MOTES } from "../graveColors";
import { BELL_MEND } from "./pose";

export function mendAround(bell: Enemy, reach: number): void {
  for (const o of game.enemies) {
    if (o === bell || o.hp <= 0 || o.hp >= o.max) continue;
    if (Math.hypot(o.x - bell.x, o.y - bell.y) > reach + 20) continue;
    o.hp = Math.min(o.max, o.hp + o.max * BELL_MEND);
    for (let i = 0; i < 8; i++)
      particles.spawn(PK.MOTE, o.x + fxRng.range(-6, 6), o.y - fxRng.range(0, 16), 0, -fxRng.range(16, 34), 0.6, {
        col: fxRng.pick(MOON_MOTES),
        size: 0.8,
      });
  }
}
