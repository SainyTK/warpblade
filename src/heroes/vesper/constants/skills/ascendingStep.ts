import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `air` air blows added, `jumpCut` the jump's cut in attack damage and `jumpLaunch` it throws foes up,
 *  `doubleCut` the double jump's ring in attack damage, `airDash` a dodge in the air, `refresh` an air blow gives the
 *  double jump back once per jump (every time once evolved) */
const LEVELS = levelRows([
  { text: "One more air blow before you land.", values: { air: 1 } },
  { text: "New: the jump from the floor cuts foes beside you.", values: { jumpCut: 0.8 } },
  { text: "The jump cut 0.8 to 1.2, and it throws foes up.", values: { jumpCut: 1.2, jumpLaunch: 1 } },
  { text: "New: the double jump cuts all round you.", values: { doubleCut: 1 } },
  { text: "New: you can dodge in the air.", values: { airDash: 1 } },
  { text: "The double jump's cut 1 to 1.6.", values: { doubleCut: 1.6 } },
  { text: "New: an air blow that lands gives the double jump back once.", values: { refresh: 1 } },
  { text: "Two more air blows in all.", values: { air: 2 } },
]);

export const ASCENDING_STEP: SkillDef = {
  id: "ve_ascend",
  name: "Ascending Step",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "A longer air string, and jumps that cut.",
  levels: LEVELS,
  evolution: {
    partner: "ve_sky",
    name: "Moonlit Steps",
    text: "Every jump cuts all round you for 2 times attack damage, and every air blow that lands gives the double jump back.",
    row: evolvedRow(LEVELS[7], "Every jump cuts round you; endless double jumps.", { doubleCut: 2 }),
  },
};
