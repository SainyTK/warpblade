import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels } from "./drillLevels";

/** values: `damage` AD a tick to each foe on a crack, `time` seconds a crack burns, `every` seconds between ticks,
 *  `chill` seconds foes on it are slowed, `halt` foes on it are held in place, `heft` Heft for each tick on a foe,
 *  `fissure` cracks from fissures and Rend burn too, `erupt` a crack bursts up at its end at this power (AD) */
const LEVELS = drillLevels(
  [
    { text: "Her shockwaves leave burning cracks in the floor.", values: { damage: 0.15, time: 2, every: 0.5 } },
    { text: "New: foes walking over a crack are slowed; cracks burn 3 s.", values: { time: 3, chill: 0.6 } },
    { text: "New: fissures and Rend leave burning cracks too.", values: { fissure: 1 } },
    { text: "Cracks burn 0.15 to 0.3 AD a tick.", values: { damage: 0.3 } },
    { text: "New: foes on a crack are held in place.", values: { halt: 1 } },
    { text: "New: each tick on a foe gives 2 Heft; ticks every 0.35 s.", values: { every: 0.35, heft: 2 } },
    { text: "Cracks burn 0.3 to 0.6 AD; they last 4 s.", values: { damage: 0.6, time: 4 } },
    { text: "Cracks burn 0.6 to 1.1 AD.", values: { damage: 1.1 } },
  ],
  [
    { text: "The third slash and her shockwaves leave burning cracks in the floor.", drill: { reach: 60 } },
    { text: "New: foes walking over a crack are slowed; cracks burn 3 s.", drill: {} },
    { text: "New: fissures leave burning cracks too.", drill: {} },
    { text: "Cracks burn 0.15 to 0.3 AD a tick.", drill: {} },
    { text: "New: foes on a crack are held in place.", drill: {} },
    { text: "Cracks tick every 0.35 s; the third slash cracks 90 px.", drill: { reach: 90 } },
    { text: "New: the third slash cracks both ways; cracks burn 0.6 AD for 4 s.", drill: { both: 1 } },
    { text: "Cracks burn 0.6 to 1.1 AD.", drill: {} },
  ],
);

export const FAULT_LINES: SkillDef = {
  id: "br_fault",
  name: "Fault Lines",
  kind: "dot",
  element: "storm",
  risk: "timed",
  button: "auto",
  text: "The third slash and her shockwaves leave burning cracks in the floor.",
  levels: LEVELS,
  evolution: {
    partner: "br_slam",
    name: "Rift Floor",
    text: "When a crack burns out, it bursts up along its whole length.",
    row: evolvedRow(LEVELS[7], "Cracks burst up as they burn out.", { erupt: 4 }),
  },
};
