import type { SkillBehavior } from "../../../types/skillBehavior";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, stacksOf } from "../../enemies/skillStatus";
import { nightshade } from "../../hero/tallis/blowSkills";
import { game, progress } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

/** Nightshade lays its poison in his kit; with its level a poisoned foe that dies passes it to the nearest foe */
export const nightshadeSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    kill(_m, event) {
      if (!skillValues("t_nightshade").spread || stacksOf(event.foe, "t_nightshade") <= 0) return;
      const [cx, cy] = enemyCenter(event.foe);
      const next = nearestFoe(cx, cy, [event.foe]);
      if (next) nightshade(next);
    },
  },
};

/** Ink Wound lays its Ink in his kit; with its levels Ink spreads on death and Inked foes cannot turn */
export const inkWoundSkill: SkillBehavior = {
  create: () => ({}),
  update() {
    if (!skillValues("t_inkWound").still) return;
    for (const e of game.enemies) if (e.hp > 0 && stacksOf(e, "t_inkWound") > 0) e.turn = 0;
  },
  on: {
    kill(_m, event) {
      const v = skillValues("t_inkWound");
      if (!v.spread || stacksOf(event.foe, "t_inkWound") <= 0) return;
      const [cx, cy] = enemyCenter(event.foe);
      const next = nearestFoe(cx, cy, [event.foe]);
      if (next)
        addStacks(next, "t_inkWound", {
          stacks: 1,
          max: 1,
          damage: progress.stats.ad * v.damage,
          every: 1,
          duration: withCharms("duration", v.life),
        });
    },
  },
};
