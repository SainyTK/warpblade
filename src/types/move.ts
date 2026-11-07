import type { SlashShape } from "./effect";
import type { ClipName } from "./hero";
import type { Perk } from "./skill";
import type { Box } from "./world";
import type { YsraMoveId } from "./ysra";

/** Kael's combo moves */
export type KaelMoveId =
  | "stepCut"
  | "risingBackhand"
  | "twinFang"
  | "hopCleave"
  | "crescentTurn"
  | "smash"
  | "turnCut"
  | "ringCut"
  | "downStab"
  | "chaseCut"
  | "sweep"
  | "launcher"
  | "thrust"
  | "dashStrike"
  | "airWheel"
  | "airScissor"
  | "airStomp"
  | "whirl"
  | "meteor"
  | "phaseCut"
  | "backflip"
  | "skybreaker";
export type MoveId = KaelMoveId | YsraMoveId;

/** How a blow feels: hitstop and shake on contact, and the pitch of its hit sound. */
export interface HitFeel {
  /** seconds the game freezes on contact */
  stop: number;
  /** seconds and pixels of screen shake */
  shake: readonly [number, number];
  /** hit sound pitch, 1 is normal */
  pitch: number;
}

/** One blow of a move. Boxes and knockback are in pixels from the feet as if facing right. */
export interface MoveHit {
  at: number;
  box: Box;
  /** damage as a multiple of attack damage */
  power: number;
  kx: number;
  ky: number;
  /** throws the foe up at this speed */
  launch?: number;
  /** drives an airborne foe into the floor */
  spike?: boolean;
  /** trips or staggers a foe for this long */
  stun?: number;
  big?: boolean;
  /** also hits behind */
  around?: boolean;
  /** a foe driven into the stage edge bounces back off it into the air */
  wall?: boolean;
  /** always a critical hit, as a Keen blow is */
  crit?: boolean;
  slash?: SlashShape;
  feel?: HitFeel;
}

/** Footwork for a finisher: from one time to another the move walks Kael forward at this speed. */
export interface Stride {
  from: number;
  to: number;
  speed: number;
}

export interface MoveDef {
  id: MoveId;
  name: string;
  clip: ClipName;
  hits: readonly MoveHit[];
  /** turns to a foe that is only behind before it starts */
  turns?: boolean;
  /** ends the combo whatever its length */
  finisher?: boolean;
  /** invulnerable for this long from the start */
  guard?: number;
  /** the move lasts until Kael lands, not until its clip ends */
  untilLanding?: boolean;
  /** a hop inside the ground string: the next move is picked as if Kael stood on the floor */
  hop?: boolean;
  /** keeps full gravity in the air; other aerial moves hang */
  falls?: boolean;
  /** seconds after the last blow before a queued move may cut in; COMBO.cancel when unset */
  cancel?: number;
  /** swing sound pitch, 1 is normal */
  pitch?: number;
  /** fading copies of Kael trail behind him until this time into the move */
  ghosts?: number;
  /** only finishers and dash or running attacks travel; every other move keeps Kael on the spot */
  strides?: readonly Stride[];
  /** lifts Kael this many pixels as it starts, never on top of a rise he already has */
  lift?: number;
  enter?: () => void;
  /** drives Kael's motion itself for the whole move */
  step?: (time: number) => void;
  /** after each blow, with how many foes it hit */
  afterHit?: (hits: number) => void;
  land?: () => void;
}

/** What is around Kael when J is pressed, read from the world for the combo to branch on. */
export interface Situation {
  ground: boolean;
  /** the move about to start is this hit of the combo, from 1 */
  next: number;
  limit: number;
  up: boolean;
  down: boolean;
  running: boolean;
  /** dashing, or just finished a dash */
  dashing: boolean;
  /** a hang on a crystal */
  hanging: boolean;
  /** air attacks since leaving the ground, and how many Kael may make before he lands */
  airHits: number;
  airLimit: number;
  doubleJumped: boolean;
  whirled: boolean;
  /** a foe within reach behind, and none in front */
  foeBehindOnly: boolean;
  /** foes within reach on both sides */
  surrounded: boolean;
  /** the nearest foe in front is lying down, or is in the air above the blade */
  foeDown: boolean;
  foeAirborne: boolean;
  /** the move before this one in the combo */
  previous: MoveId | null;
  /** a downward stab was already used in this combo */
  stabbed: boolean;
  perks: ReadonlySet<Perk>;
}
