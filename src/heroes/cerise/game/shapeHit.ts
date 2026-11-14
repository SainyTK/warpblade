import { skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { MoveHit } from "../../../types/move";
import type { CeriseMoveId } from "../types/moves";
import { shapeLunge } from "./lunge";

/** the thrusts of the string, which Pinning Point and a Keen press with Measured Touch reach farther */
const THRUSTS: ReadonlySet<CeriseMoveId> = new Set(["leadThrust", "secondThrust", "risingThrust", "twinFlick"]);

/** stretch a blow's line `px` farther ahead */
const reach = (hit: MoveHit, px: number): MoveHit =>
  px ? { ...hit, box: [hit.box[0], hit.box[1], hit.box[2] + px, hit.box[3]] } : hit;

/**
 * A combo blow as Cerise's Points and skills shape it: the lunge takes its Points and Long Lunge; Pinning Point and a
 * Keen thrust with Measured Touch reach farther; the rising thrust is Feint's feint, breaking guards and cutting behind.
 */
export function shapeHit(id: CeriseMoveId, hit: MoveHit): MoveHit {
  if (id === "longLunge") return reach(shapeLunge(hit), hero.keen ? (skillValues("ce_measure").reach ?? 0) : 0);
  if (id === "dive") return { ...hit, power: hit.power * (1 + (skillValues("ce_dive").power ?? 0)) };
  if (!THRUSTS.has(id)) return hit;
  let shaped = reach(hit, skillValues("ce_pin").reach ?? 0);
  if (hero.keen) shaped = reach(shaped, skillValues("ce_measure").reach ?? 0);
  if (id !== "risingThrust") return shaped;
  const feint = skillValues("ce_feint");
  const pin = skillValues("ce_pin");
  return { ...shaped, big: shaped.big || !!feint.guardBreak, around: !!feint.behind || !!pin.behind };
}
