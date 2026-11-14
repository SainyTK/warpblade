import { ULT_CHARGE } from "../../../../constants/ultimate";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: `power` the factor on each line's burst, `cooldown` s, `charge` charging speed, `lines` lines added,
 *  `stored` the factor on the stored cuts its click releases, `mark` damage-taken mark on foes it strikes for 4 s,
 *  `twice` the lines burst a second time */
const LEVELS = levelRows([
  { text: "Silent Moon's lines burst 30% harder.", values: { power: 1.3 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: two more lines.", values: { lines: 2 } },
  { text: "Power +30% to +80%.", values: { power: 1.8 } },
  { text: "New: its click releases stored cuts at double.", values: { stored: 2 } },
  { text: "New: foes it strikes take +30% damage for 4 s.", values: { mark: 0.3 } },
  { text: "Power +80% to +150%.", values: { power: 2.5 } },
  { text: "New: four more lines; power +150% to +250%.", values: { lines: 6, power: 3.5 } },
]);

export const SILENT_MOON_SKILL: SkillDef = {
  id: SKILL.moon,
  name: "Silent Moon",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Silent Moon grows: more lines, harder bursts, and its click doubles stored cuts. Grows with attack damage. ${ULT_CHARGE}`,
  levels: LEVELS,
  evolution: {
    partner: SKILL.clean,
    name: "New Moon",
    text: "Every line bursts a second time a beat after the first.",
    row: evolvedRow(LEVELS[7], "The lines burst twice.", { twice: 1 }),
  },
};
