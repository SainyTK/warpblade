import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `stacks` a parry lays on the attacker, `max`, `damage` AD a tick per stack, `duration` seconds, `linkStacks`
 *  a riposte link adds, `halt` seconds a cursed walker's feet are held, `burst` a cursed foe that falls curses foes
 *  within this many px, `taken` added damage a cursed foe takes; evolved `tear` AD per stack the last link of a chain tears out */
const NATIVE = levelRows([
  {
    text: "A parry curses the attacker: 3 stacks of 0.2 AD a tick.",
    values: { stacks: 3, max: 8, damage: 0.2, duration: 4 },
  },
  { text: "New: each riposte link adds a stack.", values: { linkStacks: 1 } },
  { text: "Curse 0.2 to 0.45 AD a tick.", values: { damage: 0.45 } },
  { text: "New: cursed walkers' feet are held for 1 s.", values: { halt: 1 } },
  { text: "A parry lays 3 to 5 stacks; up to 12.", values: { stacks: 5, max: 12 } },
  { text: "New: a cursed foe that falls curses the foes round it.", values: { burst: 40 } },
  { text: "New: cursed foes take +20% from every source; it lasts 6 s.", values: { taken: 0.2, duration: 6 } },
  { text: "Curse 0.45 to 1.8 AD a tick.", values: { damage: 1.8 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "A parry curses the attacker: 3 stacks of 0.2 AD a tick.", drill: {} },
  { text: "New: each thrust on a cursed foe adds a stack.", drill: { thrust: 1 } },
  { text: "Curse 0.2 to 0.45 AD a tick.", drill: {} },
  { text: "New: cursed walkers' feet are held for 1 s.", drill: {} },
  { text: "A parry lays 3 to 5 stacks; up to 12.", drill: {} },
  { text: "New: a cursed foe that falls curses the foes round it.", drill: {} },
  { text: "New: cursed foes take +20% from every source; it lasts 6 s.", drill: {} },
  { text: "Curse 0.45 to 1.8 AD a tick.", drill: {} },
]);

export const WILTING_CURSE: SkillDef = {
  id: "ce_curse",
  name: "Wilting Curse",
  kind: "dot",
  element: "venom",
  risk: "precise",
  button: "auto",
  text: "A parry curses the attacker, and the curse eats at it.",
  levels: LEVELS,
  evolution: {
    partner: "ce_riposte",
    name: "Last Petal",
    text: "The lunge tears the curse out at once for 3 AD a stack.",
    row: evolvedRow(LEVELS[7], "The lunge tears the curse out, 3 AD a stack.", {
      ...drillValues({ tear: 3 }),
      tear: 3,
    }),
  },
};
