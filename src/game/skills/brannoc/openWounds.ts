import { BLEED_SPREAD } from "../../../constants/brannoc/skills";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { enemyCenter } from "../../enemies/enemy";
import { addStacks } from "../../enemies/skillStatus";
import { skillValues, withCharms } from "../query";
import { distance2, nearestFoe } from "../targets";

const ID = "b_bleed";

/**
 * Open Wounds: his kit lays the bleed and Bleed Dry. With its spread, a foe that dies bleeding passes its stacks to the
 * nearest living foe close by, as they were: their count, their tick and the time they had left.
 */
export const openWoundsSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    kill(_m, event) {
      if (!skillValues(ID).spread) return;
      const entry = event.foe.stacks.find((s) => s.source === ID);
      if (!entry || entry.stacks <= 0) return;
      const [x, y] = enemyCenter(event.foe);
      const next = nearestFoe(x, y, [event.foe]);
      const reach = withCharms("area", BLEED_SPREAD);
      if (!next || distance2(next, x, y) > reach * reach) return;
      const held = next.stacks.find((s) => s.source === ID);
      addStacks(next, ID, {
        stacks: entry.stacks,
        max: entry.max,
        damage: entry.damage,
        every: entry.every,
        duration: Math.max(entry.left, held?.left ?? 0),
      });
    },
  },
};
