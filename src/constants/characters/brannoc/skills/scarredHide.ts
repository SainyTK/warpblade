import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "The debt holds 10% more of max HP.",
    values: { cap: 0.1, fade: 0, line: 0, fury: 0, thirst: 0, thousand: 0 },
  },
  { text: "The debt fades 25% slower.", values: { fade: 0.25 } },
  { text: "It holds 15% more.", values: { cap: 0.15 } },
  { text: "Bloodied from 40% HP.", values: { line: 0.4 } },
  { text: "Fury +0.1.", values: { fury: 0.1 } },
  { text: "It holds 20% more.", values: { cap: 0.2 } },
  { text: "Bloodthirst heals 4%.", values: { thirst: 0.04 } },
  { text: "Fades 50% slower; Fury +0.15.", values: { fade: 0.5, fury: 0.15 } },
]);

/** Scarred Hide. Design: docs/skills/brannoc.md. Values: cap: share of max HP added to the debt's cap; fade: share slower the debt fades; line: the HP share he is Bloodied at (0 keeps 35%); fury: Fury added; thirst: share of max HP Bloodthirst heals (0 keeps 3%); thousand: 1 a blow forfeits only half the debt (evolution) */
export const SCARRED_HIDE: SkillDef = {
  id: "b_scarred",
  name: "Scarred Hide",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "His debt holds more, fades slower, and his Fury runs hotter.",
  levels: LEVELS,
  evolution: {
    partner: "b_ancestor",
    name: "Thousand Scars",
    text: "A blow forfeits only half the debt.",
    row: evolvedRow(LEVELS[7], "A blow forfeits only half the debt.", { thousand: 1 }),
  },
};
