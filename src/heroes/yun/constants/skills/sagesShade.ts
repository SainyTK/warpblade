import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` attack damage of each of the shade's cuts on its foe, `cuts` how many, `dodge` perfect dodges call it too, `sword` its last cut gives a spirit sword, `mark` extra damage its foe takes for 3 s */
const LEVELS = levelRows([
  { text: "A parry calls your shade behind the attacker for one heavy cut.", values: { power: 1.5, cuts: 1 } },
  { text: "Shade power 1.5 to 2.", values: { power: 2 } },
  { text: "New: perfect dodges call it too.", values: { dodge: 1 } },
  { text: "Shade power 2 to 2.6.", values: { power: 2.6 } },
  { text: "New: the shade cuts twice.", values: { cuts: 2 } },
  { text: "Shade power 2.6 to 3.2.", values: { power: 3.2 } },
  { text: "New: the shade's last cut gives a spirit sword.", values: { sword: 1 } },
  { text: "New: its foe takes 25% more damage for 3 s; power 4.", values: { mark: 0.25, power: 4 } },
]);

export const SAGES_SHADE: SkillDef = {
  id: "yu_shade",
  name: "Sage's Shade",
  kind: "summon",
  risk: "precise",
  button: "K",
  text: "A parry calls your shade behind the attacker for a heavy cut.",
  levels: LEVELS,
  evolution: {
    partner: "yu_needle",
    name: "Many Shades",
    text: "The shade cuts three times at half again the power.",
    row: evolvedRow(LEVELS[7], "Three cuts; power 6.", { cuts: 3, power: 6 }),
  },
};
