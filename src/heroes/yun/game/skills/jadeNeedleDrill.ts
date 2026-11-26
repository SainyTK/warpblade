import { skillValues } from "../../../../game/skills/query";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { jadeNeedle, needleFoe } from "./jadeNeedle";

export const jadeNeedleDrill: SkillBehavior = {
  create: () => ({}),
  on: {
    ...jadeNeedle.on,
    blow(_m, e) {
      if (e.keen && skillValues(SKILL.needle).keen) needleFoe(e.foe);
    },
  },
};
