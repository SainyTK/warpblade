import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

/** values: `power` attack damage of each of the shade's cuts on its foe, `cuts` how many, `dodge` perfect dodges call it too, `sword` its last cut gives a spirit sword, `mark` extra damage its foe takes for 3 s */
const LEVELS = levelRows([
  { text: "A parry calls your shade behind the attacker for one heavy cut.", values: { power: 4, cuts: 1 } },
  { text: "Shade power 4 to 6.", values: { power: 6 } },
  { text: "New: perfect dodges call it too.", values: { dodge: 1 } },
  { text: "Shade power 6 to 9.", values: { power: 9 } },
  { text: "New: the shade cuts twice.", values: { cuts: 2 } },
  { text: "Shade power 9 to 13.", values: { power: 13 } },
  { text: "New: the shade's last cut gives a spirit sword.", values: { sword: 1 } },
  { text: "New: its foe takes 25% more damage for 3 s; power 20.", values: { mark: 0.25, power: 20 } },
]);

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "A parry calls your shade behind the attacker for one heavy cut.", drill: {} },
  { text: "Shade power 4 to 6.", drill: {} },
  { text: "New: perfect dodges call it too.", drill: {} },
  { text: "Shade power 6 to 9.", drill: {} },
  { text: "New: the shade cuts twice.", drill: {} },
  { text: "Shade power 9 to 13.", drill: {} },
  { text: "New: the shade's last cut recharges the warp.", drill: { warp: 1 } },
  { text: "New: its foe takes 25% more damage for 3 s; power 20.", drill: {} },
]);

export const SAGES_SHADE: SkillDef = {
  id: "yu_shade",
  name: "Sage's Shade",
  kind: "summon",
  element: "void",
  risk: "precise",
  button: "K",
  text: "A parry calls your shade behind the attacker for a heavy cut.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_needle",
    name: "Many Shades",
    text: "The shade cuts three times at half again the power.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Three cuts; power 30.", { cuts: 3, power: 30 }),
      "Three cuts; power 30.",
      {},
    ),
  },
};
