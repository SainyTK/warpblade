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
  warden: { rank: "boss", hp: 720, xp: 220, weight: 0.95, launchable: false, name: "Rift Warden" },
  // day, waves 1 to 5
  thornback: { rank: "minion", hp: 64, xp: 13, weight: 0.45, launchable: true, name: "Thornback" },
  moth: { rank: "minion", hp: 30, xp: 8, weight: 0, launchable: true, name: "Glimmer Moth" },
  oakheart: { rank: "mini", hp: 400, xp: 70, weight: 0.85, launchable: false, name: "Oakheart" },
  // rain, waves 6 to 10
  mire: { rank: "minion", hp: 70, xp: 14, weight: 0.5, launchable: true, name: "Mire Toad" },
  stormkite: { rank: "minion", hp: 34, xp: 9, weight: 0, launchable: true, name: "Storm Kite" },
  boghulk: { rank: "mini", hp: 430, xp: 72, weight: 0.85, launchable: false, name: "Bog Hulk" },
  // twilight, waves 16 to 20
  golem: { rank: "minion", hp: 80, xp: 15, weight: 0.6, launchable: true, name: "Rune Golem" },
  sprite: { rank: "minion", hp: 36, xp: 10, weight: 0, launchable: true, name: "Prism Sprite" },
  // abyss, waves 21 to 30
  stalker: { rank: "minion", hp: 74, xp: 15, weight: 0.4, launchable: true, name: "Void Stalker" },
  eye: { rank: "minion", hp: 40, xp: 10, weight: 0, launchable: true, name: "Abyss Eye" },
  maw: { rank: "mini", hp: 460, xp: 76, weight: 0.9, launchable: false, name: "Abyss Maw" },
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

/** resting minions closer than `gap` art pixels part at up to `speed` pixels a second, kept `wall` pixels from the edges */
export const SEPARATION = { gap: 14, speed: 40, wall: 8 } as const;
