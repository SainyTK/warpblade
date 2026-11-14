import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ABILITY_COST } from "../abilities";

/** values: `power` ability power of a lance, `pierce` foes one lance passes through, `recharge` seconds, `burn` ability power a burn stack deals a tick, `count` lances a cast throws, `burst` radius of a burst where a lance ends, `mark` extra damage a struck foe takes for 4 s */
const LEVELS = levelRows([
  { text: `Throw a lance of light (${ABILITY_COST.lance} MP).`, values: { power: 1.6, pierce: 1, recharge: 5 } },
  { text: "Lance power 1.6 to 2.", values: { power: 2 } },
  { text: "New: lances pass through 3 foes.", values: { pierce: 3 } },
  { text: "New: lances burn the foes they strike.", values: { burn: 0.2 } },
  { text: "Lance power 2.4; recharge 4 s.", values: { power: 2.4, recharge: 4 } },
  { text: "New: two lances a cast.", values: { count: 2 } },
  { text: "New: a lance bursts where it ends.", values: { burst: 26 } },
  { text: "Lance power 2.4 to 3.2.", values: { power: 3.2 } },
]);

export const DAWN_LANCE: SkillDef = {
  id: "al_lance",
  name: "Dawn Lance",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "A new ability: a lance of light thrown straight ahead. Held, three in a fan. Grows with ability power.",
  levels: LEVELS,
  evolution: {
    partner: "al_verdict",
    name: "Spear of Morning",
    text: "A spear twice the size that passes through every foe and leaves each one taking 25% more.",
    row: evolvedRow(LEVELS[7], "A great spear through every foe.", { pierce: 99, mark: 0.25 }),
  },
};
