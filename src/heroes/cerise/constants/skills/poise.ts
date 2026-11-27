import { PACT } from "../../../../constants/vitals";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** stats: crit chance. values: `most` Points over five, `full` added damage while the bar is full, `heal` HP a full
 *  five-Point lunge heals; evolved `refund` Points a full lunge gives back */
const NATIVE = levelRows([
  { text: "Crit chance +4%.", stats: { crit: 0.04 } },
  { text: "New: hold one more Point.", values: { most: 1 } },
  { text: "Crit chance +4% to +8%.", stats: { crit: 0.08 } },
  { text: "New: +15% damage while the Points bar is full.", values: { full: 0.15 } },
  { text: "Crit chance +8% to +12%.", stats: { crit: 0.12 } },
  { text: "New: hold two more Points.", values: { most: 2 } },
  { text: "New: a lunge of five Points or more heals 8 HP.", values: { heal: 8 } },
  { text: "Crit chance +12% to +20%; full bar +40%.", stats: { crit: 0.2 }, values: { full: 0.4 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "One more air dash; crit chance +4%.", drill: { airDashes: 1, empower: 0 } },
  { text: "New: untouchable while dashing.", drill: { untouchable: 1 } },
  { text: "New: an air dash restores the air thrust; crit chance +8%.", drill: { airReset: 1 } },
  { text: "Two more air dashes.", drill: { airDashes: 2 } },
  { text: "New: the first thrust after a dash deals +50%; crit chance +12%.", drill: { empower: 0.5 } },
  { text: "Thrust after a dash +50% to +100%.", drill: { empower: 1 } },
  { text: "Three more air dashes.", drill: { airDashes: 3 } },
  { text: "Thrust after a dash +100% to +200%; crit chance +20%.", drill: { empower: 2 } },
]);

export const POISE: SkillDef = {
  id: "ce_poise",
  name: "Poise",
  kind: "movement",
  element: "frost",
  risk: "easy",
  button: "L",
  pact: PACT.mending,
  text: "More air dashes, an untouchable dash, and a stronger thrust after it.",
  levels: LEVELS,
  evolution: {
    partner: "ce_lunge",
    name: "Perfect Poise",
    text: "Every dash readies the warp strike.",
    row: evolvedRow(LEVELS[7], "Every dash readies the warp strike.", {
      ...drillValues({ poised: 1 }),
      refund: 3,
    }),
  },
};
