import { PAL } from "../../../constants/palette";
import { circle, glow, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { WHITE } from "../../../utils/color";
import { ease } from "../../../utils/math";
import { lights } from "../../state";
import { fineRing } from "../fine";

/** the ring opens from this radius to this one over its life, in art pixels */
const FROM = 4;
const TO = 14;
const LIFE = 0.15;
/** the white core shows for the hit frame only */
const CORE = 1 / 30;

/**
 * An Accent where a blow on the beat lands: a cobalt ring one image pixel wide that opens from 4 to 14 px, with a white
 * core flash on the hit frame and a pale second ring just inside it
 */
export function createAccentRing(x: number, y: number): Effect {
  let t = 0;
  lights.add(x, y, 12, PAL.beat[3], 0.22, 0.1);
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      place();
      const u = t / LIFE;
      const k = 1 - u;
      const r = FROM + (TO - FROM) * ease.outCubic(u);
      fineRing(x, y, r, r, PAL.beat[4], k * 1.6);
      if (r > 6) fineRing(x, y, r - 2, r - 2, PAL.beat[3], k);
      if (t < CORE) {
        circle(x, y, 1, WHITE, 1);
        glow(x, y, 4, PAL.beat[4], 0.25);
      }
    },
  };
}
