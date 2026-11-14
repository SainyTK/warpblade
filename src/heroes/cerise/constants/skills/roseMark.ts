import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `mark` added damage of her blows on a marked foe, `markTime` seconds a mark lasts, `points` the arrival
 *  gives, `pierce` the arrival thrust reaches the foe behind, `recharge` seconds of the warp's wait, `refund` a marked
 *  foe that falls gives the warp back, `markKeen` what a Keen blow adds on a marked foe, `charges` warps in a row,
 *  `strike` the arrival's power; evolved `seal` px round a marked foe that falls in which every foe is marked */
const LEVELS = levelRows([
  { text: "Mark bonus +25% to +40%; it lasts 6 s.", values: { mark: 0.4, markTime: 6 } },
  { text: "New: the arrival thrust gives a Point.", values: { points: 1 } },
  { text: "New: the arrival thrust pierces to the foe behind.", values: { pierce: 1 } },
  { text: "Warp recharge 2 to 1.5 s.", values: { recharge: 1.5 } },
  { text: "New: a marked foe that falls gives the warp back.", values: { refund: 1 } },
  { text: "Keen blows on a marked foe +60% to +120%.", values: { markKeen: 1.2 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
  { text: "Arrival thrust 1.8 to 3.2 AD.", values: { strike: 3.2 } },
]);

export const ROSE_MARK: SkillDef = {
  id: "ce_markwarp",
  name: "Rose Mark",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "J held: the warp's Rose mark grows stronger and lasts longer.",
  levels: LEVELS,
  evolution: {
    partner: "ce_lunge",
    name: "Crimson Seal",
    text: "A marked foe that falls marks every foe within 60 px of it.",
    row: evolvedRow(LEVELS[7], "A marked foe that falls marks the foes round it.", { seal: 60 }),
  },
};
