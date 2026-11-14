import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a parry calls him, `power` attack damage of each cut, `cuts` cuts he makes, `counter` a Counterbash may call him too, `stun` seconds his cut knocks the foe down, `barrier` he leaves a Bulwark on you, `cooldown` least seconds between calls, `knights` knights at once */
const LEVELS = levelRows([
  {
    text: "A parry may call a knight of light (50%).",
    values: { chance: 0.5, power: 1.2, cuts: 1, cooldown: 2, knights: 1 },
  },
  { text: "Chance 50% to 80%.", values: { chance: 0.8 } },
  { text: "New: he cuts twice.", values: { cuts: 2 } },
  { text: "New: a Counterbash may call him too.", values: { counter: 1 } },
  { text: "Cut power 1.2 to 1.8.", values: { power: 1.8 } },
  { text: "New: his last cut knocks the foe down.", values: { stun: 0.8 } },
  { text: "New: he leaves a Bulwark on you.", values: { barrier: 1 } },
  { text: "Cut power 2.6; every parry calls him.", values: { power: 2.6, chance: 1 } },
]);

export const OATHSWORN: SkillDef = {
  id: "al_oathsworn",
  name: "Oathsworn",
  kind: "summon",
  risk: "precise",
  button: "K",
  text: "A parry may call a knight of light who cuts the attacker.",
  levels: LEVELS,
  evolution: {
    partner: "al_bulwark",
    name: "Honour Guard",
    text: "Two knights answer, each cutting three times.",
    row: evolvedRow(LEVELS[7], "Two knights, three cuts each.", { knights: 2, cuts: 3 }),
  },
};
