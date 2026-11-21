import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillLevels";

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

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "Air cuts fire a round into the foe.", drill: { round: 0.5 } },
  { text: "New: the round ricochets to one more foe.", drill: { bounces: 1 } },
  { text: "New: one more air cut per jump.", drill: { air: 1 } },
  { text: "Round 0.5 to 1 AD.", drill: { round: 1 } },
  { text: "New: two ricochets.", drill: { bounces: 2 } },
  { text: "Round 1 to 2 AD.", drill: { round: 2 } },
  { text: "New: ricochets stagger.", drill: { stagger: 0.3 } },
  { text: "Round 2 to 4 AD.", drill: { round: 4 } },
]);

export const RICOCHET: SkillDef = {
  id: "ca_ricochet",
  name: "Ricochet",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Air cuts fire a round that ricochets on to other foes.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_tracer",
    name: "Pinball",
    text: "Air rounds ricochet six times.",
    row: evolvedRow(DRILL_LEVELS[7], "Air rounds ricochet six times.", {
      ...drillValues({ bounces: 6 }),
      every: 1,
      bounces: 6,
      grow: 0.15,
    }),
  },
};
