import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: `store` the factor on what draw cuts store, `reach` px they gain, `guard` the return cut breaks guards, `wave` attack
 *  damage of the ink cut a breath draw sends ahead (stored in each foe it meets), `crit` a breath draw is a sure crit */
const LEVELS = levelRows([
  { text: "Draw cuts store +40%.", values: { store: 1.4 } },
  { text: "New: draw cuts reach 8 px farther.", values: { reach: 8 } },
  { text: "New: return cuts break guards too.", values: { guard: 1 } },
  { text: "Draw store +40% to +100%.", values: { store: 2 } },
  { text: "New: a draw with a breath sends an ink cut ahead that stores in each foe.", values: { wave: 1.2 } },
  { text: "Draw store +100% to +160%; reach 8 to 14 px.", values: { store: 2.6, reach: 14 } },
  { text: "New: a draw with a breath is a sure critical hit.", values: { crit: 1 } },
  { text: "Draw store +160% to +300%; the ink cut stores far more.", values: { store: 4, wave: 4 } },
]);

export const HONED_DRAW: SkillDef = {
  id: SKILL.edge,
  name: "Honed Draw",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Draw cuts store more in the foe and reach farther. Spend a breath on a draw for more.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.clean,
    name: "Moonlit Draw",
    text: "Every draw cut sends the ink cut ahead, and a draw with a breath stores twice as much.",
    row: evolvedRow(LEVELS[7], "Every draw sends the ink cut; a breath draw stores double.", {
      waveAlways: 1,
      breathStore: 2,
    }),
  },
};
