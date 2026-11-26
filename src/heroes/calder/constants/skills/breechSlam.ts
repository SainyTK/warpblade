import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillLevels";

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

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "The third cut deals +50%.", drill: { finisher: 0.5 } },
  { text: "New: the slam shakes the floor round the blade.", drill: { quake: 0.6 } },
  { text: "New: the quake staggers.", drill: { stagger: 0.5 } },
  { text: "Third cut +50% to +100%.", drill: { finisher: 1 } },
  { text: "New: the third cut fires a second, hot round.", drill: { twin: 1 } },
  { text: "Third cut +200%; quake doubles.", drill: { finisher: 2, quake: 1.2 } },
  { text: "New: the quake reaches 70 px.", drill: { reach: 70 } },
  { text: "Third cut +400%; quake 3 AD.", drill: { finisher: 4, quake: 3 } },
]);

export const BREECH_SLAM: SkillDef = {
  id: "ca_breech",
  name: "Breech Slam",
  kind: "attack",
  element: "storm",
  risk: "timed",
  button: "J",
  text: "The third cut slams down hard enough to shake the floor.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_blastjump",
    name: "Faultline",
    text: "The slam tears a fault line along the floor that bursts four times ahead.",
    row: evolvedRow(DRILL_LEVELS[7], "A fault line bursts four times ahead.", {
      ...drillValues({ fault: 3 }),
      fissure: 5,
    }),
  },
};
