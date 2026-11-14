import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` attack damage of the shock, `reach` pixels each way, `launch` throws foes up, `burn` attack damage a burn tick per stack, `second` a second shock farther out, `stun` seconds knocked down, `fissure` attack damage of the fissure that runs to both edges */
const LEVELS = levelRows([
  { text: "Breaker sends a shock along the floor both ways.", values: { power: 0.8, reach: 34 } },
  { text: "Shock reach 34 to 48 px; power +40%.", values: { reach: 48, power: 1.1 } },
  { text: "New: the shock throws foes up.", values: { launch: 1 } },
  { text: "New: the shock leaves foes burning.", values: { burn: 0.15 } },
  { text: "Shock power 1.1 to 2.", values: { power: 2 } },
  { text: "New: a second shock runs out farther.", values: { second: 1 } },
  { text: "New: the shock knocks foes down.", values: { stun: 0.8 } },
  { text: "Shock power 2 to 4.5.", values: { power: 4.5 } },
]);

export const BREECH_SLAM: SkillDef = {
  id: "ca_breech",
  name: "Breech Slam",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Breaker fires a round into the floor: a shock runs out both ways.",
  levels: LEVELS,
  evolution: {
    partner: "ca_blastjump",
    name: "Faultline",
    text: "The shock tears a fissure along the floor to both edges of the stage, striking every foe on it.",
    row: evolvedRow(LEVELS[7], "A fissure runs to both edges.", { fissure: 5 }),
  },
};
