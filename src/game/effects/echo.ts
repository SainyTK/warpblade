import { ECHO_DELAY } from "../../constants/combat";
import { PAL } from "../../constants/palette";
import { sfx } from "../../services/audio";
import type { SourceId } from "../../types/build";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { enemyCenter } from "../enemies/enemy";
import { game } from "../state";
import { createSlash } from "./slash";

const ECHO_SLASH = { cx: 0, cy: 0, R: 16, sy: 0.6, rot: 0.6, a0: -2.4, a1: 0.9, W: 6, ramp: PAL.shadow };

/** a shadow of a blow lands on the same foe a moment later, from the side `face` points away from; it is the skill's own
 *  hit, so it calls no skill */
export function createEcho(e: Enemy, damage: number, face: number, source: SourceId, heavy = false): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (t < ECHO_DELAY) return true;
      if (e.hp > 0) {
        const [cx, cy] = enemyCenter(e);
        game.fx.push(createSlash(cx, cy, face, ECHO_SLASH));
        dealDamage(e, damage, { fromX: cx - face * 10, kx: face * 30, heavy, source });
        sfx.swing(1.3);
      }
      return false;
    },
    draw() {},
  };
}
