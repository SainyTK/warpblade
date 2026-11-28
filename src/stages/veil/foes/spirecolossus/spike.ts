import { GROUND } from "../../../../constants/stage";
import { ellipseRing, glow, hairline, place, polygon, toScreenX } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { clamp, ease } from "../../../../utils/math";
import { shardBurst } from "../burst";
import { VEIL } from "../colors";
import { COLOSSUS } from "./constants";

const K = VEIL.crystal;
const HALF = 5;
const HEIGHT = 22;

export function createSpireSpike(x: number, mark: number, damage: number): Effect {
  let t = 0;
  let broke = false;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      if (t < mark) return true;
      if (!broke) {
        broke = true;
        shardBurst(x, GROUND - 2, 6, K);
      }
      if (t < mark + COLOSSUS.spikeLife * 0.5)
        eachStanding(() => {
          if (struck.has(heroSlot()) || !boxHit([x - HALF, GROUND - HEIGHT, x + HALF, GROUND], heroBox())) return;
          struck.add(heroSlot());
          hurtHero(damage, x);
        });
      return t < mark + COLOSSUS.spikeLife;
    },
    draw() {
      place();
      if (t < mark) {
        const k = clamp(t / mark);
        ellipseRing(x, GROUND - 0.5, HALF + 1, 1.5, K[2 + Math.round(k)], 0.4 + 0.6 * k);
        hairline(x - HALF, GROUND - 0.5, x + HALF, GROUND - 0.5, K[3], 0.3 + 0.6 * k);
        glow(x, GROUND - 1, 8, K[2], 0.25 * k);
        return;
      }
      const u = clamp((t - mark) / COLOSSUS.spikeLife);
      const h = HEIGHT * ease.outExpo(clamp(u * 5)) * (1 - u * u * 0.6);
      const fade = u < 0.7 ? 1 : 1 - (u - 0.7) / 0.3;
      polygon(
        [
          [x - HALF, GROUND],
          [x - 1, GROUND - h],
          [x + 1.5, GROUND - h * 0.85],
          [x + HALF, GROUND],
        ],
        (sx) => (sx < toScreenX(x) ? K[3] : K[1]),
        fade,
      );
      polygon(
        [
          [x - HALF - 3, GROUND],
          [x - HALF + 0.5, GROUND - h * 0.45],
          [x - HALF + 1.5, GROUND],
        ],
        K[2],
        fade,
      );
      hairline(x - 1, GROUND - h, x - HALF * 0.4, GROUND, WHITE, fade);
      glow(x, GROUND - h * 0.5, 12, K[2], 0.45 * fade);
    },
  };
}
