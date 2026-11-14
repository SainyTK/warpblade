import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `stacks` a parry lays on the attacker, `max`, `damage` AD a tick per stack, `duration` seconds, `linkStacks`
 *  a riposte link adds, `halt` seconds a cursed walker's feet are held, `burst` a cursed foe that falls curses foes
 *  within this many px; evolved `tear` AD per stack the last link of a chain tears out */
const LEVELS = levelRows([
  {
    text: "A parry curses the attacker: 3 stacks of 0.2 AD a tick.",
    values: { stacks: 3, max: 8, damage: 0.2, duration: 4 },
  },
  { text: "New: each riposte link adds a stack.", values: { linkStacks: 1 } },
  { text: "Curse 0.2 to 0.45 AD a tick.", values: { damage: 0.45 } },
  { text: "New: cursed walkers' feet are held for 1 s.", values: { halt: 1 } },
  { text: "A parry lays 3 to 5 stacks; up to 12.", values: { stacks: 5, max: 12 } },
  { text: "New: a cursed foe that falls curses the foes round it.", values: { burst: 40 } },
  { text: "Curse 0.45 to 0.9 AD a tick, lasting 6 s.", values: { damage: 0.9, duration: 6 } },
  { text: "Curse 0.9 to 1.8 AD a tick.", values: { damage: 1.8 } },
]);

export const WILTING_CURSE: SkillDef = {
  id: "ce_curse",
  name: "Wilting Curse",
  kind: "dot",
  risk: "precise",
  button: "auto",
  text: "A parry curses the attacker, and the curse eats at it.",
  levels: LEVELS,
  evolution: {
    partner: "ce_riposte",
    name: "Last Petal",
    text: "The last link of a riposte chain tears the curse out at once for 3 AD a stack.",
    row: evolvedRow(LEVELS[7], "The chain's last link tears the curse out, 3 AD a stack.", { tear: 3 }),
  },
};
