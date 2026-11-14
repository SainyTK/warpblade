import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: `store` the factor on what the return cut stores, `behind` it also cuts behind, `launch` it throws foes up
 *  this fast, `crescent` attack damage of the ink crescent it leaves, which lasts `crescentTime` s and with
 *  `crescentStore` stores its cut, `ring` seconds the crescent turns round her as a ring */
const LEVELS = levelRows([
  { text: "Return cuts store +40%.", values: { store: 1.4 } },
  { text: "New: the return cut also cuts behind her.", values: { behind: 1 } },
  { text: "Return store +40% to +80%.", values: { store: 1.8 } },
  { text: "New: the return cut throws light foes up.", values: { launch: 150 } },
  {
    text: "New: the return cut leaves an ink crescent that cuts what touches it.",
    values: { crescent: 0.6, crescentTime: 0.6 },
  },
  { text: "Return store +80% to +150%.", values: { store: 2.5 } },
  { text: "New: the crescent stores its cut and lasts 1 s.", values: { crescentStore: 1, crescentTime: 1 } },
  { text: "Return store +150% to +160%; the crescent cuts harder.", values: { store: 2.6, crescent: 1 } },
]);

export const REVERSE_EDGE: SkillDef = {
  id: SKILL.reverse,
  name: "Reverse Edge",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The return cut stores more, then cuts behind her too and leaves an ink crescent.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.flow,
    name: "Full Circle",
    text: "The return cut's crescent becomes a ring of ink that turns round her for 2 seconds.",
    row: evolvedRow(LEVELS[7], "The crescent turns round you as a ring for 2 s.", { ring: 2 }),
  },
};
