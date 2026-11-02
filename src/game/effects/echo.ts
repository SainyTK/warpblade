import { FUSION } from "../../constants/combat";
import { PAL } from "../../constants/palette";
import { sfx } from "../../services/audio";
import type { Effect } from "../../types/effect";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { enemyCenter } from "../enemies/enemy";
import { game } from "../state";
import { createSlash } from "./slash";

const ECHO_SLASH = { cx: 0, cy: 0, R: 16, sy: 0.6, rot: 0.6, a0: -2.4, a1: 0.9, W: 6, ramp: PAL.shadow };

/** Phantom Edge: a shadow of the blow lands on the same foe a moment later */
export function createEcho(e: Enemy, damage: number, face: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      if (t < FUSION.echoDelay) return true;
      if (e.hp > 0) {
        const [cx, cy] = enemyCenter(e);
        game.fx.push(createSlash(cx, cy, face, ECHO_SLASH));
        dealDamage(e, damage, { fromX: cx - face * 10 });
        sfx.swing(1.3);
      }
      return false;
    },
    draw() {},
  };
}
