import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a kill calls a falling blade, `power` AD it deals, `reach` its ring each side, `count` blades,
 *  `stun` seconds foes lie down, `launch` it throws foes up, `cooldown` least seconds between calls,
 *  `rain` blades keep falling for this long */
const LEVELS = levelRows([
  {
    text: "A kill may drop a phantom greatsword on the nearest foe.",
    values: { chance: 0.35, power: 1, reach: 18, count: 1, cooldown: 1.2 },
  },
  { text: "Chance 35% to 55%.", values: { chance: 0.55 } },
  { text: "New: the blade knocks foes round it down.", values: { stun: 0.6 } },
  { text: "Power 1 to 1.6 AD.", values: { power: 1.6 } },
  { text: "New: two blades fall on two foes.", values: { count: 2 } },
  { text: "New: the blade throws foes up; its ring reaches 30 px.", values: { reach: 30, launch: 1 } },
  { text: "New: a kill drops one 3 times in 4.", values: { chance: 0.75 } },
  { text: "Power 1.6 to 2.6 AD.", values: { power: 2.6 } },
]);

export const FALLING_BLADE: SkillDef = {
  id: "br_falling",
  name: "Falling Blade",
  kind: "summon",
  element: "void",
  risk: "easy",
  button: "auto",
  text: "Kills may call a phantom greatsword down from the sky onto the next foe.",
  levels: LEVELS,
  evolution: {
    partner: "br_fall",
    name: "Blade Rain",
    text: "Blades keep falling on foes near her for 1.5 s after a kill calls them.",
    row: evolvedRow(LEVELS[7], "Blades rain on foes near her for 1.5 s.", { rain: 1.5 }),
  },
};
