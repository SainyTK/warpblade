import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` AD a tick per stack, `max` stacks, `duration` seconds, `lungeStacks` the lunge lays,
 *  `taken` added damage a bleeding foe takes, `riposteStacks` a riposte link lays; evolved `burst` AD per stack the
 *  lunge tears out */
const LEVELS = levelRows([
  { text: "Thrusts leave a bleeding thorn: 0.1 AD a tick, up to 4.", values: { damage: 0.1, max: 4, duration: 3 } },
  { text: "Up to 4 to 6 thorns.", values: { max: 6 } },
  { text: "New: the lunge leaves 3 thorns.", values: { lungeStacks: 3 } },
  { text: "Thorns 0.1 to 0.25 AD a tick.", values: { damage: 0.25 } },
  { text: "New: bleeding foes take +15% from every source.", values: { taken: 0.15 } },
  { text: "New: riposte links leave 2 thorns.", values: { riposteStacks: 2 } },
  { text: "Up to 10 thorns, lasting 5 s.", values: { max: 10, duration: 5 } },
  { text: "Thorns 0.25 to 0.7 AD a tick.", values: { damage: 0.7 } },
]);

export const THORN_WOUNDS: SkillDef = {
  id: "ce_thorns",
  name: "Thorn Wounds",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Your thrusts leave thorns that bleed.",
  levels: LEVELS,
  evolution: {
    partner: "ce_pin",
    name: "Bloodrose",
    text: "The lunge tears every thorn out at once for 2.5 AD each.",
    row: evolvedRow(LEVELS[7], "The lunge tears every thorn out for 2.5 AD each.", { burst: 2.5 }),
  },
};
