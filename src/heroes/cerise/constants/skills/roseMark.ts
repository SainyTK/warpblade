import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `mark` added damage of her blows on a marked foe, `markTime` seconds a mark lasts, `points` the arrival
 *  gives, `pierce` the arrival thrust reaches the foe behind, `recharge` seconds of the warp's wait, `refund` a marked
 *  foe that falls gives the warp back, `markKeen` what a Keen blow adds on a marked foe, `charges` warps in a row,
 *  `strike` the arrival's power; evolved `seal` px round a marked foe that falls in which every foe is marked */
const NATIVE = levelRows([
  { text: "Mark bonus +25% to +40%; it lasts 6 s.", values: { mark: 0.4, markTime: 6 } },
  { text: "New: the arrival thrust gives a Point.", values: { points: 1 } },
  { text: "New: the arrival thrust pierces to the foe behind.", values: { pierce: 1 } },
  { text: "Warp recharge 2 to 1.5 s.", values: { recharge: 1.5 } },
  { text: "New: a marked foe that falls gives the warp back.", values: { refund: 1 } },
  { text: "Keen blows on a marked foe +60% to +120%.", values: { markKeen: 1.2 } },
  { text: "New: two warps in a row.", values: { charges: 2 } },
  { text: "Arrival thrust 1.8 to 3.2 AD.", values: { strike: 3.2 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "Warp strike +30%; its arrival sets the Rose mark.", drill: { warp: 0.3, recharge: 0 } },
  { text: "Warp recharge -15%.", drill: { recharge: 0.15 } },
  { text: "New: the arrival staggers its foe.", drill: { stagger: 0.4 } },
  { text: "Warp +30% to +80%; recharge -25%.", drill: { warp: 0.8, recharge: 0.25 } },
  { text: "New: the arrival pierces to the foes behind for 1.5 AD.", drill: { pierce: 1.5 } },
  { text: "Warp +80% to +150%; recharge -35%.", drill: { warp: 1.5, recharge: 0.35 } },
  { text: "New: the arrival restores an air dash and the air thrust.", drill: { restore: 1 } },
  { text: "Warp +150% to +250%; recharge -45%; pierce 4 AD.", drill: { warp: 2.5, recharge: 0.45, pierce: 4 } },
]);

export const ROSE_MARK: SkillDef = {
  id: "ce_markwarp",
  name: "Rose Mark",
  kind: "movement",
  element: "void",
  risk: "timed",
  button: "J",
  text: "The warp strike hits harder, recharges sooner and sets the Rose mark.",
  levels: LEVELS,
  evolution: {
    partner: "ce_lunge",
    name: "Crimson Seal",
    text: "The arrival marks every foe within 70 px.",
    row: evolvedRow(LEVELS[7], "The arrival marks every foe within 70 px.", {
      ...drillValues({ garden: 70 }),
      seal: 60,
    }),
  },
};
