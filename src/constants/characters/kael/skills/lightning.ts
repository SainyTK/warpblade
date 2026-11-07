import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` of the strike (ability power), `arcs` and `arcPower`, `recharge`, `stun` seconds the struck foe
 *  cannot act, `swordBonus` damage shocked foes take, `twice` the bolt strikes again, `behind` a bolt on the nearest foe
 *  behind too */
const LEVELS = levelRows([
  {
    text: "I strikes a foe ahead with a bolt that arcs to another.",
    values: { power: 2.5, arcs: 1, arcPower: 1.2, recharge: 6 },
  },
  { text: "New: the struck foe is stunned.", values: { stun: 0.5 } },
  { text: "Strike power 2.5 to 3.5; arcs to 2.", values: { power: 3.5, arcs: 2 } },
  { text: "New: shocked foes take +20% damage.", values: { swordBonus: 0.2 } },
  { text: "Arcs to 4; recharge 6 to 4.5 s.", values: { arcs: 4, recharge: 4.5 } },
  { text: "New: the bolt strikes twice.", values: { twice: 1 } },
  { text: "New: a second bolt strikes the nearest foe behind Kael.", values: { behind: 1 } },
  { text: "Strike power 3.5 to 7; arcs hit harder.", values: { power: 7, arcPower: 2.5 } },
]);

export const LIGHTNING: SkillDef = {
  id: "k_volt",
  name: "Lightning",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Learn the lightning spell: a bolt on a foe ahead that arcs on.",
  levels: LEVELS,
  evolution: {
    partner: "k_static",
    name: "Thunderhead",
    text: "A storm cloud stays over the strike and calls down five more bolts that each arc to two foes.",
    row: evolvedRow(LEVELS[7], "A storm cloud calls five more bolts.", { cloud: 5, cloudArcs: 2 }),
  },
};
