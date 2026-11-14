import type { CeriseAbility } from "./ability";

/** what Cerise's kit remembers between presses; each co-op seat keeps its own, and a guest's HUD reads it */
export interface CeriseState {
  /** Points held, and seconds left of the bar's flash after a Point is gained or spent */
  points: number;
  pointFlash: number;
  /** seconds before each ability can be cast again, and the full length of each one's current wait */
  abilityCd: Record<CeriseAbility, number>;
  abilityFull: Record<CeriseAbility, number>;
  /** the ability under way, whether it is the wide form, its power and the Points it spent */
  castAbility: CeriseAbility;
  castWide: boolean;
  castPower: number;
  castSpent: number;
  /** thrusts of the Flurry dealt so far, and how many it has */
  flurryDone: number;
  flurryCount: number;
  /** the riposte chain: links so far, seconds left of the beat after the last one landed, a link pressed on the beat,
   *  a J pressed before the link landed (the chain ends after it) */
  links: number;
  ripBeat: number;
  ripNext: boolean;
  ripSpoiled: boolean;
  /** Rose Tempest: its charge level, thrusts of the storm dealt, and whether the lunge has gone */
  tempestLevel: number;
  tempestThrusts: number;
  tempestLunged: boolean;
  /** Points the lunge under way spent */
  lungePoints: number;
  /** Keen blows landed in a row */
  keenStreak: number;
  keenCount: number;
  /** seconds left of Mirror Guard's stance */
  stance: number;
}
