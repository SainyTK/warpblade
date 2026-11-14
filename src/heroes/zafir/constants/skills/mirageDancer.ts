import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a parry calls a dancer, `power` attack damage of each spin on the attacker (the payoff), `plain` on every other foe, `life` seconds it dances, `wounds` wounds a spin opens, `dodge` a perfect dodge calls one too, `blind` it blinds minions round it, `pair` a dancer each side, `burst` evolved, attack damage of the sand blades its last spin bursts into */
const LEVELS = levelRows([
  {
    text: "A parry may call a mirage dancer that spins through the attacker.",
    values: { chance: 0.5, power: 0.7, plain: 0.3, life: 1.5 },
  },
  { text: "Chance 50% to 75%.", values: { chance: 0.75 } },
  { text: "New: the dancer's spins open wounds.", values: { wounds: 1 } },
  { text: "New: a perfect dodge calls one too.", values: { dodge: 1 } },
  { text: "Dancer 0.7 to 1.8; it dances 2 s.", values: { power: 1.8, life: 2 } },
  { text: "New: the dancer blinds the minions round it.", values: { blind: 1 } },
  { text: "New: two dancers, one each side of the attacker.", values: { pair: 1 } },
  { text: "A parry always calls them; dancer 1.8 to 5.", values: { chance: 1, power: 5 } },
]);

export const MIRAGE_DANCER: SkillDef = {
  id: "za_mirage",
  name: "Mirage Dancer",
  kind: "summon",
  risk: "precise",
  button: "K",
  text: "A parry may call a mirage dancer beside the attacker that spins through it and the foes round it.",
  levels: LEVELS,
  evolution: {
    partner: "za_slip",
    name: "Court of Mirages",
    text: "The dancers' last spin bursts into sand blades, 40 times attack damage on the attacker.",
    row: evolvedRow(LEVELS[7], "Their last spin bursts for 40.", { burst: 40 }),
  },
};
