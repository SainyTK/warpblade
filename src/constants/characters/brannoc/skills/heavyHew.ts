import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Hew deals 25% more.",
    values: { power: 0.25, crack: 0, crackPower: 0.4, guard: 0, crackStagger: 0, split: 0 },
  },
  { text: "Hew cracks the floor 40 px ahead, 0.4x.", values: { crack: 40 } },
  { text: "Hew deals 45% more.", values: { power: 0.45 } },
  { text: "Hew breaks a guard.", values: { guard: 1 } },
  { text: "The crack runs 70 px, 0.6x.", values: { crack: 70, crackPower: 0.6 } },
  { text: "The crack staggers foes.", values: { crackStagger: 1 } },
  { text: "Hew deals 70% more.", values: { power: 0.7 } },
  { text: "Hew 90% more; the crack 1x.", values: { power: 0.9, crackPower: 1 } },
]);

/** Heavy Hew. Design: docs/skills/brannoc.md. Values: power: share more Hew deals; crack: pixels of the floor crack Hew sends ahead (0 for none); crackPower: attack damage the crack deals; guard: 1 Hew breaks a guard; crackStagger: 1 the crack staggers; split: 1 the crack erupts in spikes that throw minions up (evolution) */
export const HEAVY_HEW: SkillDef = {
  id: "b_heavyHew",
  name: "Heavy Hew",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Hew lands harder, and later cracks the floor ahead of him.",
  levels: LEVELS,
  evolution: {
    partner: "b_geyser",
    name: "Earthsplitter",
    text: "Hew's crack runs 140 px and erupts in spikes that throw minions up.",
    row: evolvedRow(LEVELS[7], "The crack runs 140 px and erupts in spikes.", { split: 1, crack: 140 }),
  },
};
