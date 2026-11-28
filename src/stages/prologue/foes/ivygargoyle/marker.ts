import { GROUND } from "../../../../constants/stage";
import { castShadow, ellipseRing, glow, hairline, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { GARGOYLE_COLORS as C } from "./colors";

const aiming = (e: Enemy): boolean => e.hp > 0 && (e.state === "wind" || e.state === "dive");

export function createLandingMark(e: Enemy): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return aiming(e);
    },
    drawBack() {
      const near = clamp(1 - (GROUND - e.y) / 90);
      const k = clamp(t / 0.6);
      castShadow(e.ax, GROUND, 10 + near * 4, 2.5 + near, 0.25 + near * 0.35);
      place(e.ax, GROUND);
      const r = 18 - k * 6;
      ellipseRing(0, 0, r, r * 0.25, k > 0.8 || e.state === "dive" ? C.crackHot : C.crack, 0.5 + k * 0.4);
      ellipseRing(0, 0, r * 0.5, r * 0.13, C.crack, k);
      hairline(-4, 0.25, 4, 0.25, C.crackHot, 0.6 + near * 0.4);
      glow(0, -1, 14, C.crack, 0.1 + near * 0.3);
      place();
    },
    draw() {},
  };
}
