import type { Enemy } from "./enemy";
import type { Point } from "./world";

/** states only Orrin enters; his kit runs and poses them */
export type OrrinState =
  | "lash"
  | "hookThrow"
  | "swing"
  | "zip"
  | "fly"
  | "backline"
  | "whirl"
  | "pin"
  | "pendulum"
  | "maelstrom";

/** the blows of his chain string; the knee replaces the lash when a foe stands right against him */
export type ChainBlow = "lash" | "knee" | "rising" | "circle";

/** what the hook bit: a foe to zip to, a crystal or a platform to swing from, or the air itself */
export type LatchKind = "foe" | "anchor" | "platform" | "air";

/** the abilities on I, in the order O turns through them: his two from the start and his three spell skills */
export type OrrinAbility = "whirlwall" | "anchorPin" | "o_chainfence" | "o_tether" | "o_anchorfall";

/** the hook in flight, from the hand along its aim */
export interface HookFlight {
  /** where it left the hand and where it flies toward, world pixels */
  from: Point;
  dx: number;
  dy: number;
  /** pixels flown so far, and the most it may fly */
  flown: number;
  range: number;
}

/**
 * What Orrin's kit remembers between frames, one copy per player. The guest's HUD reads Momentum and the abilities; the
 * host draws the chain from the latch, the length and the hook. Points are replaced whole, never changed in place, so
 * co-op seats keep their own.
 */
export interface OrrinMemory {
  /** Momentum, 0 to 100 */
  momentum: number;
  /** seconds on the floor since the last tip hit; Momentum drains once this runs past its grace */
  grounded: number;
  /** the blow of the string under way, or the one the next J starts (index into the string) */
  blow: number;
  /** the string blow being played, the knee included */
  current: ChainBlow;
  /** seconds left to carry the string on from a free state */
  link: number;
  /** J pressed during a blow: the next one follows when it ends */
  queued: boolean;
  /** the current blow already struck */
  struck: boolean;
  /** Full Circle hits land over a span of frames: the share of the turn already swept */
  swept: number;
  /** Hanging Arcs left in this airtime */
  airArcs: number;
  /** seconds into the Hanging Arc under way, drawn over whatever he is doing in the air; -1 when none */
  arc: number;
  /** the side the Hanging Arc sweeps toward */
  arcSide: number;
  /** air hooks left in this airtime */
  hooks: number;
  /** the hook in flight, or null */
  flight: HookFlight | null;
  /** what the hook holds now, and where */
  latch: LatchKind | null;
  latchAt: Point | null;
  /** the chain's length from the latch to his hand while swinging */
  length: number;
  /** seconds since the latch; the floor yank runs in the first part of it */
  latchT: number;
  /** where the yank lifts him to, and how fast it goes */
  yankTo: Point | null;
  /** a ledge pull: a platform too low to swing under hauls him up to stand here on it */
  climbTo: Point | null;
  /** an air bite's tear closes when this runs out */
  biteLeft: number;
  /** the speed when the reel started, which caps how fast reeling can make him */
  reelBase: number;
  /** the reel is pulling now, and it already snapped (Reel Snap) */
  reeling: boolean;
  snapped: boolean;
  /** seconds since he let go, and the speed he let go at, for the Slip */
  sinceRelease: number;
  releaseSpeed: number;
  /** the flight out of a release is a fling (it calls travelEnded on landing) */
  flung: boolean;
  /** swing kicks landed in the swing under way, and the most in one swing this run */
  kicks: number;
  bestKicks: number;
  /** Undertow: a hook just after a Backline flings harder by this share, for `boostLeft` seconds */
  flingBoost: number;
  boostLeft: number;
  /** Plumb Drop: he let go downward and drops onto the floor */
  plumb: boolean;
  /** seconds left before the next Backline */
  backlineCd: number;
  /** Backline's floor point and the step's start */
  backFrom: number;
  /** seconds until each ability on I can be used again */
  whirlCd: number;
  pinCd: number;
  fenceCd: number;
  tetherCd: number;
  anchorCd: number;
  /** the ability the cast under way is using */
  casting: OrrinAbility;
  /** Whirlwall's damage ticks dealt so far */
  whirlTicks: number;
  /** Anchor Pin's floor spike and the foe it holds, for the chain drawn between them */
  pinAt: Point | null;
  pinLeft: number;
  /** the side a Grand Pendulum or Maelstrom swings round, and its centre */
  ultAt: Point | null;
  ultLevel: number;
  /** Brass Kites out now, set by the kite skill, for Endless Motion */
  kites: number;
}

/** what the host alone keeps for Orrin: foes, which never go to a guest */
export interface OrrinHostMemory {
  /** the foe a zip pulls him to */
  zipFoe: Enemy | null;
  /** the foe Anchor Pin holds */
  pinned: Enemy | null;
  /** foes the swing under way has kicked */
  kicked: readonly Enemy[];
  /** foes the ultimate's pass under way has struck */
  passed: readonly Enemy[];
}

declare module "./skillBehavior" {
  /** Orrin's own skill events */
  interface SkillEvents {
    /** the hook bit something: a foe to zip to, a crystal, a platform or the air */
    latch: { kind: LatchKind; foe: Enemy | null };
    /** he let go of a swing, at this speed */
    release: { speed: number; fling: boolean };
    /** a blow landed in the last part of the chain's reach */
    tip: { foe: Enemy; blow: ChainBlow | "hanging" };
    /** a swing kick landed on a foe */
    swingKick: { foe: Enemy; speed: number };
  }
}
