import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "A Cleave on a winding foe deals 100% more and stuns it 0.8 s.",
    values: { power: 1, stun: 0.8, mark: 0, hew: 0, elites: 0, ring: 0, shatter: 0 },
  },
  { text: "It marks the foe: +20% from all for 5 s.", values: { mark: 0.2 } },
  { text: "150% more.", values: { power: 1.5 } },
  { text: "Hew sunders too.", values: { hew: 1 } },
  { text: "Elites and mini bosses too.", values: { elites: 1 } },
  { text: "200% more.", values: { power: 2 } },
  { text: "A 40 px shatter ring, 0.8x.", values: { ring: 40 } },
  { text: "260% more; the stun lasts 1.2 s.", values: { power: 2.6, stun: 1.2 } },
]);

/** Sunder. Design: docs/skills/brannoc.md. Values: power: share more a Cleave deals to a foe caught winding up; stun: seconds it stuns that foe; mark: extra damage the foe takes from all sources for 5 s; hew: 1 Hew sunders too; elites: 1 it works on elites and mini bosses; ring: radius of a shatter ring round the foe (0 for none); shatter: radius the stunned foe bursts for, 2x attack damage (evolution) */
export const SUNDER: SkillDef = {
  id: "b_sunder",
  name: "Sunder",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "A Cleave that catches a foe winding up hits it far harder and stuns it.",
  levels: LEVELS,
  evolution: {
    partner: "b_rend",
    name: "Shatterblow",
    text: "The stunned foe bursts for 50 px, 2x.",
    row: evolvedRow(LEVELS[7], "The stunned foe bursts for 50 px, 2x.", { shatter: 50 }),
  },
};
