import { HERO_MOVE } from "../combat";
import { frame } from "../hero";

/** Ysra's one jump: pixels it rises (Kael 62) */
export const YSRA_JUMP_RISE = 46;

/** her guard on K: a firm block that costs little and lets little through, and a parry that opens the counter */
export const GUARD = {
  /** share of a blocked blow she still takes, and stamina per block */
  chip: 0.1,
  blockCost: 9,
  /** J is the counter thrust for this long after a parry */
  counterTime: 0.8,
  /** Heat a parry gives */
  parryHeat: 12,
} as const;

/** a side held away while she guards: a low hop back that nothing touches at first */
export const BACKSTEP = {
  distance: 36,
  /** pixels of the hop */
  hop: 5,
  cost: 20,
  guard: 0.15,
  /** a side held away that turned her this recently still counts as away */
  turnGrace: 0.15,
  /** the skid after the hop lands */
  skid: frame(4),
} as const;

/** Warpath: the charge shoulders foes it runs into */
export const WARPATH = {
  kx: 220,
  /** small foes are bumped up off their feet as well as aside, once Warpath throws them */
  launch: -150,
  stagger: 0.5,
  /** the same foe is not shouldered again for this long */
  again: 0.6,
  /** ahead of her feet, the box the shoulder hits */
  box: [0, -26, 12, 0] as const,
  /** Juggernaut: carried foes ride this far ahead of her feet, this far apart */
  carry: 26,
  stack: 7,
} as const;

/** the backstep's clip: the hop, from leaving the floor to coming back to it under full gravity, then the skid */
export const BACKSTEP_TIMES = (() => {
  const land = 2 * Math.sqrt((2 * BACKSTEP.hop) / HERO_MOVE.gravity);
  return { land, end: land + BACKSTEP.skid };
})();
/** her speed back along the floor in the hop, so the hop covers BACKSTEP.distance */
export const BACKSTEP_SPEED = BACKSTEP.distance / BACKSTEP_TIMES.land;

/** Haft Ward: a held guard burns foes pressed against it every `every` seconds, this far ahead of her feet; Temple Gate's
 *  ring bursts at most once every `ringEvery` seconds */
export const WARD = { every: 0.4, reach: 18, height: 34, ringEvery: 0.5 } as const;
