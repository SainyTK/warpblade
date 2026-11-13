import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Reave reaches 24 px behind him and deals 20% more.",
    values: { behind: 24, power: 0.2, pull: 0, slow: 0, elites: 0, second: 0, hook: 0 },
  },
  { text: "Reave pulls foes 10 px in.", values: { pull: 10 } },
  { text: "Struck foes are slowed for 2 s.", values: { slow: 2 } },
  { text: "Reave deals 40% more.", values: { power: 0.4 } },
  { text: "It pulls elites too.", values: { elites: 1 } },
  { text: "Reave deals 60% more.", values: { power: 0.6 } },
  { text: "A second sweep follows, 0.6x.", values: { second: 0.6 } },
  { text: "90% more; the second sweep 0.8x.", values: { power: 0.9, second: 0.8 } },
]);

/** Reaver. Design: docs/skills/brannoc.md. Values: behind: pixels Reave reaches behind him; power: share more Reave deals; pull: pixels Reave pulls foes in; slow: seconds struck foes are slowed (to half speed); elites: 1 it pulls elites; second: attack damage of a second sweep (0 for none); hook: pixels round him from which Reave drags every foe into the Cleave's arc (evolution) */
export const REAVER: SkillDef = {
  id: "b_reaver",
  name: "Reaver",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Reave reaches further behind him and drags what it sweeps.",
  levels: LEVELS,
  evolution: {
    partner: "b_hunt",
    name: "Reaping Hook",
    text: "Reave drags every foe within 60 px into the Cleave's arc.",
    row: evolvedRow(LEVELS[7], "Reave drags every foe within 60 px in.", { hook: 60 }),
  },
};
