import type { CalderAbility } from "./ability";

/** what Calder's kit remembers between presses; each co-op seat keeps its own */
export interface CalderState {
  /** rounds in the chamber, and how many it holds */
  rounds: number;
  /** the rounds in the chamber are hot: their blasts hit harder */
  hot: boolean;
  /** seconds the meter flashes after a Trigger clicked on an empty chamber */
  click: number;
  /** the reload under way: J was pressed during it (only the first press counts), and it was quick */
  reloadPressed: boolean;
  reloadQuick: boolean;
  /** seconds before each ability can be cast again, and the full length of each one's current wait */
  shotCd: Record<CalderAbility, number>;
  shotCdFull: Record<CalderAbility, number>;
  /** the ability of the shot under way and whether it is its wide form */
  shotAbility: CalderAbility;
  shotWide: boolean;
  /** Twin Scatter has fired its second blast, behind */
  backFired: boolean;
  /** Scatter Blast's recoil hop is in the air */
  hopping: boolean;
  /** seconds of recoil kick still in the arms after a round goes off */
  recoil: number;
  /** Triggers landed in a row */
  triggerStreak: number;
  /** the ultimate under way: cuts in it and cuts dealt so far, and each cut's damage */
  breakCuts: number;
  breakDone: number;
  breakBlow: number;
  breakReach: number;
}
