import type { SkillBehavior } from "../../../types/skillBehavior";
import { jory } from "../../hero/jory/memory";
import { hero, progress } from "../../state";
import { skillValues } from "../query";

const ID = "j_encore";
/** Standing Ovation: every this many on-beat presses heals this share of his HP */
const OVATION = { every: 8, heal: 0.02 } as const;

/** Encore's Standing Ovation; its softer costs, wider window and shrugged blows live in his kit */
export const encoreSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    beat(_m, event) {
      if (!event.onBeat || !skillValues(ID).ovation || jory.onBeats % OVATION.every !== 0) return;
      hero.hp = Math.min(progress.stats.hp, hero.hp + progress.stats.hp * OVATION.heal);
    },
  },
};
