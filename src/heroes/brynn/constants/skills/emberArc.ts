import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` AP of each crescent, `recharge` seconds, `reach` pixels it flies, `size` how much bigger it is, `burn`
 *  seconds foes burn, `count` crescents thrown, `back` the crescents come back to her */
const LEVELS = levelRows([
  {
    text: "Learn Ember Arc: throw a tall crimson crescent along the line ahead.",
    values: { power: 2, recharge: 4, reach: 200, count: 1 },
  },
  { text: "Recharge 4 to 3 s.", values: { recharge: 3 } },
  { text: "New: the crescent sets foes burning.", values: { burn: 2 } },
  { text: "New: the crescent is half again as tall.", values: { size: 0.5 } },
  { text: "Power 2 to 3.5 AP.", values: { power: 3.5 } },
  { text: "New: two crescents, one after the other.", values: { count: 2 } },
  { text: "New: crescents fly the whole screen.", values: { reach: 320 } },
  { text: "Power 3.5 to 7 AP; three crescents.", values: { power: 7, count: 3 } },
]);

export const EMBER_ARC: SkillDef = {
  id: "br_arc",
  name: "Ember Arc",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "An ability: throw a tall crimson crescent that cuts every foe along the line. Held, a fan of three.",
  levels: LEVELS,
  evolution: {
    partner: "br_embers",
    name: "Crimson Moon",
    text: "The crescents turn at the end of their flight and cut back through the line to her.",
    row: evolvedRow(LEVELS[7], "The crescents come back through the line.", { back: 1 }),
  },
};
