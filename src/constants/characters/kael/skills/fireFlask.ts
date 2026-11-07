import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` of the burst (ability power), `radius`, `burn` seconds, `recharge`, `stun` seconds the burst knocks
 *  foes down, `floor` seconds the floor burns, `ignite` power of a burning foe's explosion when thrown, `flasks` */
const LEVELS = levelRows([
  {
    text: "I throws a flask that bursts and sets foes burning.",
    values: { power: 1.6, radius: 34, burn: 1.5, recharge: 10, flasks: 1 },
  },
  { text: "New: the burst knocks foes down.", values: { stun: 0.5 } },
  { text: "New: the burst leaves the floor burning.", values: { floor: 2 } },
  { text: "Burst power 1.6 to 2.4; recharge 10 to 7 s.", values: { power: 2.4, recharge: 7, burn: 3 } },
  { text: "New: a burning foe thrown up or down explodes.", values: { ignite: 2 } },
  { text: "Burst radius 34 to 50 px.", values: { radius: 50 } },
  { text: "New: two flasks at once.", values: { flasks: 2 } },
  { text: "Burst power 2.4 to 4; burns longer.", values: { power: 4, burn: 4 } },
]);

export const FIRE_FLASK: SkillDef = {
  id: "k_flame",
  name: "Fire Flask",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Learn the fire spell: a flask that bursts and sets foes burning.",
  levels: LEVELS,
  evolution: {
    partner: "k_familiar",
    name: "Sunflask",
    text: "The flask bursts, then three smaller flasks fly at nearby foes and burst on them.",
    row: evolvedRow(LEVELS[7], "Each burst throws three more flasks.", { children: 3 }),
  },
};
