import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a kill calls one, `power` attack damage of a pounce, `life` seconds it stays, `every` seconds between pounces, `most` lions at once, `stun` seconds a pounce knocks a foe down, `roar` attack damage of a roar ring as it comes, `mark` extra damage a pounced foe takes for 3 s, `cooldown` least seconds between calls */
const LEVELS = levelRows([
  {
    text: "A kill may call a lion of light (25%).",
    values: { chance: 0.25, power: 0.6, life: 5, every: 1.2, most: 1, cooldown: 1 },
  },
  { text: "Chance 25% to 40%.", values: { chance: 0.4 } },
  { text: "New: a pounce knocks the foe down.", values: { stun: 0.4 } },
  { text: "New: it roars as it comes, striking foes near.", values: { roar: 0.5 } },
  { text: "Pounces 0.6 to 0.9; it stays 7 s.", values: { power: 0.9, life: 7 } },
  { text: "New: two lions at once.", values: { most: 2 } },
  { text: "New: a pounced foe takes 10% more for 3 s.", values: { mark: 0.1 } },
  { text: "Pounces 1.3 and come quicker.", values: { power: 1.3, every: 0.9 } },
]);

export const SUN_LION: SkillDef = {
  id: "al_lion",
  name: "Sun Lion",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A foe falling may call a lion of light that pounces on foes.",
  levels: LEVELS,
  evolution: {
    partner: "al_oath",
    name: "Pride of Dawn",
    text: "Three lions walk with him always.",
    row: evolvedRow(LEVELS[7], "Three lions, always out.", { most: 3, always: 1 }),
  },
};
