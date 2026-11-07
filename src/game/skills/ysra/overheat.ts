import type { SkillBehavior } from "../../../types/skillBehavior";
import { extendOverheat } from "../../hero/ysra/pyre/heat";
import { skillValues } from "../query";

/** Overheat: each kill while it burns holds it longer */
export const overheat: SkillBehavior = {
  create: () => ({}),
  on: {
    kill() {
      const more = skillValues("y_overheat").perKill ?? 0;
      if (more) extendOverheat(more);
    },
  },
};
