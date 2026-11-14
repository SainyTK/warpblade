import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` added sweep power (AD), `reach` added pixels ahead, `behind` the sweep also cuts behind, `drag` the
 *  sweep pulls foes in, `tall` it reaches flyers overhead, `mark` foes it strikes take this much more for `markTime`
 *  seconds, `wave` crescents both ways at this power (AD) */
const LEVELS = levelRows([
  { text: "The sweep hits harder and reaches 10 px farther.", values: { power: 0.4, reach: 10 } },
  { text: "New: the sweep cuts behind her too.", values: { behind: 1 } },
  { text: "Reach +10 to +20 px.", values: { reach: 20 } },
  { text: "New: the sweep drags foes in toward her.", values: { drag: 1 } },
  { text: "Sweep power +0.4 to +1.2.", values: { power: 1.2 } },
  { text: "New: the sweep reaches flying foes overhead.", values: { tall: 1 } },
  { text: "New: foes it strikes take +25% for 2 s.", values: { mark: 0.25, markTime: 2 } },
  { text: "Sweep power +1.2 to +2.2; reach +30 px.", values: { power: 2.2, reach: 30 } },
]);

export const WIDE_ARC: SkillDef = {
  id: "br_cleave",
  name: "Wide Arc",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The opening sweep reaches farther, cuts behind and drags the crowd into the string.",
  levels: LEVELS,
  evolution: {
    partner: "br_launch",
    name: "Horizon Cleave",
    text: "The sweep throws a crimson crescent both ways along its arc.",
    row: evolvedRow(LEVELS[7], "The sweep throws crescents both ways.", { wave: 1 }),
  },
};
