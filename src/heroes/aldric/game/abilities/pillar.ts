import { GROUND } from "../../../../constants/stage";
import { glow, hairline, line, place } from "../../../../engine/frame";
import { createFloorRing } from "../../../../game/effects/floorRing";
import { game, lights } from "../../../../game/state";
import { shake } from "../../../../game/world";
import type { SourceId } from "../../../../types/build";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { PILLAR } from "../../constants/abilities";
import { DAWN_RAMP } from "../../constants/light";
import { foesIn, strikeEach } from "../strike";

/** one pillar: where it falls, after how long, how hard, how long it stuns, and what it counts as */
export interface PillarSpec {
  x: number;
  delay: number;
  damage: number;
  stun: number;
  half: number;
  source: SourceId;
  /** a foe it strikes, told after the blow (a skill's brand) */
  struck?: (hit: readonly Enemy[]) => void;
}

/**
 * A pillar of dawn light called down from above: a thin warning line of light on the floor while it gathers, then a
 * column that strikes every foe in it at once and knocks them down, and fades from the edges in.
 */
export function createSunPillar(p: PillarSpec): Effect {
  let t = 0;
  let fell = false;
  return {
    update(dt) {
      t += dt;
      if (!fell && t >= p.delay) {
        fell = true;
        const hit = foesIn([p.x - p.half, -40, p.x + p.half, GROUND + 4], p.x);
        strikeEach(hit, p.damage, { fromX: p.x, kx: 10, ky: -40, stun: p.stun, heavy: true, source: p.source });
        p.struck?.(hit);
        game.fx.push(createFloorRing(p.x, GROUND, p.half + 10, DAWN_RAMP, 0.35));
        lights.add(p.x, GROUND - 30, 32, DAWN_RAMP[4], 0.5, 0.3);
        shake(0.12, 1.6);
      }
      return t < p.delay + PILLAR.life;
    },
    draw() {
      place();
      if (t < p.delay) {
        const k = t / p.delay;
        hairline(p.x - p.half * k, GROUND, p.x + p.half * k, GROUND, DAWN_RAMP[4], 0.8);
        hairline(p.x, GROUND - 2, p.x, GROUND - 2 - 60 * k, DAWN_RAMP[5], (u) => 0.5 * (1 - u));
        glow(p.x, GROUND - 2, 6 + 6 * k, DAWN_RAMP[4], 0.3);
        return;
      }
      const u = (t - p.delay) / PILLAR.life;
      const w = p.half * (1 - u * u);
      for (let dx = -w; dx <= w; dx += 0.5) {
        const edge = Math.abs(dx) / Math.max(0.5, w);
        const c = edge < 0.12 ? WHITE : edge < 0.4 ? DAWN_RAMP[5] : edge < 0.75 ? DAWN_RAMP[4] : DAWN_RAMP[3];
        line(p.x + dx, -10, p.x + dx, GROUND, c, edge < 0.4 ? 0.9 - u * 0.6 : 0.75 - u * 0.6);
      }
      glow(p.x, GROUND - 40, p.half * 2.4, DAWN_RAMP[3], 0.3 * (1 - u));
      glow(p.x, GROUND - 4, p.half * 1.6, DAWN_RAMP[4], 0.35 * (1 - u));
    },
  };
}
