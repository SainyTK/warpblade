import type { SkillBehavior } from "../../../../types/skillBehavior";
import { passWounds } from "./lingeringQi";

export const lingeringQiDrill: SkillBehavior = {
  create: () => ({}),
  on: {
    kill(_m, e) {
      passWounds(e.foe);
    },
  },
};
