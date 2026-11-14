import type { Enemy } from "../../../types/enemy";

/** what fired a round: a Trigger, the warp's arrival, the parry, a shot on I or the ultimate */
export type CalderRound = "trigger" | "warp" | "parry" | "shot" | "ultimate";

/** Calder's own skill events, named for him since every hero's events share one table */
declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    /** a Trigger fired a round into the foe its blow struck (null when the blow's foe fell first) */
    calderTrigger: { foe: Enemy | null; x: number; y: number };
    /** a round of Calder's went off at (x, y) and struck these foes: what fired it is `kind` */
    calderBlast: { x: number; y: number; foes: readonly Enemy[]; kind: CalderRound };
    /** the chamber was reloaded, quickly or not; `ultimate` when Cylinder Break filled it */
    calderReload: { quick: boolean; ultimate: boolean };
  }
}

export {};
