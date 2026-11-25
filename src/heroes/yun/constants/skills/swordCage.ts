import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

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

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "Sword Lotus holds feet 1 s longer and cuts for +0.4 AP.", drill: { halt: 2.2, bonus: 0.4 } },
  { text: "New: the lotus pulls foes within 50 px in.", drill: { pull: 50 } },
  { text: "New: a caged foe takes 20% more damage for 3 s.", drill: { mark: 0.2 } },
  { text: "Lotus bonus 1 AP.", drill: { bonus: 1 } },
  { text: "New: the lotus cuts a second time for 0.6 AP.", drill: { second: 0.6 } },
  { text: "Lotus bonus 2 AP; second cut 1.2.", drill: { bonus: 2, second: 1.2 } },
  { text: "New: caged foes are pinned to the floor.", drill: { pin: 1 } },
  { text: "Lotus bonus 4 AP; second cut 2.5.", drill: { bonus: 4, second: 2.5 } },
]);

export const SWORD_CAGE: SkillDef = {
  id: "yu_cage",
  name: "Sword Cage",
  kind: "spell",
  element: "storm",
  risk: "timed",
  button: "I",
  text: "Sword Lotus holds foes longer and cuts again.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_needle",
    name: "Jade Prison",
    text: "The lotus keeps spinning, cutting three more times.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Pin 3 s; +40% damage.", { pin: 3, mark: 0.4 }),
      "The lotus cuts three more times.",
      { prison: 3 },
    ),
  },
};
