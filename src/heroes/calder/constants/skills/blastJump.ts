import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` attack damage of the blast under the double jump, `air` more air blows per jump, `drop` attack damage of a blast where Drop cut lands, `launch` the jump blast throws foes up, `stun` seconds Drop cut's blast knocks down, `skyshot` attack damage of the round every air blow fires down */
const LEVELS = levelRows([
  { text: "The double jump fires a round down at foes under you.", values: { power: 1 } },
  { text: "Jump blast 1 to 1.5.", values: { power: 1.5 } },
  { text: "New: one more air blow per jump.", values: { air: 1 } },
  { text: "New: Drop cut lands with a blast.", values: { drop: 1.5 } },
  { text: "Jump blast 2.5; landing blast 2.5.", values: { power: 2.5, drop: 2.5 } },
  { text: "New: the jump blast throws foes up.", values: { launch: 1 } },
  { text: "New: Drop cut's blast knocks foes down.", values: { stun: 0.8 } },
  { text: "Jump blast 5; landing blast 5.", values: { power: 5, drop: 5 } },
]);

export const BLAST_JUMP: SkillDef = {
  id: "ca_blastjump",
  name: "Blast Jump",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "The double jump fires a round down, blasting foes under you.",
  levels: LEVELS,
  evolution: {
    partner: "ca_breech",
    name: "Skyshot",
    text: "Every air blow fires a round down into the foe it struck.",
    row: evolvedRow(LEVELS[7], "Every air blow fires a round down.", { skyshot: 3 }),
  },
};
