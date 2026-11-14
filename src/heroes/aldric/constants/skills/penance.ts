import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `tick` ability power a stack deals every half second, `stacks` laid by a block, `max` stacks a foe can carry, `parry` a parry lays the most, `bash` a Guard bash lays one, `heal` HP each tick gives back, `spread` px round the attacker that take stacks too, `burst` ability power each stack deals when the stacks fill */
const LEVELS = levelRows([
  { text: "Blocked attackers burn with Penance.", values: { tick: 0.1, stacks: 2, max: 4 } },
  { text: "Penance burns harder.", values: { tick: 0.14 } },
  { text: "New: a parry lays the most stacks.", values: { parry: 1 } },
  { text: "New: a Guard bash lays a stack.", values: { bash: 1 } },
  { text: "Burns harder; up to 6 stacks.", values: { tick: 0.2, max: 6 } },
  { text: "New: each tick heals you 0.5 HP.", values: { heal: 0.5 } },
  { text: "New: foes near the attacker burn too.", values: { spread: 30 } },
  { text: "Burns five times as hard as at first; 8 stacks.", values: { tick: 0.5, max: 8 } },
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
