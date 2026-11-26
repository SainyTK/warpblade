import { drillOnly } from "../../../../drill";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { guardHeld } from "./hooks";

export const drillGuardEvents: SkillBehavior = drillOnly({
  create: () => ({}),
  on: {
    parry(_m, ev) {
      guardHeld("parried", ev.fromX);
    },
    block(_m, ev) {
      guardHeld("blocked", ev.fromX);
    },
  },
});
