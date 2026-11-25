import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
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

const DRILL = drillRows(LEVELS, [
  { text: "The return cut also cuts behind her for 0.8x AD.", drill: { behind: 0.8 } },
  { text: "New: the return cut throws foes up.", drill: { launch: 1 } },
  { text: "Return cut +50%.", drill: { second: 0.5 } },
  { text: "New: the cut behind stores 1x AD in each foe.", drill: { behindStore: 1 } },
  { text: "New: the return cut chills.", drill: { chill: 1.2 } },
  { text: "Return cut +50% to +120%.", drill: { second: 1.2 } },
  { text: "New: foes cut behind are pulled to her front.", drill: { pull: 1 } },
  { text: "Return cut +120% to +250%; the cut behind doubles.", drill: { second: 2.5, behind: 1.6 } },
]);

export const REVERSE_EDGE: SkillDef = {
  id: SKILL.reverse,
  name: "Reverse Edge",
  kind: "attack",
  element: "frost",
  risk: "easy",
  button: "J",
  text: "The return cut, the second of the chain, also cuts the foes behind her.",
  levels: DRILL,
  evolution: {
    partner: SKILL.flow,
    name: "Full Circle",
    text: "The return cut becomes a full circle: it cuts all around her twice.",
    row: evolvedRow(DRILL[7], "The return cut cuts all around twice.", {
      ...drillValues({ circle: 1 }),
      ring: 2,
    }),
  },
};
