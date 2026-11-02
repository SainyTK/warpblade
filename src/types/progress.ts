import type { Perk, UltimateId } from "./skill";
import type { Stats } from "./stats";

/** One run's growth: it starts over when Kael falls. */
export interface Progress {
  level: number;
  xp: number;
  points: number;
  /** learned ranks by node id */
  ranks: Record<string, number>;
  /** derived from level and ranks */
  stats: Stats;
  perks: ReadonlySet<Perk>;
  ultimate: UltimateId;
  comboLimit: number;
}
