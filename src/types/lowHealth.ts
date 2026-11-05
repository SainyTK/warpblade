import type { HeroState } from "./hero";
import type { Pose } from "./pose";

/** how strong the red glow around the screen is at one tier of the warning */
export interface DangerTier {
  /** opacity of the glow at the very edge, at the top of its pulse */
  strength: number;
  /** how far in from the edge the glow reaches, in art pixels */
  band: number;
  /** seconds for one pulse */
  period: number;
  /** how much of the strength the pulse takes away at its low point, 0 to 1 */
  pulse: number;
}

/** what the screen warning remembers between steps */
export interface DangerState {
  /** how far the warning has faded in: 0 off, 1 the low tier, 2 the critical tier, eased between */
  level: number;
  /** where the pulse is, 0 to 1 */
  phase: number;
}

/** what the wounded stance remembers between frames */
export interface WoundState {
  /** how far the idle has sunk into the wounded stance, 0 to 1, stepped once per animation frame */
  weight: number;
  /** the animation frame the weight was last stepped on */
  frame: number;
}

/** a cross from the last pose shown into or out of a wounded idle, for a hero whose clips are authored to meet on her stand */
export interface WoundCross {
  state: HeroState;
  from: Pose | null;
  /** game time the cross began, and its length in animation frames */
  since: number;
  frames: number;
}
