import type { Enemy } from "./enemy";

/** states only Wenna enters; her kit runs and poses them */
export type WennaState = "lamp" | "lampDrop" | "lightCast" | "kindleCast" | "beckonCast" | "spellCast" | "greatWick";

/** the blows of her lamp string, and Lamp Drop in the air */
export type LampBlow = "tap" | "swing" | "flare" | "drop";

/** the abilities on I, in the order O turns through them: her three from the start and her three spell skills */
export type WennaAbility = "light" | "kindle" | "beckon" | "w_lampVolley" | "w_waxPool" | "w_effigy";

/** why a Wick was lit or why it ended */
export type WickCause =
  | "light"
  | "warp"
  | "parry"
  | "wave"
  | "relight"
  | "twin"
  | "great"
  | "skill"
  | "life"
  | "hp"
  | "kindle"
  | "gone";

/**
 * One Wick: a wax figure with a violet flame for a head. It lives in the world list of every Wenna's Wicks
 * (`src/game/hero/wenna/wickWorld.ts`), so foes meet any Wenna's Wicks; `owner` is the room place of the Wenna who lit
 * it (0 in solo play).
 */
export interface Wick {
  id: number;
  owner: number;
  x: number;
  /** feet, on the floor or platform it stands on */
  y: number;
  vx: number;
  vy: number;
  /** on a floor or a platform, not hopping or dropping */
  ground: boolean;
  face: number;
  hp: number;
  max: number;
  /** seconds of life left, and the life it had when lit (it shrinks over the last seconds) */
  life: number;
  full: number;
  /** seconds since it was lit: it rises out of its pool over the first 0.35 s */
  t: number;
  /** seconds until its next bite */
  bite: number;
  /** seconds left of the lean and flame lunge of a bite, for its look */
  lunge: number;
  /** seconds left of the flame guttering sideways after a hurt */
  hurt: number;
  /** seconds before it can intercept another blow aimed at her */
  guard: number;
  /** seconds a foe has pressed against it since it last burned it, and seconds before a heavy foe can push it again */
  held: number;
  shoved: number;
  /** dropping through the platform it stood on */
  dropping: boolean;
  /** a leap under way to a spot (Beckon): seconds of flight left, and where it lands */
  leap: number;
  leapTo: { x: number; y: number } | null;
  /** seconds left in Beckon's ring round her, with its place in the ring */
  ring: number;
  slot: number;
  /** seconds left standing as a Great Wick (her Great Wick skill): drawn giant, its bites three times as hard */
  great: number;
  /** bites made, for every third bite of Bright Fangs */
  bites: number;
  /** a Wick lit past the cap (a twin, Great Wick's melt): it does not count toward the cap */
  extra: boolean;
  /** the game time its owner last tended it; a Wick nobody tends is let go (its owner fell or left the room) */
  tended: number;
  /** melting: seconds into the melt, -1 while it stands */
  melt: number;
  /** the foe it goes after, or null */
  target: Enemy | null;
}

/**
 * What Wenna's kit remembers between frames, one copy per player. The guest's HUD reads Wax, the Wick count and the
 * abilities; the Wick list itself lives in the world list, kept to the host.
 */
export interface WennaMemory {
  /** Wax, 0 to the most her skills allow */
  wax: number;
  /** seconds left of the WX bar's flash after a press it could not pay for */
  waxFlash: number;
  /** her Wicks standing now, for the HUD */
  wicks: number;
  /** the blow of the string under way, or the one the next J starts (index into the string) */
  blow: number;
  current: LampBlow;
  /** seconds left to carry the string on from a free state */
  link: number;
  queued: boolean;
  struck: boolean;
  /** Lamp Drops left in this airtime */
  drops: number;
  /** Wick Hops left in this airtime, and a hop was made this airtime (Lamp Drop after a hop) */
  hops: number;
  hopped: boolean;
  /** the Light cast under way lights at her feet */
  atFeet: boolean;
  /** where she stood as she threw the candle of the warp under way, where its Wick is left */
  warpFrom: { x: number; y: number } | null;
  /** seconds until each ability on I can be used again */
  kindleCd: number;
  beckonCd: number;
  volleyCd: number;
  poolCd: number;
  effigyCd: number;
  /** the ability the cast under way is using */
  casting: WennaAbility;
  /** the next Wick lit costs nothing (Chain Kindle) */
  freeWick: boolean;
  /** the special or ultimate under way: its level */
  ultLevel: number;
  /** foes her Wicks defeated this run, for Many Hands */
  wickKills: number;
  /** the wave whose start she has seen, for the free Wick at the start of each wave */
  waveSeen: number;
}

/** what the host alone keeps for Wenna: foes her kit holds on to, which never go to a guest */
export interface WennaHostMemory {
  /** the Quarries every Wick turns on, newest first, with seconds left on each */
  quarries: { foe: Enemy; left: number }[];
  /** the Wick the warp under way trades places with, when she threw at a Wick of hers */
  swapWick: Wick | null;
  /** places where her Wicks bite faster for a while (Wax Pool, Bonfire, the effigy) */
  zones: BiteZone[];
}

/** a drop of wax a fallen foe left for the Wenna whose blow or Wick felled it */
export interface Drip {
  owner: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  wax: number;
  /** seconds since it fell, and whether it flies to her now */
  t: number;
  flying: boolean;
}

/** a stretch of floor where her Wicks bite faster, for `left` more seconds */
export interface BiteZone {
  x: number;
  y: number;
  /** half its width */
  half: number;
  /** bites come this many times as fast */
  rate: number;
  left: number;
}

declare module "./skillBehavior" {
  /** Wenna's own skill events */
  interface SkillEvents {
    /** a Wick was lit, or ended, at a place */
    wick: { x: number; y: number; lit: boolean; cause: WickCause; wick: Wick };
    /** a warp left a Wick where she stood: a Wick she traded places with, or the thrown candle */
    swap: { from: { x: number; y: number }; to: { x: number; y: number }; wick: Wick };
    /** a foe became her Quarry */
    quarry: { foe: Enemy };
    /** a Wick burst under Kindle, with the foes it struck */
    kindle: { x: number; y: number; foes: readonly Enemy[] };
    /** a Wick bit a foe */
    bite: { foe: Enemy; wick: Wick; damage: number };
  }
}
