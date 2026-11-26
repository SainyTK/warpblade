import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `taken` share more damage a bleeding foe takes from every source, `perWound` more per wound, `heal` HP back for each bleeding foe felled, `low` share more on a bleeding foe under a third of its HP, `burst` wounds a bleeding foe felled opens on each foe beside it, `hawk` a bleeding foe felled calls a desert hawk */
const LEVELS = levelRows([
  { text: "Bleeding foes take 8% more from everything.", values: { taken: 0.08 } },
  { text: "New: 3% more for each wound.", values: { perWound: 0.03 } },
  { text: "Taken 8% to 12%.", values: { taken: 0.12 } },
  { text: "New: a bleeding foe you fell gives back 2 HP.", values: { heal: 2 } },
  { text: "Per wound 3% to 5%.", values: { perWound: 0.05 } },
  { text: "New: a bleeding foe under a third of its HP takes 25% more.", values: { low: 0.25 } },
  { text: "New: a bleeding foe you fell bursts, opening two wounds on foes beside it.", values: { burst: 2 } },
  { text: "Taken 12% to 35%; per wound 12%; 4 HP back.", values: { taken: 0.35, perWound: 0.12, heal: 4 } },
]);

export const DESERT_THIRST: SkillDef = {
  id: "za_thirst",
  name: "Desert Thirst",
  kind: "dot",
  element: "venom",
  risk: "timed",
  button: "auto",
  text: "Bleeding foes take more from everything, more for each wound; felling them gives back HP.",
  levels: LEVELS,
  evolution: {
    partner: "za_hawk",
    name: "Thirst of the Hawk",
    text: "Every bleeding foe you fell calls a desert hawk at once.",
    row: evolvedRow(LEVELS[7], "Every bleeding foe felled calls a hawk.", { hawk: 1 }),
  },
};
