import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { onDrill } from "./drillLevels";

/** values: `tick` ability power a stack deals every half second, `stacks` laid by a block, `max` stacks a foe can carry, `parry` a parry lays the most, `bash` a Guard bash lays one (in the drill, a Shield bash that lands), `heal` HP each tick gives back, `spread` px round the attacker that take stacks too, `burst` ability power each stack deals when the stacks fill */
const NATIVE = levelRows([
  { text: "Blocked attackers burn with Penance.", values: { tick: 0.1, stacks: 2, max: 4 } },
  { text: "Penance burns harder.", values: { tick: 0.14 } },
  { text: "New: a parry lays the most stacks.", values: { parry: 1 } },
  { text: "New: a Guard bash lays a stack.", values: { bash: 1 } },
  { text: "Burns harder; up to 6 stacks.", values: { tick: 0.2, max: 6 } },
  { text: "New: each tick heals you 0.5 HP.", values: { heal: 0.5 } },
  { text: "New: foes near the attacker burn too.", values: { spread: 30 } },
  { text: "Burns five times as hard as at first; 8 stacks.", values: { tick: 0.5, max: 8 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "Blocked attackers burn with Penance.", drill: {} },
  { text: "Penance burns harder.", drill: {} },
  { text: "New: a parry lays the most stacks.", drill: {} },
  { text: "New: a Shield bash that lands lays a stack.", drill: { bash: 1 } },
  { text: "Burns harder; up to 6 stacks.", drill: {} },
  { text: "New: each tick heals you 0.5 HP.", drill: {} },
  { text: "New: foes near the attacker burn too.", drill: {} },
  { text: "Burns five times as hard as at first; 8 stacks.", drill: {} },
]);

export const PENANCE: SkillDef = {
  id: "al_penance",
  name: "Penance",
  kind: "dot",
  risk: "easy",
  button: "K",
  text: "A foe whose blow you block burns with Penance. Grows with ability power.",
  levels: LEVELS,
  evolution: {
    partner: "al_mend",
    name: "Atonement",
    text: "When a foe's Penance fills it bursts, each stack a heavy hit.",
    row: evolvedRow(LEVELS[7], "Full Penance bursts.", { burst: 0.6 }),
  },
};
