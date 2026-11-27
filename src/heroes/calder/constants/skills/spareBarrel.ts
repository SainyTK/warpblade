import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a parry plants one, `life` seconds it stands, `every` seconds between its shots, `power` attack damage a shot, `pierce` its shots pierce, `most` barrels at once, `stagger` seconds its shots stagger, `dodge` a perfect dodge plants one too, `cooldown` least seconds between plants */
const LEVELS = levelRows([
  {
    text: "A parry may plant a barrel that shoots the nearest foe.",
    values: { chance: 0.5, life: 4, every: 0.6, power: 0.6, most: 1, cooldown: 1 },
  },
  { text: "Chance 50% to 80%.", values: { chance: 0.8 } },
  { text: "New: its shots pierce.", values: { pierce: 1 } },
  { text: "Shot 0.6 to 1.5; stands 6 s.", values: { power: 1.5, life: 6 } },
  { text: "New: two barrels at once.", values: { most: 2 } },
  { text: "New: its shots stagger the foe.", values: { stagger: 0.2 } },
  { text: "New: dashing through a blow plants one too.", values: { dodge: 1 } },
  { text: "Shot 1.5 to 4; always plants.", values: { power: 4, chance: 1 } },
]);

export const SPARE_BARREL: SkillDef = {
  id: "ca_turret",
  name: "Spare Barrel",
  kind: "summon",
  element: "frost",
  risk: "precise",
  button: "K",
  text: "A parry may plant a spare barrel on legs that shoots the nearest foe.",
  levels: LEVELS,
  evolution: {
    partner: "ca_pointblank",
    name: "Gun Nest",
    text: "Three barrels at once, firing faster and harder.",
    row: evolvedRow(LEVELS[7], "Three barrels, faster and harder.", { most: 3, every: 0.4, power: 5 }),
  },
};
