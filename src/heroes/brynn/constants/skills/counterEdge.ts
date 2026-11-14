import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` added Counter Cleave power (AD) on the foe that struck, `reach` added pixels, `crit` it is a sure
 *  crit, `heft` added Heft, `wave` a crescent ahead at this power (AD), `after` her next `afterBlows` swings deal
 *  this much more, `blockCleave` a block also answers with a cleave at this share */
const LEVELS = levelRows([
  { text: "The Counter Cleave hits the attacker 1.5 AD harder.", values: { power: 1.5 } },
  { text: "New: it reaches 12 px farther.", values: { reach: 12 } },
  { text: "New: it is a sure crit.", values: { crit: 1 } },
  { text: "Counter power +1.5 to +7.", values: { power: 7 } },
  { text: "New: a parry gives 20 more Heft.", values: { heft: 20 } },
  { text: "New: it throws a crescent ahead.", values: { wave: 2 } },
  { text: "New: her next 2 swings after a parry deal +50%.", values: { after: 0.5, afterBlows: 2 } },
  { text: "Counter power +7 to +25; the crescent hits harder.", values: { power: 25, wave: 5 } },
]);

export const COUNTER_EDGE: SkillDef = {
  id: "br_counter",
  name: "Counter Edge",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "Parry: the Counter Cleave hits the attacker far harder.",
  levels: LEVELS,
  evolution: {
    partner: "br_ironskin",
    name: "Iron Answer",
    text: "A block also answers with a Counter Cleave at half its power.",
    row: evolvedRow(LEVELS[7], "A block also answers with a half-power cleave.", { blockCleave: 0.5 }),
  },
};
