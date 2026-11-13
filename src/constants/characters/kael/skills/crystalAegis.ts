import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `plates` crystals the guard holds, `shard` attack power of each crystal in the shatter, `reach` pixels round
 *  the attacker the shatter reaches, `half` share of the block's stamina cost, `parryPlate` a parry sets one more,
 *  `freeze` seconds the shatter freezes, `sealed` blocks let nothing through, `reflect` attack power of the lance a
 *  block sends back, `launch` how hard the shatter throws foes up */
const LEVELS = levelRows([
  {
    text: "Blocked blows set crystals in the guard; a parry shatters them at the attacker.",
    values: { plates: 3, shard: 1.2, reach: 36 },
  },
  { text: "New: blocks cost half the stamina.", values: { half: 0.5 } },
  { text: "Shatter 1.2 to 2 a crystal; the guard holds 4.", values: { shard: 2, plates: 4 } },
  { text: "New: a parry sets one more crystal before the shatter.", values: { parryPlate: 1 } },
  { text: "New: the shatter freezes what it hits for 1 s.", values: { freeze: 1 } },
  { text: "New: blocked blows let no damage through.", values: { sealed: 1 } },
  { text: "Shatter 2 to 3.5 a crystal; the guard holds 6.", values: { shard: 3.5, plates: 6 } },
  { text: "Shatter 3.5 to 6 a crystal; reach 36 to 56 px.", values: { shard: 6, reach: 56 } },
]);

export const CRYSTAL_AEGIS: SkillDef = {
  id: "k_aegis",
  name: "Crystal Aegis",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "Every blow Kael blocks sets a crystal in his guard, and his next parry shatters them all at the attacker.",
  levels: LEVELS,
  evolution: {
    partner: "k_mirror",
    name: "Diamond Aegis",
    text: "Every blocked blow also throws a crystal lance back at the attacker, and the shatter throws foes high.",
    row: evolvedRow(LEVELS[7], "Blocks throw a lance back; the shatter launches.", { reflect: 2, launch: -260 }),
  },
};
