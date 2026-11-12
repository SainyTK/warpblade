import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Bloodied blows mark a foe; in 2 s it bursts for 1.5x what it stored.",
    values: { store: 1.5, fuse: 2, repay: 0, spread: 0, bosses: 0, bloom: 0 },
  },
  { text: "2x what it stored.", values: { store: 2 } },
  { text: "A burst repays 5% of max HP.", values: { repay: 0.05 } },
  { text: "2.5x.", values: { store: 2.5 } },
  { text: "The burst spreads 30 px at half.", values: { spread: 30 } },
  { text: "The fuse is 1.5 s.", values: { fuse: 1.5 } },
  { text: "Mini bosses and bosses too.", values: { bosses: 1 } },
  { text: "3.5x.", values: { store: 3.5 } },
]);

/** Haemorrhage. Design: docs/skills/brannoc.md. Values: store: multiple of the damage stored the burst deals; fuse: seconds to the burst; repay: share of max HP a burst repays; spread: radius the burst spreads to at half (0 for none); bosses: 1 it works on mini bosses and bosses; bloom: 1 a burst chains to the next foe and plants a new mark (evolution) */
export const HAEMORRHAGE: SkillDef = {
  id: "b_hemorrhage",
  name: "Haemorrhage",
  kind: "dot",
  risk: "precise",
  button: "auto",
  text: "While Bloodied, his blows plant a mark on the first foe that bursts for what it stored.",
  levels: LEVELS,
  evolution: {
    partner: "b_redEdge",
    name: "Red Bloom",
    text: "A burst chains to the next foe and plants a new mark there.",
    row: evolvedRow(LEVELS[7], "A burst chains on and marks the next foe.", { bloom: 1 }),
  },
};
