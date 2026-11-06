/** states only Sable enters; her kit runs and poses them */
export type SableState = "shoot" | "kick" | "hop" | "slide" | "snare";

/** the passives and abilities of Sable's skill tree */
export type SablePerk =
  | "piercing"
  | "ricochet"
  | "heartseeker"
  | "scattershot"
  | "fleetFoot"
  | "hopVolley"
  | "heavyBoot"
  | "slideKick"
  | "barbedSnare"
  | "twinSnare"
  | "perfectRhythm"
  | "huntersFocus"
  | "kickReload"
  | "snareVolley";

/** where Sable aims: level, up, or low (kneeling on the floor, slanted down in the air) */
export type SableAim = "level" | "up" | "low";

/** the reload under way, if any */
export interface SableReload {
  /** seconds into the reload */
  t: number;
  /** seconds the reload takes, a jam adds to it */
  dur: number;
  /** the timing press was already used, well or badly */
  tried: boolean;
  jammed: boolean;
}

/** what Sable's kit remembers between frames, one copy per player */
export interface SableMemory {
  /** bolts in the quiver */
  ammo: number;
  reload: SableReload | null;
  /** bolts left that carry a perfect reload's bonus */
  primed: number;
  aim: SableAim;
  /** the shot of the current shoot state left the crossbow */
  fired: boolean;
  /** seconds until the snare can be set again */
  snareCd: number;
  /** snares on the floor */
  snares: number;
  /** the hop back already loosed its bolt */
  hopShot: boolean;
  /** the hop or slide landed and is in its recovery */
  landed: boolean;
  /** one hop back in each airtime */
  airHopped: boolean;
  /** the kick already landed on someone */
  kicked: boolean;
  /** seconds of the HUD flash after a perfect reload, a jam or an empty quiver */
  flash: number;
  flashKind: "perfect" | "jam" | "empty";
}
