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
  | "taunt"
  | "chain"
  | "stomp"
  | "brace"
  | "ride";

/** the blows of her fist string, in order */
export type FistBlow = "jab" | "hook" | "haymaker";

/** how a held foe leaves her hands: ahead, over her head into the floor behind, or swung round her */
export type ThrowKind = "forward" | "suplex" | "swing";

/** the abilities on I, in the order O turns through them: her two from the start and her three spell skills */
export type HuldaAbility = "bellow" | "taunt" | "h_ironChain" | "h_tremorStomp" | "h_ironWall";

/** how her armour took a blow: a plate broke, or the rush, the haymaker's wind-up or Iron Wall's brace took it */
export type ArmourKind = "plate" | "rush" | "windup" | "brace";

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
  /** the current action already struck, caught or set off its moment */
  struck: boolean;
  throwKind: ThrowKind;
  /** seconds until each ability on I can be used again */
  bellowCd: number;
  tauntCd: number;
  chainCd: number;
  stompCd: number;
  wallCd: number;
  /** one hammer fist and one Skyfall Grab in each airtime */
  airFisted: boolean;
  airGrabbed: boolean;
  /** the rush or a Skyfall has landed and is in its recovery */
  landed: boolean;
  /** seconds until the next Bull Rush */
  rushCd: number;
  /** the foes Bull Horns carries on her shoulder; replaced whole, never pushed to, so co-op seats keep their own */
  carried: readonly Enemy[];
  /** foes the rush under way has struck, for the dash event; replaced whole */
  passed: readonly Enemy[];
  /**
   * Seconds into the rush its charge ends when it stops early past a lone foe, and the clip time from which the clip's
   * own last stride carries on into the skid; 0 while the charge runs its full length
   */
  rushStop: number;
  rushJoin: number;
  /** Stampede: L in the skid may start one free rush */
  rushAgain: boolean;
  /** Iron Counter: the next throw's damage multiple, whether the held big foe is the evolved grip's, and seconds left
   *  in which no plate breaks */
  counterThrow: number;
  execute: boolean;
  unbreakT: number;
  /** Fury: her damage is up by this share while `furyT` runs */
  fury: number;
  furyT: number;
  /** where the last blow on her came from, for the armour's answer */
  hitFrom: number;
  /** seconds since a plate last healed her (Iron Hide) */
  healWait: number;
  /** Iron Chain: a chain cast is still out or dragging foes home, so she stays in the haul */
  chainBusy: boolean;
  /** Iron Wall: blows taken in the brace under way */
  braced: number;
  /** Skyfall Breaker: the big foe she rides and the pounds left, the foes her dive drags down, the bounce after a catch
   *  already spent this airtime, and a Comet Grab leap under way */
  ridden: Enemy | null;
  pounds: number;
  dove: readonly Enemy[];
  bounced: boolean;
  comet: boolean;
  /** Unbroken: seconds of iron left and its damage share */
  ironT: number;
  iron: number;
  /** seconds she has been pushed along the floor from a stand; her walk loads before it gets going */
  push: number;
}

/** a recovery her pose layer plays over a free state: a walk coming to a stop, or a turn on the floor */
export type HuldaSettle = "stop" | "turn";

/** what Hulda's pose layer remembers about the recovery under way, one copy per player */
export interface HuldaSettleMemory {
  kind: HuldaSettle | null;
  /** the game time it started */
  at: number;
}

declare module "./skillBehavior" {
  /** Hulda's own skill events */
  interface SkillEvents {
    /** a foe caught in her hands, or crushed when too big to hold */
    grab: { foe: Enemy };
    /** a foe she threw or slammed landed; `slam` for a Skyfall or a Bull Horns slam (a suplex is a throw) */
    throw: { foe: Enemy; x: number; y: number; slam: boolean };
    /** her armour took a blow; `counter` when she took it on purpose (rush, wind-up, brace), her parry */
    armour: { kind: ArmourKind; fromX: number; counter: boolean };
    /** an Iron Counter grab or a loaded Iron Wall release */
    counter: { foe: Enemy | null };
  }
}
