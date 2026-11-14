import type { BrynnAbility } from "./ability";

declare module "../../../types/hero" {
  interface KitStates {
    /** Brynn's abilities: a cut up out of the floor, and the blade driven down into it */
    brynn: "rend" | "quake";
  }
}

/** what Brynn's kit remembers between presses; each co-op seat keeps its own */
export interface BrynnState {
  /** Heft, 0 to full */
  heft: number;
  /** seconds since a blow last landed, for the drain */
  sinceHit: number;
  /** seconds before each ability can be cast again, and the full length of its current wait */
  cd: Record<BrynnAbility, number>;
  cdFull: Record<BrynnAbility, number>;
  /** the ability under way, whether it is the wide form, and its power (more when carried out of the string) */
  casting: BrynnAbility;
  wide: boolean;
  power: number;
  /** the string's place to come back to after a carried ability, 0 when none */
  carry: number;
  /** the next slam is a fissure (Heft was full when the slam started) */
  fissure: boolean;
  /** heavy swings landed in a row, for Heavy Hands' streak */
  heavyStreak: number;
  /** swings left that hit harder after a parry (Counter Cleave) */
  afterParry: number;
  /** seconds left of War Cry's buff */
  cry: number;
}
