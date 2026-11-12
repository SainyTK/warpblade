import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Cleave rends: 3 stacks, 0.15x a second each.",
    values: { power: 0.15, stacks: 3, hew: 0, time: 4, slow: 0, wide: 0, flay: 0 },
  },
  { text: "Hew rends too, 1 stack.", values: { hew: 1 } },
  { text: "0.22x.", values: { power: 0.22 } },
  { text: "Rends last 6 s.", values: { time: 6 } },
  { text: "Rended foes are slowed for 2 s.", values: { slow: 2 } },
  { text: "0.3x.", values: { power: 0.3 } },
  { text: "Cleave rends 20 px past its reach.", values: { wide: 20 } },
  { text: "0.42x; 4 stacks.", values: { power: 0.42, stacks: 4 } },
]);

/** Rend. Design: docs/skills/brannoc.md. Values: power: attack damage a second each stack deals; stacks: stacks a Cleave lays; hew: stacks Hew lays (0 for none); time: seconds the stacks last; slow: seconds rended foes are slowed (to half speed); wide: pixels past the Cleave's reach it still rends; flay: share more rended foes take from Hew (evolution) */
export const REND: SkillDef = {
  id: "b_rend",
  name: "Rend",
  kind: "dot",
  risk: "timed",
  button: "J",
  text: "Cleave rends the foes it strikes with heavy stacks that tear at them.",
  levels: LEVELS,
  evolution: {
    partner: "b_heavyHew",
    name: "Flay",
    text: "Rended foes take 30% more from Hew.",
    row: evolvedRow(LEVELS[7], "Rended foes take 30% more from Hew.", { flay: 0.3 }),
  },
};
