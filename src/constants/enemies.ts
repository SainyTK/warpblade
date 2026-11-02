import type { EnemyRank, EnemyType } from "../types/enemy";

export interface EnemyDef {
  rank: EnemyRank;
  hp: number;
  xp: number;
  /** 0 takes full knockback, 1 takes none */
  weight: number;
  /** can be launched and juggled */
  launchable: boolean;
  name: string;
}

export const ENEMIES: Record<EnemyType, EnemyDef> = {
  wisp: { rank: "minion", hp: 34, xp: 8, weight: 0, launchable: true, name: "Wisp" },
  husk: { rank: "minion", hp: 72, xp: 14, weight: 0.5, launchable: true, name: "Husk" },
  brute: { rank: "mini", hp: 420, xp: 70, weight: 0.85, launchable: false, name: "Rift Brute" },
  warden: { rank: "boss", hp: 900, xp: 220, weight: 0.95, launchable: false, name: "Rift Warden" },
};

/** contact and attack damage before wave scaling */
export const ENEMY_HITS = {
  wispLunge: 12,
  huskSwipe: 16,
  huskTouch: 8,
  bruteSwipe: 22,
  bruteSlam: 26,
  wardenOrb: 14,
  wardenDive: 22,
} as const;
