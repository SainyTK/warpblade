import { fleck, place } from "../../../../engine/frame";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { skillValues } from "../../../../game/skills/query";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, progress, rng } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { HOT_RAMP } from "../../constants/colors";
import { layStacks } from "./stacks";

const SKILL = "ca_brass";
/** a casing's flight: seconds to reach its foe and the height of its arc */
const FLIGHT = { time: 0.3, arc: 18, max: 6 } as const;

/** one hot casing flung from the cylinder in an arc onto a foe */
function createCasing(x0: number, y0: number, foe: Enemy, delay: number): Effect {
  const o = { t: -delay, x: x0, y: y0 };
  return {
    update(dt) {
      o.t += dt;
      if (o.t < 0) return true;
      const u = Math.min(1, o.t / FLIGHT.time);
      const [fx, fy] = enemyCenter(foe);
      o.x = x0 + (fx - x0) * u;
      o.y = y0 + (fy - y0) * u - Math.sin(u * Math.PI) * FLIGHT.arc;
      if (u < 1) return true;
      if (foe.hp <= 0) return false;
      const v = skillValues(SKILL);
      layStacks(foe, SKILL, 1, progress.stats.ad * v.damage, FLIGHT.max);
      if (v.stagger && foe.rank === "minion") staggerFoe(foe, v.stagger);
      return false;
    },
    draw() {
      if (o.t < 0) return;
      place();
      fleck(o.x, o.y, HOT_RAMP[5]);
      fleck(o.x + 0.5, o.y, HOT_RAMP[3]);
    },
  };
}

/** the foes the casings go to: the nearest in range, or as Brass Rain every foe on screen */
function targets(rain: boolean, range: number): Enemy[] {
  const foes = rain ? foesOnScreen() : game.enemies.filter((e) => e.hp > 0 && Math.abs(e.x - hero.x) <= range);
  return foes.sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
}

/** Hot Brass: a reload flings hot casings at foes nearby, each one burning the foe it lands on */
export const hotBrass: SkillBehavior = {
  create: () => ({}),
  on: {
    calderReload(_m, event) {
      const v = skillValues(SKILL);
      if (event.ultimate && !v.ult) return;
      const foes = targets(!!v.rain, v.range);
      if (!foes.length) return;
      const n = v.casings * (event.quick && v.quick ? 2 : 1);
      for (let i = 0; i < n; i++)
        game.fx.push(createCasing(hero.x, hero.y - 20, foes[i % foes.length], i * 0.03 + rng.range(0, 0.02)));
    },
  },
};
