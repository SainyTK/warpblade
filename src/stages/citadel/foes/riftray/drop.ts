import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, glow, hairline, line, place } from "../../../../engine/frame";
import { VOID, VOID_SPARKS } from "../../../../game/enemies/abyss/colors";
import { fxRng, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { strikeOnce } from "../strike";
import { RAY } from "./constants";

export function createRiftDrop(e: Enemy, damage: number): Effect {
  let t = 0;
  const x = e.x;
  const top = e.y + 4;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      const live = t < RAY.dropTime;
      if (live) strikeOnce(struck, [x - RAY.dropHalf, top, x + RAY.dropHalf, GROUND], damage, x);
      if (live && fxRng.chance(0.8))
        particles.spawn(
          PK.SPARK,
          x + fxRng.range(-6, 6),
          GROUND - 1,
          fxRng.range(-40, 40),
          -fxRng.range(40, 120),
          0.3,
          {
            sparks: VOID_SPARKS,
          },
        );
      return t < RAY.dropTime + 0.2;
    },
    drawBack() {
      place();
      ellipseRing(x, GROUND, 12, 2.6, VOID[3], clamp(1 - t / (RAY.dropTime + 0.2)));
    },
    draw() {
      const fade = 1 - clamp((t - RAY.dropTime) / 0.2);
      const grow = clamp(t / 0.06);
      const half = RAY.dropHalf * grow * (0.8 + 0.2 * Math.sin(t * 60));
      place();
      for (let k = -half; k <= half; k += 1) {
        const edge = Math.abs(k) / Math.max(1, half);
        line(x + k, top, x + k, GROUND, VOID[edge > 0.75 ? 2 : edge > 0.4 ? 3 : 4], 0.75 * fade);
      }
      hairline(x, top, x, GROUND, VOID[5], fade);
      for (let i = 0; i < 6; i++) fleck(x + fxRng.range(-half, half), fxRng.range(top, GROUND), VOID[5], fade);
      glow(x, (top + GROUND) / 2, (GROUND - top) / 2 + 8, VOID[3], 0.5 * fade);
    },
  };
}
