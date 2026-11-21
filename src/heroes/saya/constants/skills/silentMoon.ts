import { ULT_CHARGE } from "../../../../constants/ultimate";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values: `power` the factor on each line's burst, `cooldown` s, `charge` charging speed, `lines` lines added,
 *  `stored` the factor on the stored cuts its click releases, `mark` damage-taken mark on foes it strikes for 4 s,
 *  `twice` the lines burst a second time */
const LEVELS = levelRows([
  { text: "Silent Moon's lines burst 30% harder.", values: { power: 1.3 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: two more lines.", values: { lines: 2 } },
  { text: "Power +30% to +40%.", values: { power: 1.4 } },
  { text: "New: its click releases stored cuts at double.", values: { stored: 2 } },
  { text: "New: foes it strikes take +30% damage for 4 s.", values: { mark: 0.3 } },
  { text: "Power +40% to +50%.", values: { power: 1.5 } },
  { text: "New: two more lines; power +50% to +60%.", values: { lines: 4, power: 1.6 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "Charged skills +30%.", drill: { damage: 0.3 } },
  { text: "New: charging is 15% faster.", drill: { rate: 1.15 } },
  { text: "New: a charged skill stores 1x AP in every foe it strikes.", drill: { store: 1 } },
  { text: "Charged skills +30% to +80%.", drill: { damage: 0.8 } },
  { text: "New: charged skills reach 20% farther.", drill: { reach: 0.2 } },
  { text: "Charged skills +80% to +150%.", drill: { damage: 1.5 } },
  { text: "New: a charged skill releases every stored cut.", drill: { release: 1 } },
  { text: "Charged skills +150% to +250%.", drill: { damage: 2.5 } },
]);

export const SILENT_MOON_SKILL: SkillDef = {
  id: SKILL.moon,
  name: "Silent Moon",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Silent Moon grows: more lines, harder bursts, and its click doubles stored cuts. Grows with attack damage. ${ULT_CHARGE}`,
  levels: DRILL,
  evolution: {
    partner: SKILL.clean,
    name: "New Moon",
    text: "Every charged skill releases twice in full.",
    row: evolvedRow(DRILL[7], "Every charged skill releases twice in full.", {
      ...drillValues({ echo: 1 }),
      twice: 1,
    }),
  },
};
