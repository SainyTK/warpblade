import { line, place, px } from "../../../../engine/frame";
import type { Enemy } from "../../../../types/enemy";
import { hex } from "../../../../utils/color";
import { enemyCenter } from "../../../enemies/enemy";
import { game, lights } from "../../../state";
import { skin } from "../../skin";
import { drainBleeds } from "./snare";

/** the bramble net holds this long, then closes */
const HOLD = 1.5;
const THORN = hex("#5c3a2a");

/** Bloodtrap: a bramble net thrown over the snare holds every foe in it; when it closes, their bleeds drain at once */
export function createBramble(x: number, y: number, reach: number): void {
  const held: Enemy[] = game.enemies.filter((e) => e.hp > 0 && Math.abs(enemyCenter(e)[0] - x) <= reach);
  for (const e of held) e.stun = Math.max(e.stun, HOLD);
  let t = 0;
  game.fx.push({
    update(dt) {
      t += dt;
      for (const e of held) if (e.hp > 0) e.vx = 0;
      if (t < HOLD) return true;
      drainBleeds(held.filter((e) => e.hp > 0));
      lights.add(x, y - 8, reach + 10, skin.ramp[4], 0.8, 0.25);
      return false;
    },
    drawBack() {
      place();
      const a = Math.min(1, t * 6);
      for (let i = -reach; i <= reach; i += 6) {
        line(x + i, y - 1, x + i + 3, y - 14, THORN, a);
        line(x + i + 3, y - 14, x + i + 6, y - 1, THORN, a);
        px(x + i + 3, y - 14, skin.ramp[4], a);
      }
    },
    draw() {},
  });
}
