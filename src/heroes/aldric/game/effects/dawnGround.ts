import { GROUND } from "../../../../constants/stage";
import { fleck, glow, hairline, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import type { Effect } from "../../../../types/effect";
import { grain } from "../../../../utils/grain";
import { DAWN_RAMP } from "../../constants/light";
import { foesIn } from "../strike";

/** seconds between burns */
const EVERY = 0.5;

/**
 * Lingering Dawn: a strip of light on the floor where a pillar fell. Foes standing in it burn every half second, and
 * motes of light rise from it until it fades.
 */
export function createDawnGround(x: number, width: number, time: number, perSecond: number): Effect {
  let t = 0;
  let next = EVERY;
  const half = width / 2;
  return {
    update(dt) {
      t += dt;
      if (t >= next) {
        next += EVERY;
        for (const e of foesIn([x - half, GROUND - 40, x + half, GROUND + 2], x))
          dealDamage(e, perSecond * EVERY, { source: "al_dawn", dot: true, fromX: x });
      }
      return t < time;
    },
    draw() {
      place();
      const k = Math.min(1, (time - t) / 0.4);
      hairline(x - half, GROUND, x + half, GROUND, DAWN_RAMP[4], 0.7 * k);
      hairline(x - half * 0.7, GROUND - 0.5, x + half * 0.7, GROUND - 0.5, DAWN_RAMP[5], 0.5 * k);
      for (let i = 0; i < 6; i++) {
        const u = (t * 0.7 + grain(i, 7)) % 1;
        fleck(x - half + grain(i, 3) * width, GROUND - u * 14, DAWN_RAMP[u < 0.5 ? 5 : 4], k * (1 - u));
      }
      glow(x, GROUND - 3, half, DAWN_RAMP[3], 0.25 * k);
    },
  };
}
