import { CLEAVE_REACH } from "../../../constants/brannoc/axe";
import type { AxeBlow } from "../../../types/brannoc";
import type { SlashShape } from "../../../types/effect";
import { createSlash } from "../../effects/slash";
import { game, hero } from "../../state";
import { skin } from "../skin";

/** each blow's smear on its hit frame, facing right, from his feet: the axe head's path */
const SMEARS: Readonly<Record<AxeBlow, Omit<SlashShape, "ramp">>> = {
  /** a diagonal chop from high behind to low in front */
  hew: { cx: 3, cy: -18, R: 19, sy: 0.9, rot: 0.15, a0: -2.4, a1: 0.85, W: 6, sweep: 0.05, trail: 0.14 },
  /** a wide, flat half ring at the waist from behind him round to the front */
  reave: { cx: 2, cy: -16, R: 26, sy: 0.42, rot: 0, a0: 3.05, a1: 0.05, W: 6, sweep: 0.05, trail: 0.12 },
  /** a full ring round him, flat along the floor's plane */
  cleave: { cx: 0, cy: -16, R: CLEAVE_REACH, sy: 0.45, rot: 0, a0: 0, a1: 6.2, W: 6, sweep: 0.06, trail: 0.16 },
  /** a straight chop down in front of him */
  hatchet: { cx: 2, cy: -14, R: 15, sy: 0.95, rot: 0, a0: -1.6, a1: 1.3, W: 5, sweep: 0.05, trail: 0.12 },
  /** a short overhead chop */
  huntChop: { cx: 3, cy: -16, R: 15, sy: 0.9, rot: 0.1, a0: -2, a1: 0.8, W: 4, sweep: 0.04, trail: 0.1 },
};

/**
 * The blow's smear in his crimson, as wide as the heaviest smears in the roster; a Bloodied blow is a pixel wider, so
 * the Bloodied string reads hotter
 */
export function smear(blow: AxeBlow, bloodied: boolean): void {
  const ramp = skin.ramp;
  const shape = SMEARS[blow];
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...shape, W: shape.W + (bloodied ? 1 : 0), ramp }));
}
