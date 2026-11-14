import type { Enemy } from "../../../types/enemy";

/** Calder's own skill events, named for him since every hero's events share one table */
declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    /** a Trigger fired a round into the foe its blow struck (null when the blow's foe fell first) */
    calderTrigger: { foe: Enemy | null; x: number; y: number };
    /** any round of Calder's went off at (x, y): a Trigger, a shot, the warp's, the parry's or the ultimate's */
    calderBlast: { x: number; y: number; foes: readonly Enemy[] };
    /** the chamber was reloaded, quickly or not */
    calderReload: { quick: boolean };
  }
}

export {};
