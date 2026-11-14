import { skillValues } from "../../../../game/skills/query";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { gainPoints } from "../points";

/** Passing Touch: a perfect dodge gives Points */
export const passingTouch: SkillBehavior = {
  create: () => ({}),
  on: {
    perfectDodge() {
      gainPoints(skillValues("ce_step").perfectPoints ?? 0);
    },
  },
};
