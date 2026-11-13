import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Gloaming visits one more foe; stabs deal 1.25x.",
    values: { power: 1.25, more: 1, hits: 1, veil: 0, stun: 0, refill: 0, smoke: 0, stage: 0 },
  },
  { text: "He returns veiled for 2 s; his next blow is an Ambush.", values: { veil: 2 } },
  { text: "Each foe is struck twice.", values: { hits: 2 } },
  { text: "Struck minions lie stunned 1 s.", values: { stun: 1 } },
  { text: "Two more foes; stabs deal 1.6x.", values: { more: 2, power: 1.6 } },
  { text: "Gloam refills in full.", values: { refill: 1 } },
  { text: "A Smoke Knot rises where he returns; 2x.", values: { smoke: 1, power: 2 } },
  { text: "Each foe is struck three times.", values: { hits: 3 } },
]);

/** Gloaming. Design: docs/skills/tallis.md. Values: power: share of the charge level's power each stab deals; more: foes visited more at every charge level; hits: stabs on each foe; veil: seconds of free Veil he returns in, his next blow an Ambush; stun: seconds struck minions lie stunned; refill: 1 Gloam refills in full; smoke: 1 a Smoke Knot rises where he returns; stage: 1 every foe on the stage is visited (evolution) */
export const GLOAMING: SkillDef = {
  id: "t_gloaming",
  name: "Gloaming",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "His Gloaming visits more foes, strikes each more often and leaves him in the Veil.",
  levels: LEVELS,
  evolution: {
    partner: "t_shroud",
    name: "Night Without End",
    text: "The whole stage goes dark, and every foe on it is struck four times.",
    row: evolvedRow(LEVELS[7], "The whole stage; every foe struck 4 times.", { stage: 1, hits: 4, power: 3.75 }),
  },
};
