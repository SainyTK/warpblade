import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` ability power of the gale's cut, `recharge` seconds, `wounds` wounds it opens, `reach` reach multiple of the cone, `halt` seconds walkers it hits stand held, `both` it always blows both ways */
const LEVELS = levelRows([
  { text: "Learn Hot Gale: a cone of hot wind that cuts and pushes foes.", values: { power: 1.0, recharge: 4 } },
  { text: "Power 1 to 1.4.", values: { power: 1.4 } },
  { text: "New: the gale opens a wound on each foe.", values: { wounds: 1 } },
  { text: "New: the cone reaches 30% farther.", values: { reach: 1.3 } },
  { text: "New: walkers it hits stand held 1 s.", values: { halt: 1 } },
  { text: "Power 1.4 to 3.5; recharge 4 to 3 s.", values: { power: 3.5, recharge: 3 } },
  { text: "New: the gale blows both ways.", values: { both: 1 } },
  { text: "Power 3.5 to 7; two wounds.", values: { power: 7, wounds: 2 } },
]);

export const HOT_GALE: SkillDef = {
  id: "za_gale",
  name: "Hot Gale",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Learn Hot Gale on I: a cone of hot wind that cuts and pushes every foe in it. Held, it blows both ways.",
  levels: LEVELS,
  evolution: {
    partner: "za_deep",
    name: "Simoom",
    text: "Every open wound the gale meets bleeds out at once, for all it would have bled.",
    row: evolvedRow(LEVELS[7], "Every wound it meets bleeds out at once.", {}),
  },
};
