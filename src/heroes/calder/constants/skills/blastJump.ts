import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillLevels";

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

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "One more air cut per jump.", drill: { air: 1 } },
  { text: "New: a jump blasts the floor under you.", drill: { blast: 0.6 } },
  { text: "New: the blast staggers.", drill: { stagger: 0.3 } },
  { text: "Blast 0.6 to 1.2 AD.", drill: { blast: 1.2 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "Blast 1.2 to 2.4 AD.", drill: { blast: 2.4 } },
  { text: "New: a third air cut.", drill: { air: 2 } },
  { text: "Blast 2.4 to 5 AD.", drill: { blast: 5 } },
]);

export const BLAST_JUMP: SkillDef = {
  id: "ca_blastjump",
  name: "Blast Jump",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "One more air cut, and jumps blast off the floor.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_breech",
    name: "Skyshot",
    text: "Landing from a long fall blasts everything within 70 px.",
    row: evolvedRow(DRILL_LEVELS[7], "Hard landings blast 70 px.", {
      ...drillValues({ land: 4 }),
      skyshot: 3,
    }),
  },
};
