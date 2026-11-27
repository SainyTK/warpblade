import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "A warp strike may leave a red splinter that darts at foes.",
    values: { chance: 0.6, warp: 1, power: 0.5, strikes: 3, count: 2, cooldown: 0.5 },
  },
  { text: "New: the third slash may chip one off too.", values: { finisher: 0.3 } },
  { text: "New: a splinter's strike marks the foe, +10% from her for 2 s.", values: { mark: 0.1 } },
  { text: "Power 0.5 to 0.9 AD; 5 strikes each.", values: { power: 0.9, strikes: 5 } },
  { text: "New: a warp strike leaves two splinters.", values: { warp: 2 } },
  { text: "Power 0.9 to 1.4 AD; every warp strike leaves them.", values: { power: 1.4, chance: 1 } },
  { text: "New: splinter strikes pass through to a second foe.", values: { pierce: 1 } },
  { text: "Power 1.4 to 2 AD; four out at once.", values: { power: 2, count: 4 } },
]);

export const HEART_SPLINTER: SkillDef = {
  id: "br_splinter",
  name: "Heart Splinter",
  kind: "summon",
  element: "venom",
  risk: "timed",
  button: "auto",
  text: "A warp strike splinters the crystal in Anvilheart, and the red splinters dart at foes on their own.",
  levels: LEVELS,
  evolution: {
    partner: "br_heavy",
    name: "Crimson Halo",
    text: "Four splinters circle her for good and dart out at every foe near her.",
    row: evolvedRow(LEVELS[7], "Four splinters circle her for good.", { orbit: 1, count: 4 }),
  },
};
