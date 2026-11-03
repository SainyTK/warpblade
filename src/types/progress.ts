import type { Perk, UltimateId } from "./skill";
import type { Stats } from "./stats";

/** One run's growth: it starts over when Kael falls. */
export interface Progress {
  level: number;
  xp: number;
  /** skill points from level ups, spent in the picks that open when a wave is cleared */
  picks: number;
  /** learned ranks by node id */
  ranks: Record<string, number>;
  /** derived from level and ranks */
  stats: Stats;
  perks: ReadonlySet<Perk>;
  /** none until a pick teaches one */
  ultimate: UltimateId | null;
  comboLimit: number;
  /** air attacks before Kael lands */
  airLimit: number;
}
