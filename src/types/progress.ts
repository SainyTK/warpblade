import type { Perk, UltimateId } from "./skill";
import type { Stats } from "./stats";

/** One run's growth: it starts over when Kael falls. */
export interface Progress {
  level: number;
  xp: number;
  /** level ups still waiting for a pick */
  picks: number;
  /** learned ranks by node id */
  ranks: Record<string, number>;
  /** derived from level and ranks */
  stats: Stats;
  perks: ReadonlySet<Perk>;
  ultimate: UltimateId;
  comboLimit: number;
  /** air attacks before Kael lands */
  airLimit: number;
}
