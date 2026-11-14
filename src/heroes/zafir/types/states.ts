import type { ZafirAbility } from "./abilities";

/** Zafir's own states: an ability leaving his hands (`sandcast`) */
declare module "../../../types/hero" {
  interface KitStates {
    zafir: "sandcast";
  }
}

/** what Zafir's kit remembers between presses; each co-op seat keeps its own */
export interface ZafirState {
  /** the Whirl meter, 0 to `WHIRL.most`, and seconds since one of his own hits last landed */
  whirl: number;
  whirlIdle: number;
  /** seconds before the sand ring cuts again */
  ringClock: number;
  /** the sand ring is cutting right now, so its hits neither feed the Whirl nor open the cut's own wound */
  ringCutting: boolean;
  /** where the walk stride under a moving string has got to, 0 to 1 */
  stride: number;
  /** seconds before each ability can be cast again, and the full length of each one's current wait */
  abilityCd: Record<ZafirAbility, number>;
  abilityFull: Record<ZafirAbility, number>;
  /** the ability of the cast under way, its wide form, and whether it cut into the string, which carries on after it */
  casting: ZafirAbility;
  castWide: boolean;
  castInString: boolean;
  /** the scimitar is out on a crescent throw */
  bladeOut: boolean;
  /** seconds left of the sandstorm that follows him, and its charge level */
  storm: number;
  stormLevel: number;
  /** Keen spins landed in a row, for Sirocco Timing's streak */
  keenStreak: number;
  /** foes cut by the ring and the storm this run, for his achievement */
  runRingCuts: number;
}
