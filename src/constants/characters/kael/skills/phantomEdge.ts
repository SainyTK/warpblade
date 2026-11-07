import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a back blow calls a phantom, `repeat` share of the blow it repeats, `stay` seconds it stays and
 *  repeats every blow on that foe, `heavy` its blows break wind-ups, `back` its blows land from behind, `most`
 *  phantoms at once, `cooldown` least seconds between calls */
const LEVELS = levelRows([
  {
    text: "A blow from behind may call a phantom that repeats it.",
    values: { chance: 0.5, repeat: 1, most: 1, cooldown: 0.4 },
  },
  { text: "Chance 50% to 75%.", values: { chance: 0.75 } },
  { text: "New: the phantom stays and repeats every blow on that foe.", values: { stay: 2 } },
  { text: "Phantom blows 100% to 130%.", values: { repeat: 1.3 } },
  { text: "New: the phantom's blows land from behind.", values: { back: 1 } },
  { text: "New: the phantom's blows break wind-ups; always called.", values: { heavy: 1, chance: 1, stay: 3 } },
  { text: "New: up to 2 phantoms at once.", values: { most: 2 } },
  { text: "Phantom blows 130% to 220%.", values: { repeat: 2.2 } },
]);

export const PHANTOM_EDGE: SkillDef = {
  id: "k_echo",
  name: "Phantom Edge",
  kind: "summon",
  risk: "precise",
  button: "auto",
  text: "A sword blow from behind may call a phantom of Kael that repeats the blow.",
  levels: LEVELS,
  evolution: {
    partner: "k_mirror",
    name: "Phantom Host",
    text: "Phantoms come to any sword blow, no back blow needed, and stay on their foe repeating every blow.",
    row: evolvedRow(LEVELS[7], "Phantoms come to any blow, not only back blows.", { host: 1 }),
  },
};
