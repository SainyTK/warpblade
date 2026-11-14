import type { Enemy } from "../../../../types/enemy";

/** Point Blank's share of the counter shot */
export function counterBonus(_foe: Enemy | null): { power: number; rounds: number } {
  return { power: 1, rounds: 0 };
}
