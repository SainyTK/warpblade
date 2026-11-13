import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "While Bloodied, Cleave deals 60% more to its first foe.",
    values: { power: 0.6, hew: 0, bleed: 0, sure: 0, repay: 1, moon: 0 },
  },
  { text: "Hew pays off too.", values: { hew: 1 } },
  { text: "90% more.", values: { power: 0.9 } },
  { text: "The payoff foe bleeds.", values: { bleed: 1 } },
  { text: "130% more.", values: { power: 1.3 } },
  { text: "The payoff is a sure crit.", values: { sure: 1 } },
  { text: "180% more.", values: { power: 1.8 } },
  { text: "240% more; the payoff repays triple.", values: { power: 2.4, repay: 3 } },
]);

/** Red Edge. Design: docs/skills/brannoc.md. Values: power: share more the payoff blow deals to its first foe; hew: 1 Hew pays off too; bleed: 1 the payoff foe bleeds; sure: 1 the payoff is a sure crit; repay: a multiple on what the payoff repays; moon: 1 a Bloodied Cleave throws a 90 px crimson arc both ways (evolution) */
export const RED_EDGE: SkillDef = {
  id: "b_redEdge",
  name: "Red Edge",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "While he is Bloodied, Cleave deals a large bonus to the first foe it reaches.",
  levels: LEVELS,
  evolution: {
    partner: "b_scarred",
    name: "Crimson Moon",
    text: "A Bloodied Cleave also throws a crimson arc 90 px both ways along the floor.",
    row: evolvedRow(LEVELS[7], "A Bloodied Cleave throws 90 px arcs both ways.", { moon: 1 }),
  },
};
