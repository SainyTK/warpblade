import type { FusionId } from "../constants/resonance";
import type { Ranks } from "../utils/resonance";
import type { Build } from "./build";
import type { Stats } from "./stats";

/** One run's growth: it starts over when the hero falls. */
export interface Progress {
  level: number;
  xp: number;
  /** points from level ups, spent in the picks that open when a wave is cleared */
  picks: number;
  /** derived from the level and the build's skills and charms */
  stats: Stats;
  /** the hero's special, or the ultimate an ultimate skill puts on U */
  ultimate: string;
  /** the ground string's length, fixed per hero */
  comboLimit: number;
  /** air attacks before the hero lands */
  airLimit: number;
  /** skills, charms, Flow and the pick tools of this run */
  build: Build;
  resonance: Ranks;
  fusions: FusionId[];
  heartShards: number;
  manaShards: number;
  hpPerSecond: number;
  mpPerSecond: number;
}
