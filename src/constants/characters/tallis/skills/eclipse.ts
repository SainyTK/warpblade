import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Strike every foe in reach from behind, then the Veil.",
    values: { power: 1, hits: 1, stun: 0, refill: 0, stage: 0 },
  },
  { text: "Stabs deal 1.3x.", values: { power: 1.3 } },
  { text: "Each foe is struck twice.", values: { hits: 2 } },
  { text: "Struck minions lie stunned 1 s.", values: { stun: 1 } },
  { text: "Stabs deal 1.6x.", values: { power: 1.6 } },
  { text: "Gloam refills in full.", values: { refill: 1 } },
  { text: "Stabs deal 2x.", values: { power: 2 } },
  { text: "Stabs deal 3x.", values: { power: 3 } },
]);

/** Eclipse. Design: docs/skills/tallis.md. Values: power: share of the level's power each stab deals, as Gloaming's; hits: stabs on each foe; stun: seconds struck minions lie stunned; refill: 1 Gloam refills in full; stage: 1 the whole stage is in reach (evolution) */
export const ECLIPSE: SkillDef = {
  id: "t_eclipse",
  name: "Eclipse",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Replaces Gloaming: the sun goes dark and he strikes every foe in reach from behind, then the Veil comes on.",
  ultimate: "eclipse",
  levels: LEVELS,
  evolution: {
    partner: "t_shroud",
    name: "Night Without End",
    text: "The whole stage goes dark, and every foe on it is struck three times.",
    row: evolvedRow(LEVELS[7], "The whole stage; every foe struck 3 times.", { stage: 1, hits: 3, power: 4 }),
  },
};
