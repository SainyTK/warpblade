import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { withDrill } from "./drillLevels";

/** values: `path` attack damage to foes the thrown sword passes, `free` the arrival round needs no round in the chamber, `recharge` seconds, `blast` attack damage of the arrival round, `splash` and `reach` its splash, `charges` warps in a row, `load` the arrival loads a round, `line` attack damage a second of the tracer line left burning */
const LEVELS = levelRows([
  { text: "The thrown sword's tracer cuts foes on its path.", values: { path: 0.8 } },
  { text: "New: the arrival round needs no round in the chamber.", values: { free: 1 } },
  { text: "Warp recharge 2 to 1.5 s.", values: { recharge: 1.5 } },
  { text: "New: the arrival blast splashes foes round it.", values: { blast: 0.5, splash: 0.5, reach: 30 } },
  { text: "Tracer 0.8 to 1.6; blast 0.5 to 0.7.", values: { path: 1.6, blast: 0.7 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
  { text: "New: the arrival loads a round.", values: { load: 1 } },
  { text: "Tracer 1.6 to 6; blast 0.7 to 3.5.", values: { path: 6, blast: 3.5 } },
]);

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "Warp recharge -15%, damage +30%.", drill: { cooldown: 0.15, damage: 0.3 } },
  { text: "New: the warp leaves a tracer that cuts every foe along it.", drill: { line: 0.6 } },
  { text: "New: the arrival staggers.", drill: { stagger: 0.4 } },
  { text: "Recharge -30%, damage +80%.", drill: { cooldown: 0.3, damage: 0.8 } },
  { text: "New: the arrival restores the air dash and air cut.", drill: { refresh: 1 } },
  { text: "Tracer 0.6 to 1.5 AD.", drill: { line: 1.5 } },
  { text: "Recharge -45%, damage +150%.", drill: { cooldown: 0.45, damage: 1.5 } },
  { text: "Damage +300%; tracer 3 AD.", drill: { damage: 3, line: 3 } },
]);

export const TRACER_WARP: SkillDef = {
  id: "ca_tracer",
  name: "Tracer Warp",
  kind: "movement",
  element: "void",
  risk: "timed",
  button: "L",
  text: "A faster, harder warp strike that leaves a cutting tracer.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_ricochet",
    name: "Green Line",
    text: "The tracer fires a round into every foe along it.",
    row: evolvedRow(DRILL_LEVELS[7], "The tracer fires a round into each foe.", {
      line: 8,
    }),
  },
};
