import { markFoe } from "../../../../game/enemies/skillStatus";
import { skillValues, withCharms } from "../../../../game/skills/query";
import type { SkillBehavior } from "../../../../types/skillBehavior";

const ID = "br_cleave";

/** Wide Arc: foes the sweep strikes take more from every source for a while; the rest of it shapes the sweep in the
 *  kit */
export const wideArc: SkillBehavior = {
  create: () => ({}),
  on: {
    blow(_m, e) {
      const v = skillValues(ID);
      if (e.move !== "sweep" || !v.mark) return;
      markFoe(e.foe, ID, withCharms("duration", v.markTime), v.mark);
    },
  },
};
