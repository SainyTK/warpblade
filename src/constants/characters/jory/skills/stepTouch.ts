import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "His dodge strikes the foes it passes, 0.6x.",
    values: { power: 0.6, echo: 0, onBeat: 0, stagger: 0, refund: 0, moonwalk: 0 },
  },
  { text: "0.8x.", values: { power: 0.8 } },
  { text: "An echo strikes them again on the next beat, half as hard.", values: { echo: 0.5 } },
  { text: "An on-beat dodge strikes 50% harder.", values: { onBeat: 0.5 } },
  { text: "Struck minions stagger.", values: { stagger: 1 } },
  { text: "1.1x; the echo 70%.", values: { power: 1.1, echo: 0.7 } },
  { text: "An on-beat dodge gives back 15 stamina.", values: { refund: 15 } },
  { text: "1.5x.", values: { power: 1.5 } },
]);

/** Step Touch. Design: docs/skills/jory.md. Values: power: attack damage each foe passed takes; echo: share of it struck again on the next beat; onBeat: share more an on-beat dodge strikes; stagger: 1 struck minions stagger; refund: stamina an on-beat dodge gives back; moonwalk: 1 an on-beat dodge gives back all its stamina (evolution) */
export const STEP_TOUCH: SkillDef = {
  id: "j_stepTouch",
  name: "Step Touch",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "His dodge strikes the foes it passes, harder on the beat.",
  levels: LEVELS,
  evolution: {
    partner: "j_paradiddle",
    name: "Moonwalk",
    text: "On-beat dodges cost no stamina, each striking.",
    row: evolvedRow(LEVELS[7], "On-beat dodges cost no stamina.", { moonwalk: 1 }),
  },
};
