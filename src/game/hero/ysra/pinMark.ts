import { fleck, glow, hairline, line, place } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { enemyBox } from "../../enemies/enemy";
import { skin } from "../skin";

/** Impale's mark: a burning stake of glaive-light driven slanting through a pinned foe into the floor, guttering out
 *  as the pin wears off */
export function createPinMark(e: Enemy): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.pinned > 0 && e.hp > 0;
    },
    draw() {
      const [x0, y0, x1, y1] = enemyBox(e);
      const cx = (x0 + x1) / 2;
      const top = y0 + (y1 - y0) * 0.35;
      const R = skin.ramp;
      const flicker = Math.floor(t * 20) % 2;
      place();
      // the pin: a shaft of fire driven through the foe into the floor, hot on its upper edge
      line(cx - 4.5, top - 4, cx + 2.5, y1, R[3]);
      hairline(cx - 5, top - 4, cx + 2, y1, R[4 + flicker]);
      hairline(cx - 3.75, top - 4, cx + 3.25, y1, R[1]);
      fleck(cx - 5, top - 4, R[6]);
      fleck(cx - 4.5, top - 4, R[6]);
      glow(cx + 2, y1, 8, R[3], 0.35 * Math.min(1, e.pinned * 2));
    },
  };
}
