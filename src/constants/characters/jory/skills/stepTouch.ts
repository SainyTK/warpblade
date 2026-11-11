import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Beat Step strikes the foes it passes, 0.6x.",
    values: { power: 0.6, echo: 0, reach: 0, stagger: 0, second: 0, moonwalk: 0 },
  },
  { text: "0.8x.", values: { power: 0.8 } },
  { text: "An echo strikes them again on the next beat, half as hard.", values: { echo: 0.5 } },
  { text: "The step goes 15% further.", values: { reach: 0.15 } },
  { text: "Struck minions stagger.", values: { stagger: 1 } },
  { text: "1.1x; the echo 70%.", values: { power: 1.1, echo: 0.7 } },
  { text: "An on-beat step makes the next one free.", values: { second: 1 } },
  { text: "1.5x.", values: { power: 1.5 } },
]);

/** Step Touch. Design: docs/skills/jory.md. Values: power: attack damage each foe passed takes; echo: share of it struck again on the next beat; reach: share further the step goes; stagger: 1 struck minions stagger; second: 1 an on-beat step makes the next step free; moonwalk: 1 on-beat steps cost no stamina for four in a row (evolution) */
export const STEP_TOUCH: SkillDef = {
  id: "j_stepTouch",
  name: "Step Touch",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Beat Step strikes the foes it passes.",
  levels: LEVELS,
  evolution: {
    partner: "j_paradiddle",
    name: "Moonwalk",
    text: "On-beat steps cost no stamina for four in a row, each striking.",
    row: evolvedRow(LEVELS[7], "Four on-beat steps in a row cost nothing.", { moonwalk: 1 }),
  },
};
