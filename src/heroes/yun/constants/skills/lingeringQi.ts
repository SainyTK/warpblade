import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` attack damage a wound deals each tick per stack, `max` stacks, `blade` the string's own blows lay wounds, `chill` seconds a wound slows, `spread` a foe that dies wounded passes its wounds on, `burst` attack damage per stack when a foe reaches its most */
const LEVELS = levelRows([
  { text: "Echo thrusts leave qi wounds that cut over time.", values: { damage: 0.04, max: 3 } },
  { text: "Wound damage 0.04 to 0.06.", values: { damage: 0.06 } },
  { text: "New: wounds stack to 6.", values: { max: 6 } },
  { text: "Wound damage 0.06 to 0.08.", values: { damage: 0.08 } },
  { text: "New: the string's own blows lay wounds too.", values: { blade: 1 } },
  { text: "Wound damage 0.08 to 0.11.", values: { damage: 0.11 } },
  { text: "New: wounded foes are slowed.", values: { chill: 0.6 } },
  { text: "New: a foe that dies wounded passes its wounds on; damage 0.14.", values: { spread: 1, damage: 0.14 } },
]);

export const LINGERING_QI: SkillDef = {
  id: "yu_wound",
  name: "Lingering Qi",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Echo thrusts leave qi wounds that cut foes over time.",
  levels: LEVELS,
  evolution: {
    partner: "yu_fan",
    name: "Qi Burst",
    text: "Wounds burst when a foe carries the most it can, for 0.8 attack damage a stack.",
    row: evolvedRow(LEVELS[7], "Full wounds burst.", { burst: 0.8 }),
  },
};
