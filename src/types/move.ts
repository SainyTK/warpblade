import type { SlashShape } from "./effect";
import type { Box } from "./world";

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
  /** knocks a foe off its feet for this long */
  stun?: number;
  /** staggers a minion for this long; COMBO.stagger when unset */
  stagger?: number;
  big?: boolean;
  /** also hits behind */
  around?: boolean;
  /** a foe driven into the stage edge bounces back off it into the air */
  wall?: boolean;
  /** always a critical hit, as a Keen blow is */
  crit?: boolean;
  /** a precise blow: `power` lands on the foe the move's payoff reaches, every other foe takes this */
  plain?: number;
  slash?: SlashShape;
  feel?: HitFeel;
}

/** Footwork for a finisher: from one time to another the move walks Kael forward at this speed. */
export interface Stride {
  from: number;
  to: number;
  speed: number;
}

/** one combo move of a hero, played by the shared combo engine (src/game/hero/combo.ts) */
export interface MoveDef {
  /** the hero's own name for the move: its key in the hero's `HeroModule.moves` */
  id: string;
  name: string;
  /** the action clip it plays: a key of the hero's `CharacterDef.clips.actions` */
  clip: string;
  hits: readonly MoveHit[];
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

/** What the hero is doing when J is pressed. Nothing about the foes around is in it: the string is the same wherever they stand. */
export interface Situation {
  ground: boolean;
  /** the move about to start is this hit of the combo, from 1 */
  next: number;
  limit: number;
  running: boolean;
  /** air attacks since leaving the ground, and how many Kael may make before he lands */
  airHits: number;
  airLimit: number;
  doubleJumped: boolean;
  whirled: boolean;
  /** the J press was Keen: the move it starts is a sure crit */
  keen: boolean;
  /** the hero's skills and their levels */
  skills: Readonly<Record<string, number>>;
}
