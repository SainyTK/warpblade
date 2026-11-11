import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  { text: "Roll strikes three times.", values: { strikes: 3, power: 0, chain: 0, shred: 0, crescendo: 0, blast: 0 } },
  { text: "Roll strikes deal 20% more.", values: { power: 0.2 } },
  { text: "Each Roll strike chains to a second foe, 0.4x.", values: { chain: 0.4 } },
  { text: "Roll strikes four times.", values: { strikes: 4 } },
  { text: "Roll breaks guards.", values: { shred: 1 } },
  { text: "Roll strikes deal 50% more.", values: { power: 0.5 } },
  { text: "At Crescendo Roll strikes six times.", values: { crescendo: 1 } },
  { text: "Roll strikes 90% more; chains 0.7x.", values: { power: 0.9, chain: 0.7 } },
]);

/** Paradiddle. Design: docs/skills/jory.md. Values: strikes: times Roll strikes; power: share more each Roll strike deals; chain: attack damage each strike deals to the next foe within 40 px; shred: 1 Roll breaks guards; crescendo: 1 Roll strikes six times at Crescendo; blast: 1 Roll is an eight strike flurry that draws minions in (evolution) */
export const PARADIDDLE: SkillDef = {
  id: "j_paradiddle",
  name: "Paradiddle",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Roll, the second blow of his string, strikes more times.",
  levels: LEVELS,
  evolution: {
    partner: "j_stepTouch",
    name: "Blast Beat",
    text: "Roll is an eight hit flurry that draws minions within 30 px in.",
    row: evolvedRow(LEVELS[7], "Roll is an 8 hit flurry that draws minions in.", { blast: 1 }),
  },
};
