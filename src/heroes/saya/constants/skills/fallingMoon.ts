import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values: `store` the factor on what the falling draw stores, `ring` attack damage of the ring its landing sends
 *  `ringReach` px along the floor, `air` falling draws added per airtime, `airCrit` it is a sure crit on foes in the air,
 *  `lift` its landing throws foes near her up this fast */
const LEVELS = levelRows([
  { text: "The falling draw stores +50%.", values: { store: 1.5 } },
  { text: "New: its landing sends a ring along the floor.", values: { ring: 0.8, ringReach: 34 } },
  { text: "Store +50% to +100%.", values: { store: 2 } },
  { text: "New: a second falling draw in the same airtime.", values: { air: 1 } },
  { text: "Ring 0.8 to 2 attack damage, wider.", values: { ring: 2, ringReach: 46 } },
  { text: "New: the falling draw is a sure critical hit on foes in the air.", values: { airCrit: 1 } },
  { text: "Store +100% to +200%.", values: { store: 3 } },
  { text: "New: the landing throws the foes near her up.", values: { lift: 220 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "One more air slash per jump.", drill: { air: 1 } },
  { text: "New: the air slash drives foes down.", drill: { drive: 1 } },
  { text: "Air slash +50%.", drill: { power: 0.5 } },
  { text: "New: landing after an air slash releases every stored cut.", drill: { land: 1 } },
  { text: "Air slash +50% to +100%.", drill: { power: 1 } },
  { text: "New: a third air slash per jump.", drill: { air: 2 } },
  { text: "New: the landing sends an ink ring for 1.2x AD.", drill: { ring: 1.2 } },
  { text: "Air slash +100% to +250%; the ring doubles.", drill: { power: 2.5, ring: 2.4 } },
]);

export const FALLING_MOON: SkillDef = {
  id: SKILL.falling,
  name: "Falling Moon",
  kind: "attack",
  element: "void",
  risk: "timed",
  button: "jump",
  text: "More air slashes, and landing after one releases her stored cuts.",
  levels: DRILL,
  evolution: {
    partner: SKILL.pass,
    name: "Moonfall",
    text: "The landing after an air slash crashes down for 4x AD around her and knocks foes down.",
    row: evolvedRow(DRILL[7], "The landing crashes for 4x AD and knocks foes down.", {
      ...drillValues({ crash: 4 }),
      ring: 6,
      ringReach: 60,
    }),
  },
};
