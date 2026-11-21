import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` AD a crush stack deals a tick, `max` stacks, `every` seconds between ticks, `time` seconds they
 *  last, `air` launched foes take stacks too, `spread` a crushed foe that falls passes its stacks on, `halt` crushed
 *  foes are held in place, `spike` a foe driven into the floor takes this many at once, `grind` the next slam on a
 *  crushed foe consumes its stacks for this much AD each */
const LEVELS = levelRows([
  {
    text: "Foes she knocks down are crushed and bleed while they lie there.",
    values: { damage: 0.12, max: 3, every: 0.5, time: 2 },
  },
  { text: "Crush 0.12 to 0.2 AD a tick.", values: { damage: 0.2 } },
  { text: "New: launched foes are crushed too.", values: { air: 1 } },
  { text: "A foe holds 6 stacks; they last 3 s and tick every 0.35 s.", values: { max: 6, time: 3, every: 0.35 } },
  { text: "New: a foe driven into the floor takes 3 stacks at once.", values: { spike: 3 } },
  {
    text: "New: a crushed foe that falls passes its stacks to the foes round it; crush 0.4 AD.",
    values: { damage: 0.4, spread: 1 },
  },
  { text: "New: crushed foes are held in place while they bleed.", values: { halt: 1 } },
  { text: "Crush 0.4 to 0.8 AD; a foe holds 10.", values: { damage: 0.8, max: 10 } },
]);

export const CRUSHING_WEIGHT: SkillDef = {
  id: "br_crush",
  name: "Crushing Weight",
  kind: "dot",
  risk: "timed",
  button: "auto",
  text: "Her second and third slashes crush foes, and crushed foes bleed.",
  levels: LEVELS,
  evolution: {
    partner: "br_launch",
    name: "Grindstone",
    text: "Her next slam on a crushed foe grinds all its stacks out at once.",
    row: evolvedRow(LEVELS[7], "The slam grinds out every stack.", { grind: 1.5 }),
  },
};
