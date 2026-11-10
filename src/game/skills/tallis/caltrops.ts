import type { SkillBehavior } from "../../../types/skillBehavior";
import { thornRoad } from "../../hero/tallis/spells/caltrops";

/** Caltrops is a spell in his kit; once evolved, every Sink path leaves caltrops along it (Thorn Road) */
export const caltropsSkill: SkillBehavior = {
  create: () => ({}),
  on: {
    sink(_m, event) {
      thornRoad(event.from, event.to);
    },
  },
};
