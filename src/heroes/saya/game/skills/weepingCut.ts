import { dealDamage } from "../../../../game/damage";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { addStacks, consumeStacks, stacksOf } from "../../../../game/enemies/skillStatus";
import { skillValues, withCharms } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { WEEP_SPREAD } from "../../constants/skillLook";
import { SKILL } from "../../constants/skills/ids";
import { createInkBurst } from "../effects/inkBurst";

/** lay this many bleeding stacks on a foe at the skill's numbers */
function bleed(e: Enemy, stacks: number): void {
  const v = skillValues(SKILL.weep);
  const spec = { stacks, max: v.max, damage: progress.stats.ad * v.damage, every: v.every };
  addStacks(e, SKILL.weep, { ...spec, duration: withCharms("duration", v.time) });
}

/** Weeping Cut: a release leaves its foes bleeding; as Weeping Moon a foe with enough stacks bursts them first */
export const weepingCut: SkillBehavior = {
  create: () => ({}),
  on: {
    release(_m, event) {
      const v = skillValues(SKILL.weep);
      if (!event.full && !v.early) return;
      for (const c of event.cuts) {
        if (c.foe.hp <= 0) continue;
        if (v.burst && stacksOf(c.foe, SKILL.weep) >= v.burstAt) {
          const n = consumeStacks(c.foe, SKILL.weep);
          game.fx.push(createInkBurst(...enemyCenter(c.foe), [0.8, -0.8, 0], true));
          dealDamage(c.foe, progress.stats.ad * v.burst * n, { source: SKILL.weep });
        }
        bleed(c.foe, v.perCut ? c.count : v.stacks);
      }
    },
    kill(_m, event) {
      const v = skillValues(SKILL.weep);
      const n = stacksOf(event.foe, SKILL.weep);
      if (!v.spread || !n) return;
      const [x, y] = enemyCenter(event.foe);
      for (const e of game.enemies) {
        const [ex, ey] = enemyCenter(e);
        if (e !== event.foe && e.hp > 0 && Math.hypot(ex - x, ey - y) < WEEP_SPREAD) bleed(e, n);
      }
    },
  },
};
