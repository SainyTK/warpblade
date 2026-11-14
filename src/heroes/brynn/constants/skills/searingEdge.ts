import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` AD a stack burns each tick, `max` stacks a foe holds, `stacks` laid by each blow, `heavy` stacks
 *  a heavy swing lays, `taken` a foe with embers takes this much more, `slam` the slam spreads a foe's stacks to the
 *  foes round it, `burst` at most stacks a foe bursts for this much AD per stack */
const LEVELS = levelRows([
  { text: "Her blows leave searing embers that burn foes.", values: { damage: 0.06, max: 4, stacks: 1, heavy: 1 } },
  { text: "Embers burn 0.06 to 0.1 AD a tick.", values: { damage: 0.1 } },
  { text: "New: a Keen blow lays 3 embers.", values: { heavy: 3 } },
  { text: "New: a foe with embers takes 15% more from her; it holds 8.", values: { max: 8, taken: 0.15 } },
  { text: "New: the slam spreads embers to the foes round its target.", values: { slam: 1 } },
  { text: "Embers burn 0.1 to 0.2 AD.", values: { damage: 0.2 } },
  { text: "New: each blow lays 2 embers; a foe holds 12.", values: { stacks: 2, max: 12 } },
  { text: "Embers burn 0.2 to 0.4 AD.", values: { damage: 0.4 } },
]);

export const SEARING_EDGE: SkillDef = {
  id: "br_embers",
  name: "Searing Edge",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Her blows leave embers that burn foes, more with every blow.",
  levels: LEVELS,
  evolution: {
    partner: "br_arc",
    name: "Forge Heart",
    text: "A foe filled with embers bursts into a crimson blast that burns those round it.",
    row: evolvedRow(LEVELS[7], "A foe full of embers bursts.", { burst: 1.2 }),
  },
};
