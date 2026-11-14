import { skillValues } from "../../../../game/skills/query";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { zafir } from "../state";

/** Sand Slip from level 5: a perfect dodge fills the Whirl to its top ring; the dodge's cut and cloud are in the kit */
export const sandSlip: SkillBehavior = {
  create: () => ({}),
  on: {
    perfectDodge() {
      const fill = skillValues("za_slip").perfectWhirl;
      if (!fill) return;
      zafir.whirl = Math.max(zafir.whirl, fill);
      zafir.whirlIdle = 0;
    },
  },
};
