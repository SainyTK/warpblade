import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game, hero } from "../../../../game/state";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { DUSK_SPARKS, NIGHT_RAMP } from "../../look/colors";
import { vesperSound } from "../sound";

/** the echo's two small crossing arcs, drawn on the foe */
const ECHO_A = {
  cx: 0,
  cy: 0,
  R: 11,
  sy: 0.9,
  rot: 0.8,
  a0: -2.4,
  a1: 0.8,
  W: 4,
  sweep: 0.03,
  trail: 0.14,
  ramp: NIGHT_RAMP,
};
const ECHO_B = { ...ECHO_A, rot: -0.8 };

/** an echo of the short blade: a moment after a blow, a small cross of night violet cuts the same foe again */
export function createEchoCut(foe: Enemy, damage: number, delay: number, source?: SourceId): Effect {
  const o = { t: 0 };
  return {
    update(dt) {
      o.t += dt;
      if (o.t < delay) return true;
      if (foe.hp <= 0) return false;
      const [x, y] = enemyCenter(foe);
      const dir = Math.sign(x - hero.x) || hero.face;
      game.fx.push(createSlash(x, y, dir, ECHO_A));
      game.fx.push(createSlash(x, y, -dir, ECHO_B));
      game.fx.push(createImpact(x, y, dir, false, DUSK_SPARKS));
      dealDamage(foe, damage, { fromX: hero.x, kx: dir * 20, source });
      vesperSound.echo();
      return false;
    },
    draw() {},
  };
}
