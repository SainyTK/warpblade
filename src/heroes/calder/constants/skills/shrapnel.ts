import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` attack damage a tick per stack, `max` stacks a foe can carry, `stacks` laid by one blast, `pass` a fallen foe's shrapnel passes to the nearest foe, `rip` attack damage per stack Breaker tears out, `burst` attack damage per stack of a detonation in 30 px once a foe carries `at` stacks */
const LEVELS = levelRows([
  { text: "Every round's blast leaves bleeding shrapnel.", values: { damage: 0.05, max: 5, stacks: 1 } },
  { text: "Bleed 0.05 to 0.08.", values: { damage: 0.08 } },
  { text: "New: each blast lays two stacks.", values: { stacks: 2 } },
  { text: "New: a fallen foe's shrapnel passes to the nearest foe.", values: { pass: 1 } },
  { text: "Bleed 0.15; up to 8 stacks.", values: { damage: 0.15, max: 8 } },
  { text: "New: Breaker tears the shrapnel out at once.", values: { rip: 0.5 } },
  { text: "New: up to 12 stacks.", values: { max: 12 } },
  { text: "Bleed 0.15 to 0.3.", values: { damage: 0.3 } },
]);

export const SHRAPNEL: SkillDef = {
  id: "ca_shrapnel",
  name: "Shrapnel",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Every round's blast leaves shrapnel that bleeds the foes it struck.",
  levels: LEVELS,
  evolution: {
    partner: "ca_vent",
    name: "Shrapnel Storm",
    text: "A blast on a foe carrying 6 stacks or more detonates them all round it.",
    row: evolvedRow(LEVELS[7], "Six stacks or more detonate on the next blast.", { burst: 1.2, at: 6 }),
  },
};
