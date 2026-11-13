import { DAMAGE } from "../combat";
import { BACK_BONUS } from "./knives";

/**
 * J held: his warp. The knife sinks into the foe and he steps out of its shadow at its back, so the arrival blow lands
 * from behind, where his blows deal the shared back bonus and his kit's on top.
 */
export const TALLIS_WARP = {
  /** the arrival blow from behind is scaled by this, so with both back bonuses it deals what every hero's warp deals */
  backShare: 1 / (DAMAGE.back * (1 + BACK_BONUS)),
  /** how far behind the foe's middle he steps out */
  behind: 13,
  /** the arrival's shove: small, so the foe stays in knife reach for the string */
  kx: 60,
  ky: -40,
  /** seconds he stays veiled after he arrives, a breath of shadow that drains no Gloam */
  breath: 0.5,
} as const;

/** K: crossed knives. A thin block that lets much through but costs little; the parry is the prize */
export const TALLIS_GUARD = {
  chip: 0.45,
  blockCost: 9,
} as const;

/** his parry, Fade: he vanishes into the Veil for free, and his first blow out of it is an Ambush */
export const FADE = {
  /** seconds the free Veil lasts */
  time: 2,
} as const;
