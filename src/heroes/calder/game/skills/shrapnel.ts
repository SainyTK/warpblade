import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillEvolved, skillValues } from "../../../../game/skills/query";
import { nearestFoe } from "../../../../game/skills/targets";
import { game, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { roundBlast } from "../effects/roundBlast";
import { calderFx } from "../skillFx";
import { layStacks } from "./stacks";

const SKILL = "ca_shrapnel";
/** the reach of Shrapnel Storm's detonation */
const STORM_REACH = 30;

const lay = (e: Enemy, n: number): void => {
  const v = skillValues(SKILL);
  layStacks(e, SKILL, n, progress.stats.ad * v.damage, v.max);
};

/** Shrapnel Storm: a foe carrying enough shrapnel bursts, the shards striking every foe round it */
function detonate(e: Enemy): void {
  const v = skillValues(SKILL);
  const n = consumeStacks(e, SKILL);
  const [x, y] = enemyCenter(e);
  roundBlast(x, y, 1, true, true);
  calderFx(SKILL, "burst", { x, y, reach: STORM_REACH * 0.3 }, { damage: progress.stats.ad * v.burst * n });
  for (const o of game.enemies) {
    if (o.hp <= 0) continue;
    const [ox, oy] = enemyCenter(o);
    if (Math.hypot(ox - x, oy - y) > STORM_REACH) continue;
    dealDamage(o, progress.stats.ad * v.burst * n, { fromX: x, kx: Math.sign(ox - x) * 80, ky: -60, source: SKILL });
  }
}

/** Shrapnel: every round's blast leaves bleeding shrapnel in the foes it struck; the third cut tears it out, a fallen foe's
 *  passes on, and Shrapnel Storm detonates a full load */
export const shrapnel: SkillBehavior = {
  create: () => ({}),
  on: {
    calderBlast(_m, event) {
      const v = skillValues(SKILL);
      const first = event.foes.find((e) => e.hp > 0);
      if (first) {
        const [fx, fy] = enemyCenter(first);
        calderFx(SKILL, "mark", { x: fx, y: fy }, { damage: progress.stats.ad * v.damage * v.stacks * 6, quiet: true });
      }
      for (const e of event.foes) {
        if (e.hp <= 0) continue;
        if (skillEvolved(SKILL) && stacksOf(e, SKILL) >= v.at) detonate(e);
        else lay(e, v.stacks);
      }
    },
    blow(_m, event) {
      const v = skillValues(SKILL);
      if (!v.rip || !event.finisher || event.foe.hp <= 0) return;
      const n = consumeStacks(event.foe, SKILL);
      if (!n) return;
      const [rx, ry] = enemyCenter(event.foe);
      calderFx(SKILL, "burst", { x: rx, y: ry, reach: 10 }, { damage: progress.stats.ad * v.rip * n });
      dealDamage(event.foe, progress.stats.ad * v.rip * n, { fromX: event.foe.x, kx: 0, ky: -40, source: SKILL });
    },
    kill(_m, event) {
      const n = stacksOf(event.foe, SKILL);
      if (!n || !skillValues(SKILL).pass) return;
      const [x, y] = enemyCenter(event.foe);
      const next = nearestFoe(x, y, [event.foe]);
      if (next) lay(next, n);
    },
  },
};
