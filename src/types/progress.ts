import type { Perk, UltimateId } from "./skill";
import type { Stats } from "./stats";

/** what earned a pick */
export type PickReason = { kind: "level"; level: number } | { kind: "wave"; wave: number };

/** One run's growth: it starts over when Kael falls. */
export interface Progress {
  level: number;
  xp: number;
  /** level ups and cleared waves still waiting for a pick, oldest first */
  picks: PickReason[];
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
