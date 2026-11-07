import type { Enemy } from "./enemy";

/** states only Hulda enters; her kit runs and poses them */
export type HuldaState =
  | "fist"
  | "airFist"
  | "grab"
  | "crush"
  | "hold"
  | "knee"
  | "toss"
  | "skyfall"
  | "rush"
  | "bellow"
  | "taunt";

/** the passives and abilities of Hulda's skill tree */
export type HuldaPerk =
  | "uppercut"
  | "knuckleRush"
  | "bullHorns"
  | "ironPlates"
  | "secondWind"
  | "ironGrip"
  | "giantSwing"
  | "wreckingThrow"
  | "rushGrab"
  | "aftershockSuplex";

/** the blows of her fist string, in order; the uppercut and the knuckle rush come after the haymaker once learned */
export type FistBlow = "jab" | "cross" | "hook" | "haymaker" | "uppercut" | "knuckles";

/** how a held foe leaves her hands: ahead, over her head into the floor behind, straight up, or swung round her */
export type ThrowKind = "forward" | "suplex" | "up" | "swing";

/** what Hulda's kit remembers between frames, one copy per player */
export interface HuldaMemory {
  /** Grit, 0 to 100: four armour plates of 25 */
  grit: number;
  /** seconds since a blow landed on a foe or on her; Grit drains once this runs long */
  quiet: number;
  /** seconds left of the short safe time after a plate breaks */
  safe: number;
  /** seconds left of the plate-break flinch drawn over whatever she is doing */
  flinch: number;
  /** the foe in her hands, during a hold, a throw or a Skyfall ride */
  held: Enemy | null;
  /** the big foe in a crush */
  crushed: Enemy | null;
  /** seconds she has held it */
  holdT: number;
  /** knees landed in this hold */
  knees: number;
  /** the blow of the string under way, or the one the next J starts */
  blow: number;
  /** seconds left to carry the string on from a free state */
  link: number;
  /** J was pressed during a blow: the next one follows when it ends */
  queued: boolean;
  /** the current blow's punches left, for the knuckle rush */
  punches: number;
  /** the current action already struck, caught or set off its moment */
  struck: boolean;
  throwKind: ThrowKind;
  /** seconds until Bellow and the taunt can be used again */
  bellowCd: number;
  tauntCd: number;
  /** one hammer fist and one Skyfall Grab in each airtime */
  airFisted: boolean;
  airGrabbed: boolean;
  /** the rush or a Skyfall has landed and is in its recovery */
  landed: boolean;
  /** seconds until the next Bull Rush */
  rushCd: number;
  /** the foe Bull Horns carries on her shoulder */
  carried: Enemy | null;
}

declare module "./skillBehavior" {
  /** Hulda's own skill events */
  interface SkillEvents {
    /** a foe caught in her hands, or crushed when too big to hold */
    grab: { foe: Enemy };
  }
}
