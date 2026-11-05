import { COOP_SCALING } from "../constants/coop";
import type { EnemyRank } from "../types/enemy";

/** a wave's foes for this many players: the list grows by half per extra player, repeating its minions */
export function scaleFoeList<T>(foes: readonly T[], players: number, isMinion: (foe: T) => boolean): T[] {
  const minions = foes.filter(isMinion);
  const extra = Math.round(minions.length * COOP_SCALING.count * Math.max(0, players - 1));
  const out = [...foes];
  for (let i = 0; i < extra; i++) out.push(minions[i % minions.length]);
  return out;
}

/** a foe's HP for this many players */
export function scaleFoeHealth(rank: EnemyRank, hp: number, players: number): number {
  return Math.round(hp * (1 + COOP_SCALING.hp[rank] * Math.max(0, players - 1)));
}
