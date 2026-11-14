import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` AD of the echo's cleave on the foe it is aimed at, `chance` a parry or perfect dodge calls it,
 *  `both` perfect dodges call it too, `heavy` heavy swings call it at this chance, `cooldown` least seconds between
 *  calls, `cuts` cleaves it swings, `ring` foes beside the attacker take this share, `twin` echoes on both sides */
const LEVELS = levelRows([
  {
    text: "A parry may call a crimson echo of her that cleaves the attacker.",
    values: { power: 3, chance: 0.5, cooldown: 1, cuts: 1 },
  },
  { text: "New: its cleave also hits foes beside the attacker; chance 100%.", values: { chance: 1, ring: 0.5 } },
  { text: "New: perfect dodges call it too.", values: { both: 1 } },
  { text: "Echo power 3 to 6 AD.", values: { power: 6 } },
  { text: "New: the echo swings twice.", values: { cuts: 2 } },
  { text: "New: Keen blows call it 25% of the time.", values: { heavy: 0.25 } },
  { text: "Echo power 6 to 10 AD.", values: { power: 10 } },
  { text: "Echo power 10 to 30 AD.", values: { power: 30 } },
]);

export const ECHO_SWING: SkillDef = {
  id: "br_echo",
  name: "Echo Swing",
  kind: "summon",
  risk: "precise",
  button: "auto",
  text: "A parry calls a crimson echo of her behind the attacker that brings down a heavy cleave.",
  levels: LEVELS,
  evolution: {
    partner: "br_counter",
    name: "Twin Echo",
    text: "Two echoes, one on each side, and each cleave hits half again as hard.",
    row: evolvedRow(LEVELS[7], "Two echoes, each half again as hard.", { twin: 1, power: 45 }),
  },
};
