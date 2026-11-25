import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { withDrill } from "./drillLevels";

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

const DRILL_LEVELS = withDrill(LEVELS, [
  { text: "Chain Shot +50% and arcs to one more foe.", drill: { bonus: 0.5, arcs: 1 } },
  { text: "New: shock lasts 2 s.", drill: { shock: 1 } },
  { text: "New: arcs to two more foes.", drill: { arcs: 2 } },
  { text: "Chain Shot +50% to +120%.", drill: { bonus: 1.2 } },
  { text: "New: cuts with Chain Shot loaded arc too.", drill: { infusedArc: 1 } },
  { text: "Chain Shot +250%; three arcs.", drill: { bonus: 2.5, arcs: 3 } },
  { text: "New: arcs stagger.", drill: { stagger: 0.3 } },
  { text: "Chain Shot +250% to +500%.", drill: { bonus: 5 } },
]);

export const CHAIN_SHOT: SkillDef = {
  id: "ca_chainshot",
  name: "Chain Shot",
  kind: "spell",
  element: "storm",
  risk: "timed",
  button: "I",
  text: "Chain Shot hits harder and arcs on to more foes.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "ca_ricochet",
    name: "Reaper Chain",
    text: "Chain Shot strikes twice.",
    row: evolvedRow(DRILL_LEVELS[7], "Chain Shot strikes twice.", {
      power: 10,
    }),
  },
};
