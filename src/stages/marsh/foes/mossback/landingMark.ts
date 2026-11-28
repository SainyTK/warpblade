import { GROUND } from "../../../../constants/stage";
import { ellipseRing, glow, hairline, place } from "../../../../engine/frame";
import { RAIN_FOES as R } from "../../../../game/enemies/rain/colors";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { SNAP } from "./constants";

export function createLandingMark(e: Enemy, x: number, flight: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.state === "leap" && e.hp > 0 && t < flight + 0.2;
    },
    drawBack() {
      const u = clamp(t / flight);
      const r = SNAP.splash * (1.3 - u * 0.3);
      place(x, GROUND);
      ellipseRing(0, 0, r, r * 0.22, u > 0.7 ? R.mudGlint : R.mudRim, 0.5 + u * 0.4);
      ellipseRing(0, 0, r * 0.55, r * 0.14, R.wart, 0.3 + u * 0.5);
      hairline(-r * 0.4, 0.5, r * 0.4, 0.5, R.mudDark, 0.8);
      glow(0, -2, r, R.wart, 0.08 + u * 0.18);
      place();
    },
    draw() {},
  };
}
