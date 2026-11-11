import type { Pose } from "../pose";

/** what Kael's pose layer remembers between frames */
export interface KaelMotion {
  /** the clip being shown: the state, and the move in it */
  clip: string;
  face: number;
  /** the state clock last frame: a clock that ran backwards means the state started over */
  st: number;
  /** the last pose shown, and the pose a hand-over crosses from */
  last: Pose | null;
  from: Pose | null;
  /** game time the hand-over began, and its length in animation frames */
  since: number;
  frames: number;
  /** the hand-over is between a stand and a stride on the floor, so the feet step across it */
  step: boolean;
  /** the jump clip's own clock, steered by the rise, and the launch speed it is measured against */
  jumpT: number;
  jumpV0: number;
  t: number;
  ground: boolean;
  /** the last falling speed in the air, game time of the last landing, and how hard it was from 0 to 1 */
  airVy: number;
  landAt: number;
  landDepth: number;
}
