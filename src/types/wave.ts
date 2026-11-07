import type { EnemyType } from "./enemy";

/** the foes of the wave in play that are still to come through rifts, and the places waiting to be filled */
export interface WaveStream {
  /** the whole stream in order, the leader excluded */
  foes: EnemyType[];
  /** how many of it have come through so far */
  sent: number;
  /** the index of the elite in it, or -1 */
  elite: number;
  /** foes that may stand at once */
  cap: number;
  /** seconds until each freed place's rift opens */
  refills: number[];
}
