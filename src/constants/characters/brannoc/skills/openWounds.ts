import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "String blows lay a bleed, 0.08x a second per stack, 5 stacks.",
    values: { power: 0.08, max: 5, spread: 0, every: 1, cleave: 1, dry: 0 },
  },
  { text: "8 stacks.", values: { max: 8 } },
  { text: "0.12x.", values: { power: 0.12 } },
  { text: "A foe that dies passes its stacks on.", values: { spread: 1 } },
  { text: "Ticks twice as fast.", values: { every: 0.5 } },
  { text: "0.16x.", values: { power: 0.16 } },
  { text: "Cleave lays 3 stacks.", values: { cleave: 3 } },
  { text: "0.22x; 10 stacks.", values: { power: 0.22, max: 10 } },
]);

/** Open Wounds. Design: docs/skills/brannoc.md. Values: power: attack damage a second each stack deals; max: stacks a foe can carry; spread: 1 a foe that dies passes its stacks to the nearest foe; every: seconds between ticks; cleave: stacks a Cleave lays; dry: attack damage per stack a Cleave deals when it takes every stack as one hit (evolution) */
export const OPEN_WOUNDS: SkillDef = {
  id: "b_bleed",
  name: "Open Wounds",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "His string blows lay a bleed that stacks.",
  levels: LEVELS,
  evolution: {
    partner: "b_sunder",
    name: "Bleed Dry",
    text: "Cleave takes every stack on a foe as one hit, 1.2x per stack.",
    row: evolvedRow(LEVELS[7], "Cleave takes every stack as one hit, 1.2x each.", { dry: 1.2 }),
  },
};
