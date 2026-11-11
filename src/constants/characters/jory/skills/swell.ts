import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Every blow deals 5% more for each Groove tier.",
    values: { perTier: 0.05, stagger: 0, reach: 0, fortissimo: 0 },
  },
  { text: "8% a tier.", values: { perTier: 0.08 } },
  { text: "From tier 3 his blows stagger 0.2 s longer.", values: { stagger: 0.2 } },
  { text: "11% a tier.", values: { perTier: 0.11 } },
  { text: "At Crescendo his blows reach 10% further.", values: { reach: 0.1 } },
  { text: "14% a tier.", values: { perTier: 0.14 } },
  { text: "At Crescendo, 15% further.", values: { reach: 0.15 } },
  { text: "18% a tier.", values: { perTier: 0.18 } },
]);

/** Swell. Design: docs/skills/jory.md. Values: perTier: share more every blow deals for each Groove tier; stagger: seconds more his blows stagger from tier 3; reach: share further his blows reach at Crescendo; fortissimo: 1 at Crescendo every blow sends a 30 px ring (evolution) */
export const SWELL: SkillDef = {
  id: "j_swell",
  name: "Swell",
  kind: "attack",
  risk: "easy",
  button: "auto",
  text: "Every blow deals more for each Groove tier.",
  levels: LEVELS,
  evolution: {
    partner: "j_encore",
    name: "Fortissimo",
    text: "At Crescendo every blow reaches 25% further and sends a 30 px ring.",
    row: evolvedRow(LEVELS[7], "At Crescendo, 25% further and a 30 px ring.", { fortissimo: 1, reach: 0.25 }),
  },
};
