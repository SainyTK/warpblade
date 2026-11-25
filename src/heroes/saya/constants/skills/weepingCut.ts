import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: a release lays `stacks` bleeding stacks (`perCut` one per stored cut) up to `max`, each ticking `damage`
 *  attack damage every `every` s for `time` s; `weak` added to releases on a bleeding foe; `early` early releases bleed
 *  too; `spread` a foe that dies bleeding
 *  passes its stacks on; `burst` attack damage per stack when a release finds `burstAt` or more */
const LEVELS = levelRows([
  { text: "A full release leaves the foe bleeding.", values: { stacks: 1, max: 3, damage: 0.06, every: 0.5, time: 3 } },
  { text: "New: bleeding foes take +10% from releases; most stacks 5.", values: { weak: 0.1, max: 5 } },
  { text: "New: early releases leave it bleeding too.", values: { early: 1 } },
  { text: "Bleed +60%.", values: { damage: 0.1 } },
  { text: "New: a release lays a stack for each cut stored.", values: { perCut: 1 } },
  { text: "Bleed +60% to +150%; most stacks 8.", values: { damage: 0.15, max: 8 } },
  { text: "New: a foe that dies bleeding passes its stacks to the foes near it.", values: { spread: 1 } },
  { text: "Bleed +150% to +400%.", values: { damage: 0.3 } },
]);

export const WEEPING_CUT: SkillDef = {
  id: SKILL.weep,
  name: "Weeping Cut",
  kind: "dot",
  element: "venom",
  risk: "easy",
  button: "auto",
  text: "Released cuts keep weeping: the foe bleeds for a while after each release.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.flow,
    name: "Weeping Moon",
    text: "A release on a foe with 6 or more stacks bursts them all at once for 2 attack damage each.",
    row: evolvedRow(LEVELS[7], "Six stacks or more burst on release.", { burst: 2, burstAt: 6 }),
  },
};
