import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Cleave spins once more for 0.6x.",
    values: { spins: 1, power: 0.6, drift: 0, pull: 0, wind: 0, tempest: 0 },
  },
  { text: "He drifts 20 px forward as he spins.", values: { drift: 20 } },
  { text: "The turns deal 0.8x.", values: { power: 0.8 } },
  { text: "Each turn pulls foes 8 px in.", values: { pull: 8 } },
  { text: "Another turn.", values: { spins: 2 } },
  { text: "The turns deal 1x.", values: { power: 1 } },
  { text: "The last turn throws a 60 px wind ring.", values: { wind: 60 } },
  { text: "The turns deal 1.3x.", values: { power: 1.3 } },
]);

/** Spinning Reap. Design: docs/skills/brannoc.md. Values: spins: extra turns Cleave spins; power: attack damage each extra turn deals; drift: pixels he drifts forward over the turns; pull: pixels each turn pulls foes in; wind: radius of a wind ring the last turn throws (0 for none); tempest: seconds of a whirl he steers with A and D in place of the turns (evolution) */
export const SPINNING_REAP: SkillDef = {
  id: "b_spinningReap",
  name: "Spinning Reap",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Cleave spins on for extra turns.",
  levels: LEVELS,
  evolution: {
    partner: "b_headlong",
    name: "Red Tempest",
    text: "Cleave becomes a 1.2 s whirl he steers with A and D.",
    row: evolvedRow(LEVELS[7], "Cleave is a 1.2 s whirl steered with A and D.", { tempest: 1.2 }),
  },
};
