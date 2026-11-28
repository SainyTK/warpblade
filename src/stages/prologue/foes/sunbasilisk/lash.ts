import { GROUND } from "../../../../constants/stage";
import { ellipseRing, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import { clamp } from "../../../../utils/math";
import { BASILISK_COLORS as C } from "./colors";
import { BASILISK } from "./constants";

const LIFE = 0.28;

export function createLashArc(x: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < LIFE;
    },
    draw() {
      const k = clamp(t / LIFE);
      const r = BASILISK.lashReach * (0.6 + 0.4 * k);
      place(x, GROUND - 5);
      ellipseRing(0, 0, r, r * 0.2, C.sun[2], 0.8 * (1 - k));
      ellipseRing(0, 0, r - 2, r * 0.17, C.scale[4], 0.6 * (1 - k));
      place();
    },
  };
}
