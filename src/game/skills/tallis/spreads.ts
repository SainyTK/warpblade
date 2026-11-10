import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks, stacksOf } from "../../enemies/skillStatus";
import { nightshade } from "../../hero/tallis/blowSkills";
import { game, progress } from "../../state";
import { skillValues, withCharms } from "../query";
import { nearestFoe } from "../targets";

/** Nightshade's burst on death reaches this far */
const BURST_REACH = 20;

/**
 * Nightshade lays its poison in his kit; with its levels a poisoned foe that dies passes it to the nearest foe and
 * bursts on the foes beside it
 */
export const nightshadeSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    kill(_m, event) {
      const v = skillValues("t_nightshade");
      if (stacksOf(event.foe, "t_nightshade") <= 0) return;
      const [cx, cy] = enemyCenter(event.foe);
      if (v.burst)
        for (const o of game.enemies)
          if (o !== event.foe && o.hp > 0 && Math.abs(enemyCenter(o)[0] - cx) <= BURST_REACH)
            dealDamage(o, progress.stats.ap * v.burst, { fromX: cx, source: "t_nightshade" });
      if (!v.spread) return;
      const next = nearestFoe(cx, cy, [event.foe]);
      if (next) nightshade(next);
    },
  },
};

/** Open Veins lays its Bleed in his kit; with its level a bleeding foe that dies passes one stack to the nearest foe */
export const openVeinsSpread: NonNullable<SkillBehavior["on"]> = {
  kill(_m, event) {
    const v = skillValues("t_openVeins");
    if (!v.spread || stacksOf(event.foe, "t_openVeins") <= 0) return;
    const [cx, cy] = enemyCenter(event.foe);
    const next = nearestFoe(cx, cy, [event.foe]);
    if (next)
      addStacks(next, "t_openVeins", {
        stacks: 1,
        max: v.max,
        damage: progress.stats.ad * v.damage,
        every: 1,
        duration: withCharms("duration", v.life),
      });
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
