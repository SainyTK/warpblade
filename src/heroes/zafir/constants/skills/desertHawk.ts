import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a kill calls a hawk, `power` attack damage of each dive, `cooldown` least seconds between calls, `wounds` wounds a dive opens, `dives` dives each hawk makes, `stun` seconds a dive knocks a foe down, `any` kills by his skills call one too, `every` evolved, every kill calls one */
const LEVELS = levelRows([
  {
    text: "A foe you fell may call a desert hawk that dives on another.",
    values: { chance: 0.3, power: 1, cooldown: 1, dives: 1 },
  },
  { text: "Chance 30% to 45%.", values: { chance: 0.45 } },
  { text: "New: the hawk opens two wounds.", values: { wounds: 2 } },
  { text: "New: the hawk dives twice.", values: { dives: 2 } },
  { text: "Hawk 1 to 1.5.", values: { power: 1.5 } },
  { text: "New: the dive knocks the foe down.", values: { stun: 0.6 } },
  { text: "New: kills by your skills call hawks too.", values: { any: 1 } },
  { text: "Chance 45% to 60%; hawk 1.5 to 3.5; three dives.", values: { chance: 0.6, power: 3.5, dives: 3 } },
]);

export const DESERT_HAWK: SkillDef = {
  id: "za_hawk",
  name: "Desert Hawk",
  kind: "summon",
  element: "storm",
  risk: "timed",
  button: "auto",
  text: "A foe you fell may call a desert hawk that dives on the nearest foe and opens its wounds.",
  levels: LEVELS,
  evolution: {
    partner: "za_thirst",
    name: "Sky of Hawks",
    text: "Every kill calls a hawk, at most one every 0.6 s, and each dive opens three wounds.",
    row: evolvedRow(LEVELS[7], "Every kill calls a hawk.", { every: 1, wounds: 3 }),
  },
};
