import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values (the warp's tune): `path` attack damage to foes the thrown katana passes, `pathStore` attack damage it stores
 *  in them, `recharge`, `charges`, `strike` the arrival's power, `cost` MP; `breath` an arrival gives a breath;
 *  `arrival` the factor on the arrival's stored cut; `clean` each arrival's click is a clean sheathe */
const LEVELS = levelRows([
  { text: "The thrown katana cuts the foes it passes.", values: { path: 0.8 } },
  { text: "Warp recharge 2 to 1.6 s.", values: { recharge: 1.6 } },
  { text: "New: foes the katana passes store a cut.", values: { pathStore: 1.2 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
  { text: "Arrival power 1.8 to 2.3.", values: { strike: 2.3 } },
  { text: "New: each arrival gives a breath.", values: { breath: 1 } },
  { text: "Warp cost 10 to 6 MP.", values: { cost: 6 } },
  { text: "New: the arrival stores twice as much.", values: { arrival: 2 } },
]);

export const PASSING_DRAW: SkillDef = {
  id: SKILL.pass,
  name: "Passing Draw",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "J held: the thrown katana cuts what it passes, and the warp comes back sooner.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.step,
    name: "Thousand Paces",
    text: "Warps cost no MP and recharge in 1 second, and every arrival's click is a clean sheathe.",
    row: evolvedRow(LEVELS[7], "Free warps every 1 s; each click is clean.", { cost: 0, recharge: 1, clean: 1 }),
  },
};
