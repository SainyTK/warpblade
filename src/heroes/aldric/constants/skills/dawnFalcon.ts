import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a cast sends it, `power` attack damage to each foe it passes, `passes` swoops it makes, `mark` extra damage a struck foe takes for 3 s, `count` falcons a cast sends, `counter` a parry (and in the native kit a Counterbash) may send one too, `cooldown` least seconds between sends, `burn` attack damage a burn stack of the evolved falcon deals a tick */
const LEVELS = levelRows([
  {
    text: "A cast may send a falcon of light (50%).",
    values: { chance: 0.5, power: 0.8, passes: 1, count: 1, cooldown: 1 },
  },
  { text: "Chance 50% to 75%.", values: { chance: 0.75 } },
  { text: "New: it swoops back through them.", values: { passes: 2 } },
  { text: "New: struck foes take 15% more for 3 s.", values: { mark: 0.15 } },
  { text: "Swoop power 0.8 to 1.2.", values: { power: 1.2 } },
  { text: "New: two falcons.", values: { count: 2 } },
  { text: "New: a parry may send one too.", values: { counter: 1 } },
  { text: "Swoop power 1.8; every cast sends them.", values: { power: 1.8, chance: 1 } },
]);

export const DAWN_FALCON: SkillDef = {
  id: "al_falcon",
  name: "Dawn Falcon",
  kind: "summon",
  element: "blaze",
  risk: "timed",
  button: "auto",
  text: "Casting a spell may send a falcon of light swooping through the foes ahead.",
  levels: LEVELS,
  evolution: {
    partner: "al_dawn",
    name: "Sunbird",
    text: "Falcons swoop three times and set the foes they pass burning.",
    row: evolvedRow(LEVELS[7], "Three swoops that burn.", { passes: 3, burn: 0.2 }),
  },
};
