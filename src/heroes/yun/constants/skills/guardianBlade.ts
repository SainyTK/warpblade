import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a landed blow calls one, `life` seconds it stays, `power` attack damage of each strike, `every` seconds between strikes, `targets` foes each strike reaches, `most` guardians at once, `chill` seconds a strike slows, `always` the guardians stay, `cooldown` least seconds between calls */
const LEVELS = levelRows([
  {
    text: "A landed blow may call a guardian blade that strikes foes near you.",
    values: { chance: 0.15, life: 4, power: 0.4, every: 0.8, targets: 1, most: 1, cooldown: 1 },
  },
  { text: "Chance 15% to 25%.", values: { chance: 0.25 } },
  { text: "New: each strike reaches two foes.", values: { targets: 2 } },
  { text: "Strike power 0.4 to 0.8.", values: { power: 0.8 } },
  { text: "New: two guardians at once.", values: { most: 2 } },
  { text: "Guardians stay 7 s and strike faster.", values: { life: 7, every: 0.6 } },
  { text: "New: strikes slow foes.", values: { chill: 0.8 } },
  { text: "New: three guardians at once; power 1.2.", values: { most: 3, power: 1.2 } },
]);

export const GUARDIAN_BLADE: SkillDef = {
  id: "yu_guardian",
  name: "Guardian Blade",
  kind: "summon",
  element: "void",
  risk: "easy",
  button: "auto",
  text: "A landed blow may call a guardian blade that circles you and strikes foes near.",
  levels: LEVELS,
  evolution: {
    partner: "yu_breath",
    name: "Heavenly Guard",
    text: "Three guardian blades circle you all the time.",
    row: evolvedRow(LEVELS[7], "Three guardians, always out.", { always: 1 }),
  },
};
