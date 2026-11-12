import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Hunt leaves a 2 s trail, 0.2x every 0.5 s.",
    values: { power: 0.2, time: 2, slow: 0, bleed: 0, killRepay: 0, river: 0 },
  },
  { text: "The trail slows foes on it.", values: { slow: 1 } },
  { text: "0.3x.", values: { power: 0.3 } },
  { text: "The trail lasts 3 s.", values: { time: 3 } },
  { text: "It bleeds foes.", values: { bleed: 1 } },
  { text: "0.45x.", values: { power: 0.45 } },
  { text: "A kill on it repays 5% of max HP.", values: { killRepay: 0.05 } },
  { text: "0.6x; lasts 4 s.", values: { power: 0.6, time: 4 } },
]);

/** Blood Trail. Design: docs/skills/brannoc.md. Values: power: attack damage the trail deals every 0.5 s; time: seconds the trail lasts; slow: 1 foes on it are slowed to half speed; bleed: 1 it bleeds foes; killRepay: share of max HP a kill on it repays; river: 1 the trail lasts 3 s more and bursts at its end for 2x (evolution) */
export const BLOOD_TRAIL: SkillDef = {
  id: "b_bloodTrail",
  name: "Blood Trail",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Hunt leaves a trail of blood that hurts foes standing in it.",
  levels: LEVELS,
  evolution: {
    partner: "b_hemorrhage",
    name: "River of Red",
    text: "The trail lasts 3 s longer, then bursts along its length for 2x.",
    row: evolvedRow(LEVELS[7], "The trail lasts 3 s more and bursts, 2x.", { river: 1 }),
  },
};
