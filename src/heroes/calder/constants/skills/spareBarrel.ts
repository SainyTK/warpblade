import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a parry plants one, `life` seconds it stands, `every` seconds between its shots, `power` attack damage a shot, `pierce` its shots pierce, `most` barrels at once, `splash` attack damage of a splash round each struck foe, `dodge` a perfect dodge plants one too, `cooldown` least seconds between plants */
const LEVELS = levelRows([
  {
    text: "A parry may plant a barrel that shoots the nearest foe.",
    values: { chance: 0.5, life: 4, every: 0.6, power: 0.6, most: 1, cooldown: 1 },
  },
  { text: "Chance 50% to 80%.", values: { chance: 0.8 } },
  { text: "New: its shots pierce.", values: { pierce: 1 } },
  { text: "Shot 0.6 to 1.2; stands 6 s.", values: { power: 1.2, life: 6 } },
  { text: "New: two barrels at once.", values: { most: 2 } },
  { text: "New: its shots burst on the foe.", values: { splash: 0.5 } },
  { text: "New: a perfect dodge plants one too.", values: { dodge: 1 } },
  { text: "Shot 1.2 to 3; always plants.", values: { power: 3, chance: 1 } },
]);

export const SPARE_BARREL: SkillDef = {
  id: "ca_turret",
  name: "Spare Barrel",
  kind: "summon",
  risk: "precise",
  button: "K",
  text: "A parry may plant a spare barrel on legs that shoots the nearest foe.",
  levels: LEVELS,
  evolution: {
    partner: "ca_pointblank",
    name: "Gun Nest",
    text: "Three barrels at once, firing hot rounds twice as fast.",
    row: evolvedRow(LEVELS[7], "Three barrels, hot rounds, twice as fast.", { most: 3, every: 0.3, power: 4.5 }),
  },
};
