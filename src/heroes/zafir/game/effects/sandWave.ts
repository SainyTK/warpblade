import { fleck, glow, place } from "../../../../engine/frame";
import { dealDamage } from "../../../../game/damage";
import { type Payoff, payoffLands } from "../../../../game/skills/payoff";
import { foesOnScreen, touches } from "../../../../game/skills/targets";
import type { SourceId } from "../../../../types/build";
import type { Color } from "../../../../types/color";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { SAND_RAMP } from "../../constants/palette";
import { openWounds } from "../wounds";

/** how fast a sand crescent or a gust flies, how far, and how tall its arc is drawn */
const WAVE = { speed: 230, height: 9 } as const;

export interface SandWaveSpec {
  x: number;
  y: number;
  dir: number;
  damage: number;
  /** pixels it flies */
  range: number;
  /** it passes through every foe; otherwise it ends on the first */
  pierce: boolean;
  wounds: number;
  /** the hero's own source it counts for, or a skill's id */
  source?: SourceId;
  /** a precise wave strikes only the foe its move's payoff lands on and passes the rest by */
  payoff?: Payoff;
  /** its colours, dark to bright */
  ramp?: readonly Color[];
}

/**
 * A crescent of sand flying low along `dir`: an upright arc of grains with a bright leading edge. It cuts each foe it
 * touches once and opens wounds.
 */
export function createSandWave(o: SandWaveSpec): Effect {
  let x = o.x;
  let gone = 0;
  let over = false;
  const struck = new Set<Enemy>();
  const ramp = o.ramp ?? SAND_RAMP;
  return {
    update(dt) {
      const step = WAVE.speed * dt;
      x += o.dir * step;
      gone += step;
      for (const e of foesOnScreen()) {
        if (over || struck.has(e) || !touches(e, x, o.y, WAVE.height)) continue;
        if (o.payoff && !payoffLands(o.payoff, e)) continue;
        struck.add(e);
        dealDamage(e, o.damage, { fromX: x - o.dir * 6, kx: o.dir * 40, source: o.source });
        openWounds(e, o.wounds);
        if (!o.pierce) over = true;
      }
      return !over && gone < o.range;
    },
    draw() {
      place();
      const fade = Math.min(1, (o.range - gone) / 20);
      for (let i = -4; i <= 4; i++) {
        const u = i / 4;
        const bx = x + o.dir * (1 - u * u) * 3;
        const by = o.y + u * WAVE.height;
        fleck(bx, by, ramp[Math.min(ramp.length - 1, 6 - Math.abs(i))], fade);
        fleck(bx - o.dir * 2, by, ramp[3], fade * 0.6);
        fleck(bx - o.dir * 4, by, ramp[2], fade * 0.3);
      }
      glow(x, o.y, 8, ramp[4], 0.2 * fade);
    },
  };
}
