import { SHARD_GAIN } from "../constants/vitals";
import type { Stats } from "../types/stats";

export function withShards(bonus: Partial<Stats>, hearts: number, manas: number): Partial<Stats> {
  return {
    ...bonus,
    hp: (bonus.hp ?? 0) + hearts * SHARD_GAIN.heart,
    mp: (bonus.mp ?? 0) + manas * SHARD_GAIN.mana,
  };
}
