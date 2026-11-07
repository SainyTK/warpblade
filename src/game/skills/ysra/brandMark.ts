import { glow, line, place, px } from "../../../engine/frame";
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
        line(x + Math.cos(a) * 2, y + Math.sin(a) * 2, x + Math.cos(a) * 4, y + Math.sin(a) * 4, R[4]);
      }
      px(x, y, Math.floor(t * 8) % 2 ? R[5] : WHITE);
      px(x - 1, y, R[3]);
      px(x + 1, y, R[3]);
      px(x, y + 1, R[3]);
      glow(x, y, 7, R[4], 0.35 + n * 0.04);
    },
  };
}
