import { GROUND } from "../../../../constants/stage";
import { ellipseRing, glow, glowLine, hairline, place, polygon } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { clamp, ease } from "../../../../utils/math";
import { sparkBurst } from "../burst";
import { AURORA_SPARKS, VEIL } from "../colors";
import { RAY } from "./constants";

const A = VEIL.aurora;
const TOP = 6;

export function createAuroraCurtain(x: number, mark: number, damage: number): Effect {
  let t = 0;
  let fell = false;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      if (t < mark) return true;
      if (!fell) {
        fell = true;
        sfx.boom();
        sparkBurst(x, GROUND - 2, 14, AURORA_SPARKS, 90);
      }
      if (t < mark + RAY.fall * 0.6)
        eachStanding(() => {
          if (struck.has(heroSlot())) return;
          if (!boxHit([x - RAY.half, TOP, x + RAY.half, GROUND], heroBox())) return;
          struck.add(heroSlot());
          hurtHero(damage, x);
        });
      return t < mark + RAY.fall;
    },
    draw() {
      place();
      if (t < mark) {
        const k = clamp(t / mark);
        const w = RAY.half * (1.4 - k * 0.4);
        ellipseRing(x, GROUND - 0.5, w, 1.6, A[2 + Math.round(k * 2)], 0.5 + k * 0.5);
        hairline(x - w, GROUND - 0.5, x + w, GROUND - 0.5, A[3], 0.4 + 0.6 * k);
        for (let i = 0; i < 4; i++) {
          const lx = x + (i - 1.5) * (w / 2);
          const h = 6 + k * 22 + Math.sin(t * 14 + i) * 3;
          hairline(lx, GROUND - 1, lx, GROUND - h, A[2], (0.15 + 0.45 * k) * (i % 2 ? 1 : 0.7));
        }
        glowLine(x, GROUND - 1, x, GROUND - 30 * k, 8, A[2], 0.25 * k);
        return;
      }
      const u = clamp((t - mark) / RAY.fall);
      const drop = ease.outExpo(clamp(u * 4));
      const fade = 1 - u * u;
      const bottom = TOP + (GROUND - TOP) * drop;
      const w = RAY.half * (1 - u * 0.5);
      polygon(
        [
          [x - w, TOP],
          [x + w, TOP],
          [x + w * 0.8, bottom],
          [x - w * 0.8, bottom],
        ],
        (sx) => A[2 + (Math.floor(sx + t * 40) % 3 === 0 ? 2 : 1)],
        0.55 * fade,
      );
      for (let i = -2; i <= 2; i++)
        hairline(x + i * w * 0.4, TOP, x + i * w * 0.35, bottom, i % 2 ? VEIL.veil[2] : A[4], 0.7 * fade);
      hairline(x, TOP, x, bottom, WHITE, fade);
      glowLine(x, TOP, x, bottom, 14, A[2], 0.55 * fade);
      glow(x, GROUND - 3, 20, A[3], 0.6 * fade);
    },
  };
}
