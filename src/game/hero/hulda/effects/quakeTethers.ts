import { QUAKE_SKILL } from "../../../../constants/hulda/ultimates";
import { W } from "../../../../constants/stage";
import { glow, line, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { enemyCenter } from "../../../enemies/enemy";
import { hero } from "../../../state";
import { skin } from "../../skin";

/**
 * Quake Drop's tethers: a crimson line from her hands to each foe, dragging it along the floor to just in front of her
 * while her fists rise, so the crack runs under it.
 */
export function createQuakeTethers(foes: readonly Enemy[]): Effect {
  const pulls = foes.map((e) => ({ e, x0: e.x }));
  const to = clamp(hero.x + hero.face * QUAKE_SKILL.tetherTo, 10, W - 10);
  let t = 0;
  return {
    update(dt) {
      t += dt;
      const u = Math.min(1, t / QUAKE_SKILL.tetherTime);
      for (const p of pulls) {
        if (p.e.hp <= 0) continue;
        p.e.x = p.x0 + (to - p.x0) * u * u;
        p.e.vx = 0;
        p.e.stun = Math.max(p.e.stun, 0.1);
      }
      return t < QUAKE_SKILL.tetherTime;
    },
    draw() {
      place();
      const ramp = skin.ramp;
      const hx = hero.x + hero.face * 6;
      const hy = hero.y - 20;
      for (const p of pulls) {
        if (p.e.hp <= 0) continue;
        const [ex, ey] = enemyCenter(p.e);
        line(hx, hy, ex, ey, (u) => (u < 0.5 ? ramp[4] : ramp[5]), 0.9);
        glow(ex, ey, 6, ramp[4], 0.3);
      }
    },
  };
}
