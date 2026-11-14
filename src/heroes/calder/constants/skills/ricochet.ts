import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` attack damage of a ricochet, `range` pixels it can jump, `bounces` how many, `stagger` seconds, `more` rounds from the warp and the parry ricochet too, `every` every round ricochets, `grow` each bounce hits this much harder */
const LEVELS = levelRows([
  { text: "A Trigger's round ricochets to a foe nearby.", values: { power: 0.6, range: 60, bounces: 1 } },
  { text: "Ricochet power 0.6 to 1.", values: { power: 1 } },
  { text: "New: it ricochets twice.", values: { bounces: 2 } },
  { text: "New: ricochets stagger.", values: { stagger: 0.5 } },
  { text: "Power 1 to 1.8; range 60 to 80 px.", values: { power: 1.8, range: 80 } },
  { text: "New: the warp's and the parry's rounds ricochet too.", values: { more: 1 } },
  { text: "New: it ricochets three times.", values: { bounces: 3 } },
  { text: "Ricochet power 1.8 to 4.", values: { power: 4 } },
]);

export const RICOCHET: SkillDef = {
  id: "ca_ricochet",
  name: "Ricochet",
  kind: "attack",
  risk: "timed",
  button: "auto",
  text: "A Trigger's round ricochets on to another foe nearby.",
  levels: LEVELS,
  evolution: {
    partner: "ca_tracer",
    name: "Pinball",
    text: "Every round you fire ricochets six times, each bounce harder than the last.",
    row: evolvedRow(LEVELS[7], "Every round ricochets six times, growing.", { every: 1, bounces: 6, grow: 0.15 }),
  },
};
