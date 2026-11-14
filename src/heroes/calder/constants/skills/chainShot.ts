import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `cost` MP, `recharge` seconds, `power` ability power of a strike, `drag` foes are dragged along, `twice` each foe is struck twice, `wrap` seconds a struck foe is held fast */
const LEVELS = levelRows([
  { text: "Learn Chain Shot: a spinning chain through a line of foes.", values: { cost: 12, recharge: 5, power: 2 } },
  { text: "Power 2 to 3.", values: { power: 3 } },
  { text: "New: the chain drags foes along.", values: { drag: 1 } },
  { text: "New: it strikes each foe twice.", values: { twice: 1 } },
  { text: "Power 3 to 5; recharge 5 to 4 s.", values: { power: 5, recharge: 4 } },
  { text: "New: foes it strikes are held fast for 1 s.", values: { wrap: 1 } },
  { text: "New: costs 8 MP.", values: { cost: 8 } },
  { text: "Power 5 to 14.", values: { power: 14 } },
]);

export const CHAIN_SHOT: SkillDef = {
  id: "ca_chainshot",
  name: "Chain Shot",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Learn Chain Shot: two weights on a chain spin through every foe in a line.",
  levels: LEVELS,
  evolution: {
    partner: "ca_ricochet",
    name: "Reaper Chain",
    text: "The chain comes back to you and strikes every foe again on the way.",
    row: evolvedRow(LEVELS[7], "The chain comes back, striking again.", { power: 10 }),
  },
};
