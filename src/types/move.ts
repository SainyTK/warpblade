import type { SlashShape } from "./effect";
import type { ClipName } from "./hero";
import type { Box } from "./world";

export type MoveId =
  | "cut1"
  | "cut2"
  | "cut3"
  | "cut4"
  | "cut5"
  | "smash"
  | "sweep"
  | "launcher"
  | "thrust"
  | "dashStrike"
  | "airCut1"
  | "airCut2"
  | "airSpike"
  | "whirl"
  | "meteor"
  | "phaseCut"
  | "backflip"
  | "skybreaker";

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
  /** trips a foe for this long */
  stun?: number;
  big?: boolean;
  /** also hits behind */
  around?: boolean;
  slash?: SlashShape;
}

export interface MoveDef {
  id: MoveId;
  name: string;
  clip: ClipName;
  hits: readonly MoveHit[];
  /** ends the combo whatever its length */
  finisher?: boolean;
  /** invulnerable for this long from the start */
  guard?: number;
  /** the move lasts until Kael lands, not until its clip ends */
  untilLanding?: boolean;
  /** keeps full gravity in the air; other aerial moves hang */
  falls?: boolean;
  enter?: () => void;
  step?: (time: number) => void;
  /** after each blow, with how many foes it hit */
  afterHit?: (hits: number) => void;
  land?: () => void;
}
