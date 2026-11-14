import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** stats: crit chance. values: `most` Points over five, `full` added damage while the bar is full, `heal` HP a full
 *  five-Point lunge heals; evolved `refund` Points a full lunge gives back */
const LEVELS = levelRows([
  { text: "Crit chance +4%.", stats: { crit: 0.04 } },
  { text: "New: hold one more Point.", values: { most: 1 } },
  { text: "Crit chance +4% to +8%.", stats: { crit: 0.08 } },
  { text: "New: +15% damage while the Points bar is full.", values: { full: 0.15 } },
  { text: "Crit chance +8% to +12%.", stats: { crit: 0.12 } },
  { text: "New: hold two more Points.", values: { most: 2 } },
  { text: "New: a lunge of five Points or more heals 8 HP.", values: { heal: 8 } },
  { text: "Crit chance +12% to +20%; full bar +40%.", stats: { crit: 0.2 }, values: { full: 0.4 } },
]);

export const POISE: SkillDef = {
  id: "ce_poise",
  name: "Poise",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "More crits, more Points, and a full bar hits harder.",
  levels: LEVELS,
  evolution: {
    partner: "ce_lunge",
    name: "Perfect Poise",
    text: "A lunge of five Points or more gives 3 Points back.",
    row: evolvedRow(LEVELS[7], "A full lunge gives 3 Points back.", { refund: 3 }),
  },
};
