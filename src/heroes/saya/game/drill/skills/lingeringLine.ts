import { addStacks } from "../../../../../game/enemies/skillStatus";
import { progress } from "../../../../../game/state";
import { SKILL } from "../../../constants/skills/ids";
import type { SayaDrillSkill } from "../../../types/drillSkill";

const EVERY = 0.5;

export const LINGERING_LINE_DRILL: SayaDrillSkill = {
  id: SKILL.trail,
  store(_blow, { values }) {
    return values.store ?? 0;
  },
  swordHit(foe, _blow, infusion, { values, evolved }) {
    if (!infusion && !evolved) {
      return;
    }
    addStacks(foe, SKILL.trail, {
      stacks: 1,
      max: values.stacks ?? 1,
      damage: progress.stats.ap * values.bleed,
      every: EVERY,
      duration: values.time,
    });
  },
};
