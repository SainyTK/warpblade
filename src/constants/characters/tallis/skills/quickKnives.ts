import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "String blows deal 15% more.",
    values: { power: 0.15, speed: 0, heel: 0, all: 0, pierce: 0, knife: 0.5, range: 50, storm: 0 },
  },
  { text: "Blows play 8% faster.", values: { speed: 0.08 } },
  { text: "String blows deal 30% more.", values: { power: 0.3 } },
  { text: "Heel Kick throws a knife 50 px.", values: { heel: 1 } },
  { text: "Flick and Cross throw knives too.", values: { all: 1 } },
  { text: "String blows deal 50% more.", values: { power: 0.5 } },
  { text: "Thrown knives pierce one foe.", values: { pierce: 1 } },
  { text: "String blows deal 90% more.", values: { power: 0.9 } },
]);

/** Quick Knives. Design: docs/skills/tallis.md. Values: power: share more his string blows deal; speed: share faster his blows play; heel: 1 Heel Kick throws a knife; all: 1 Flick and Cross throw knives too; pierce: foes a thrown knife passes through; knife: attack damage a thrown knife deals; range: pixels a thrown knife flies; storm: 1 every blow throws a fan of three knives (evolution) */
export const QUICK_KNIVES: SkillDef = {
  id: "t_quickKnives",
  name: "Quick Knives",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "His knife string strikes harder and faster, and starts throwing knives.",
  levels: LEVELS,
  evolution: {
    partner: "t_needles",
    name: "Knife Storm",
    text: "Every blow of his string throws a fan of three knives.",
    row: evolvedRow(LEVELS[7], "Every blow throws a fan of three knives.", { storm: 1 }),
  },
};
