import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` ability power of each falling sword, `pin` seconds a caged foe is held, `foes` foes caged at once, `mark` extra damage a caged foe takes, `extra` swords conjured for each foe besides the ones held, `recharge` seconds */
const LEVELS = levelRows([
  {
    text: "Learn Sword Cage: your swords fall round the foe ahead and pin it.",
    values: { power: 0.9, pin: 1, foes: 1, recharge: 3 },
  },
  { text: "Cage power 0.9 to 1.2.", values: { power: 1.2 } },
  { text: "New: the cage takes two foes.", values: { foes: 2 } },
  { text: "Pin 1 s to 1.6 s; power 1.5.", values: { pin: 1.6, power: 1.5 } },
  { text: "New: a caged foe takes 20% more damage.", values: { mark: 0.2 } },
  { text: "Cage power 1.5 to 1.9.", values: { power: 1.9 } },
  { text: "New: one more sword falls on each caged foe.", values: { extra: 1 } },
  { text: "New: the cage takes three foes; power 2.3.", values: { foes: 3, power: 2.3 } },
]);

export const SWORD_CAGE: SkillDef = {
  id: "yu_cage",
  name: "Sword Cage",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Learn Sword Cage: your swords fall round the foe ahead and pin it in place.",
  levels: LEVELS,
  evolution: {
    partner: "yu_needle",
    name: "Jade Prison",
    text: "Caged foes are pinned for 3 s and take 40% more damage.",
    row: evolvedRow(LEVELS[7], "Pin 3 s; +40% damage.", { pin: 3, mark: 0.4 }),
  },
};
