import { line, place } from "../../../../engine/frame";
import type { Enemy } from "../../../../types/enemy";
import { hex } from "../../../../utils/color";
import { enemyBox } from "../../../enemies/enemy";
import { markFoe } from "../../../enemies/skillStatus";
import { game } from "../../../state";

/** a tangled foe takes this much more */
const TAKEN = 0.25;
/** seconds after the throw before the net catches it at the top of its rise */
const CATCH = 0.18;
const ROPE = hex("#b8a274");

/** Tangle Slide: a foe the slide threw hangs in a net in the air for a while, taking more damage */
export function tangle(e: Enemy, seconds: number): void {
  let t = 0;
  let hangY = 0;
  markFoe(e, "s_slideKick", seconds + CATCH, TAKEN);
  game.fx.push({
    update(dt) {
      t += dt;
      if (e.hp <= 0) return false;
      if (t < CATCH) return true;
      if (!hangY) hangY = e.y;
      if (e.air) {
        e.y = hangY;
        e.vy = 0;
        e.vx = 0;
      }
      return t < seconds + CATCH;
    },
    draw() {
      if (t < CATCH || e.hp <= 0) return;
      place();
      const [x0, y0, x1, y1] = enemyBox(e);
      for (let i = 0; i <= 3; i++) {
        const u = i / 3;
        line(x0 + (x1 - x0) * u, y0 - 1, x0 + (x1 - x0) * (1 - u), y1 + 1, ROPE, 0.8);
      }
      line(x0 - 1, (y0 + y1) / 2, x1 + 1, (y0 + y1) / 2, ROPE, 0.8);
    },
  });
}
