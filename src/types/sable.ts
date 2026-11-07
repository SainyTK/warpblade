import type { Enemy } from "./enemy";

/** states only Sable enters; her kit runs and poses them */
export type SableState = "shoot" | "kick" | "hop" | "slide" | "snare";

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
  /** bolts left primed by a kick, a slide or a hop: the base primed bonus only */
  charged: number;
  /** bolts of the ground string loosed so far, 0 to the string's length */
  string: number;
  /** seconds the crossbow still cocks after a closing bolt */
  cock: number;
  /** bolts loosed in this airtime */
  airShots: number;
  /** jumps made in this airtime */
  airJumps: number;
  /** hops made in this airtime */
  airHops: number;
  /** seconds of Skyhunter's hover left in this airtime */
  hover: number;
  /** seconds a perfect reload's quickened shots still last */
  haste: number;
  /** seconds since the last perfect reload, for Deadeye */
  sincePerfect: number;
  /** seconds a Shade Archer still stands, so her own bolts are primed */
  shade: number;
  /** a blow already met this hop or slide at the right moment */
  perfectUsed: boolean;
  /** seconds each spell of the I rotation still recharges */
  snareCd: number;
  netCd: number;
  decoyCd: number;
  kegCd: number;
  /** snares on the floor now */
  snares: number;
  /** the spell the casting clip is setting */
  casting: SableSpellId;
  aim: SableAim;
  /** the shot of the current shoot state left the crossbow */
  fired: boolean;
  /** the hop back already loosed its bolt */
  hopShot: boolean;
  /** the hop or slide landed and is in its recovery */
  landed: boolean;
  /** foes the slide passed under this time */
  slid: number;
  /** the kick already landed on someone */
  kicked: boolean;
  /** seconds of the HUD flash after a perfect reload, a jam or an empty quiver */
  flash: number;
  flashKind: "perfect" | "jam" | "empty";
}

/** a spell on Sable's I rotation: the snare from the start, and her spell skills */
export type SableSpellId = "snare" | "s_net" | "s_decoy" | "s_keg";

declare module "./skillBehavior" {
  /** Sable's own skill events */
  interface SkillEvents {
    /** her kick landed on these foes */
    kick: { foes: readonly Enemy[] };
    /** one of her snares bit a foe */
    snareBite: { foe: Enemy };
    /** her hop back looses its bolts, from this place */
    hop: { x: number; y: number; face: number };
    /** an air string ran to its limit */
    airString: { x: number; y: number };
  }
}
