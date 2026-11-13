import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Foes Hunt touches take 0.5x and are shoved aside.",
    values: { power: 0.5, through: 0, stagger: 0, elites: 0, wave: 0, juggernaut: 0 },
  },
  { text: "Hunt passes through minions.", values: { through: 1 } },
  { text: "They are staggered.", values: { stagger: 1 } },
  { text: "0.8x.", values: { power: 0.8 } },
  { text: "Elites are shoved too.", values: { elites: 1 } },
  { text: "1.1x.", values: { power: 1.1 } },
  { text: "Hunt leaves a 60 px dust wave, 0.5x.", values: { wave: 60 } },
  { text: "1.5x.", values: { power: 1.5 } },
]);

/** Headlong. Design: docs/skills/brannoc.md. Values: power: attack damage each foe Hunt passes takes; through: 1 Hunt passes through minions; stagger: 1 they are staggered; elites: 1 elites too; wave: pixels of a dust wave Hunt leaves (0 for none); juggernaut: 1 Hunt passes every ground foe and the chop strikes all of them (evolution) */
export const HEADLONG: SkillDef = {
  id: "b_headlong",
  name: "Headlong",
  kind: "movement",
  risk: "easy",
  button: "L",
  text: "Foes in Hunt's way are struck and shoved aside.",
  levels: LEVELS,
  evolution: {
    partner: "b_reaver",
    name: "Juggernaut",
    text: "Hunt passes every ground foe in its way, and the chop strikes all of them.",
    row: evolvedRow(LEVELS[7], "Hunt passes every foe; the chop strikes all.", { juggernaut: 1 }),
  },
};
