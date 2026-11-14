import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` ability power, `reach` pixels, `foes` foes caught, `recharge` seconds, `mark` caught foes take this much
 *  more for 3 s, `tempo` Tempo per foe caught, `high` thrown higher */
const LEVELS = levelRows([
  {
    text: "Learn Dusk Thread: pull the nearest foe ahead to you and throw it up.",
    values: { power: 1.4, reach: 120, foes: 1, recharge: 4 },
  },
  { text: "Power 1.4 to 2.4.", values: { power: 2.4 } },
  { text: "New: caught foes take 15% more for 3 s.", values: { mark: 0.15 } },
  { text: "New: the thread catches two foes.", values: { foes: 2 } },
  { text: "Power 2.4 to 3.4; reaches 150 px.", values: { power: 3.4, reach: 150 } },
  { text: "New: each foe caught adds 2 Tempo.", values: { tempo: 2 } },
  { text: "New: three foes, thrown higher.", values: { foes: 3, high: 1 } },
  { text: "Power 3.4 to 4.6; the mark 15% to 25%.", values: { power: 4.6, mark: 0.25 } },
]);

export const DUSK_THREAD: SkillDef = {
  id: "ve_thread",
  name: "Dusk Thread",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "An ability: a thread pulls a foe to you and throws it up for your air string.",
  levels: LEVELS,
  evolution: {
    partner: "ve_warp",
    name: "Fate Thread",
    text: "The thread catches every foe ahead within 200 px and hits 30% harder.",
    row: evolvedRow(LEVELS[7], "Catches every foe ahead within 200 px.", { foes: 12, reach: 200, power: 6 }),
  },
};
