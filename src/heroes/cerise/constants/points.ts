/** Points: rose pips on the PT bar, earned by timing and spent by the lunge and the abilities */
export const POINTS = {
  /** the most she holds, before Poise */
  most: 5,
  /** a Keen blow that lands */
  keen: 1,
  /** a parry, and each riposte that lands */
  parry: 1,
  riposte: 1,
  /** seconds the bar flashes when a Point comes or goes */
  flash: 0.25,
} as const;

/** the lunge: each Point it spends adds this much power (AD) and reach (px); at `heavy` Points it breaks guards and at
 *  `sure` it is a sure crit */
export const LUNGE_POINTS = { power: 0.45, reach: 10, heavy: 3, sure: 5 } as const;
/** an ability spends up to this many Points, each making it this much stronger */
export const ABILITY_POINTS = { most: 2, power: 0.4 } as const;
