import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `cut` power on each foe the dash passes, `rising` power of the cut at the dash's end, `refund` stamina per foe
 *  cut, `perfect` times the cut on a perfect dodge, `chill` seconds foes cut are slowed */
const LEVELS = levelRows([
  { text: "The dodge cuts every foe it passes through.", values: { cut: 0.8 } },
  { text: "Max stamina +50: one more dodge.", stats: { stamina: 50 } },
  { text: "Dodge cut power 0.8 to 1.4.", values: { cut: 1.4 } },
  { text: "New: the dodge ends with a rising cut.", values: { rising: 1 } },
  { text: "New: each foe cut gives back stamina.", values: { refund: 10 } },
  { text: "New: a perfect dodge cuts for triple.", values: { perfect: 3 } },
  { text: "New: foes cut are slowed for 1.5 s.", values: { chill: 1.5 } },
  { text: "Dodge cut power 1.4 to 4; rising cut 1 to 2.", values: { cut: 4, rising: 2 } },
]);

export const PASSING_CUT: SkillDef = {
  id: "k_passing",
  name: "Passing Cut",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "The dodge cuts every foe it passes through.",
  levels: LEVELS,
  evolution: {
    partner: "k_skydance",
    name: "Phantom Rush",
    text: "Crystal phantoms along the dodge's path cut again a moment later, and dodges cost half the stamina.",
    row: evolvedRow(LEVELS[7], "Phantoms cut the path again; dodges cost half.", { rush: 3, staminaCost: 0.5 }),
  },
};
