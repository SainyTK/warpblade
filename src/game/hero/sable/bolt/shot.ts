import type { SourceId } from "../../../../types/build";
import type { Enemy } from "../../../../types/enemy";
import type { Payoff } from "../../../skills/payoff";
import type { Prime } from "../quiver";

/** what kind of bolt is flying, so the skills know which of their bonuses it carries */
export interface Shot {
  x: number;
  y: number;
  angle: number;
  /** share of a normal bolt's damage */
  share: number;
  prime: Prime;
  /** the last bolt of a string */
  closing?: boolean;
  /** loosed in the air */
  air?: boolean;
  /** a fan's side bolt */
  side?: boolean;
  /** loosed by the hop */
  hop?: boolean;
  /** bounces from foe to foe so far */
  depth?: number;
  /** a split or bounced bolt: it does not split again */
  offshoot?: boolean;
  /** foes the whole family of bolts has struck, so a bounce never goes back */
  struck?: Set<Enemy>;
  /** splits left for the whole family of bolts (Splinter Storm) */
  family?: { splits: number };
  /** a copy or a skill's own bolt: base damage and rules only, no skill bonuses (shades, decoys, snares) */
  plain?: boolean;
  /** damage as a multiple of attack damage, in place of a bolt's */
  power?: number;
  /** foes it passes through, for a plain bolt */
  pierce?: number;
  /** what loosed it, for the end of run screen; her own shots when not given */
  source?: SourceId;
  /** the foes a perfect reload's prime has paid off on, shared by the whole family of bolts: Perfect Rhythm is a
   *  precise skill, so its prime lands on the first foe struck and the rest take the plain prime */
  payoff?: Payoff;
}
