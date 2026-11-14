import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `wave` added shockwave power (AD), `reach` its added share of reach, `both` it runs both ways, `stun` added
 *  knockdown seconds, `fissureReach` a fissure's added share of reach, `fissure` added fissure power (AD),
 *  `alwaysFissure` every slam is a fissure, Heft or not */
const LEVELS = levelRows([
  { text: "The slam's shockwave hits harder.", values: { wave: 0.6 } },
  { text: "The shockwave runs 40% farther.", values: { reach: 0.4 } },
  { text: "New: the shockwave runs both ways.", values: { both: 1 } },
  { text: "Shockwave power +0.6 to +2.", values: { wave: 2 } },
  { text: "New: foes it knocks down stay down 0.5 s longer.", values: { stun: 0.5 } },
  { text: "New: fissures run 40% farther.", values: { fissureReach: 0.4 } },
  { text: "New: fissures hit 1.5 AD harder.", values: { fissure: 1.5 } },
  { text: "Shockwave power +2 to +5; it runs twice as far.", values: { wave: 5, reach: 1 } },
]);

export const ANVIL_WEIGHT: SkillDef = {
  id: "br_slam",
  name: "Anvil Weight",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The slam's shockwave runs farther and harder, and fissures split more of the floor.",
  levels: LEVELS,
  evolution: {
    partner: "br_heavy",
    name: "Split Earth",
    text: "Every slam is a fissure, and full Heft no longer needs spending on it.",
    row: evolvedRow(LEVELS[7], "Every slam is a fissure.", { alwaysFissure: 1 }),
  },
};
