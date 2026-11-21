import { usesDrill } from "../../../../drill";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { guardHeld } from "./hooks";

export const drillGuardEvents: SkillBehavior = {
  create: () => ({}),
  on: {
    parry(_m, ev) {
      if (usesDrill()) {
        guardHeld("parried", ev.fromX);
      }
    },
    block(_m, ev) {
      if (usesDrill()) {
        guardHeld("blocked", ev.fromX);
      }
    },
  },
};
