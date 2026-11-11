import { glow, hairline, place, polygon } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { WHITE } from "../../../utils/color";
import { enemyBox } from "../../enemies/enemy";
import { stacksOf } from "../../enemies/skillStatus";
import { skin } from "../../hero/skin";

/** Ember Brand's mark over a branded foe: a burning glyph of the temple's sun, a ray for each stack, while it lasts */
export function createBrandMark(e: Enemy): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.hp > 0 && stacksOf(e, "y_brand") > 0;
    },
    draw() {
      const [x0, y0, x1] = enemyBox(e);
      const x = Math.round((x0 + x1) / 2);
      const y = Math.round(y0 - 6);
      const n = stacksOf(e, "y_brand");
      const R = skin.ramp;
      place();
      for (let i = 0; i < n; i++) {
        const a = -Math.PI / 2 + ((i - (n - 1) / 2) * Math.PI) / 7;
        hairline(
          x + 0.5 + Math.cos(a) * 2,
          y + 0.5 + Math.sin(a) * 2,
          x + 0.5 + Math.cos(a) * 4.5,
          y + 0.5 + Math.sin(a) * 4.5,
          (u) => R[u < 0.5 ? 5 : 3],
        );
      }
      // the brand: a small diamond of ember with a core that pulses white
      polygon(
        [
          [x + 0.5, y - 1.5],
          [x + 2.5, y + 0.5],
          [x + 0.5, y + 2.5],
          [x - 1.5, y + 0.5],
        ],
        R[3],
      );
      polygon(
        [
          [x + 0.5, y - 0.5],
          [x + 1.5, y + 0.5],
          [x + 0.5, y + 1.5],
          [x - 0.5, y + 0.5],
        ],
        Math.floor(t * 8) % 2 ? R[5] : WHITE,
      );
      glow(x, y, 7, R[4], 0.35 + n * 0.04);
    },
  };
}
