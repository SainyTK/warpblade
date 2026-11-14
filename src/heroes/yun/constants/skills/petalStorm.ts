import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` multiplies the air cuts, `air` air cuts added per jump, `wave` power of the qi wave Falling Petal sends, `sword` the first air cut that lands each jump gives a spirit sword, `airEcho` echo thrusts per sword after an air cut, `crit` air cuts are sure critical hits */
const LEVELS = levelRows([
  { text: "Air cuts hit 30% harder.", values: { power: 1.3 } },
  { text: "Air power +30% to +60%.", values: { power: 1.6 } },
  { text: "New: a third air cut each jump.", values: { air: 1 } },
  { text: "Air power +60% to +90%.", values: { power: 1.9 } },
  { text: "New: Falling Petal sends a qi wave ahead.", values: { wave: 0.8 } },
  { text: "New: the first air cut that lands each jump gives a spirit sword.", values: { sword: 1 } },
  { text: "Air power +90% to +130%.", values: { power: 2.3 } },
  { text: "New: air cuts are echoed twice; power +160%.", values: { airEcho: 2, power: 2.6 } },
]);

export const PETAL_STORM: SkillDef = {
  id: "yu_petal",
  name: "Petal Storm",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The air string grows: harder cuts, a third cut, a qi wave and spirit swords.",
  levels: LEVELS,
  evolution: {
    partner: "yu_cloud",
    name: "Blossom Fall",
    text: "Four air cuts a jump, every one a sure critical hit.",
    row: evolvedRow(LEVELS[7], "Four air cuts; all critical.", { air: 2, crit: 1 }),
  },
};
