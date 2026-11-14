import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `path` attack damage to foes the thrown sword passes, `free` the arrival round needs no round in the chamber, `recharge` seconds, `blast` attack damage of the arrival round, `splash` and `reach` its splash, `charges` warps in a row, `load` the arrival loads a round, `line` attack damage a second of the tracer line left burning */
const LEVELS = levelRows([
  { text: "The thrown sword's tracer cuts foes on its path.", values: { path: 0.8 } },
  { text: "New: the arrival round needs no round in the chamber.", values: { free: 1 } },
  { text: "Warp recharge 2 to 1.5 s.", values: { recharge: 1.5 } },
  { text: "New: the arrival blast splashes foes round it.", values: { blast: 0.5, splash: 0.5, reach: 30 } },
  { text: "Tracer 0.8 to 1.6; blast 0.5 to 0.7.", values: { path: 1.6, blast: 0.7 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
  { text: "New: the arrival loads a round.", values: { load: 1 } },
  { text: "Tracer 1.6 to 3; blast 0.7 to 1.", values: { path: 3, blast: 1 } },
]);

export const TRACER_WARP: SkillDef = {
  id: "ca_tracer",
  name: "Tracer Warp",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "The thrown sword leaves a tracer that cuts foes in its path.",
  levels: LEVELS,
  evolution: {
    partner: "ca_ricochet",
    name: "Green Line",
    text: "The tracer line stays for 2 seconds and burns every foe on it.",
    row: evolvedRow(LEVELS[7], "The tracer line burns for 2 s.", { line: 4 }),
  },
};
