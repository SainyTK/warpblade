import type { GameSnapshot } from "../types/snapshot";

/** What a run showed while it was played: the furthest wave, the level, kills, coins and HP lost in each wave. */
export interface RunTracker {
  observe(state: GameSnapshot): void;
  wave(): number;
  level(): number;
  kills(): number;
  coins(): number;
  hpLostByWave(): Record<string, number>;
}

export function createRunTracker(): RunTracker {
  let wave = 0;
  let level = 1;
  let kills = 0;
  let coins = 0;
  let lastHp: number | null = null;
  const lost: Record<string, number> = {};
  return {
    observe(state) {
      wave = Math.max(wave, state.wave);
      level = Math.max(level, state.level);
      kills = Math.max(kills, state.kills);
      coins = Math.max(coins, state.coins);
      if (lastHp !== null && state.hero.hp < lastHp) {
        const key = String(state.wave);
        lost[key] = Math.round(((lost[key] ?? 0) + lastHp - state.hero.hp) * 10) / 10;
      }
      lastHp = state.hero.hp;
    },
    wave: () => wave,
    level: () => level,
    kills: () => kills,
    coins: () => coins,
    hpLostByWave: () => ({ ...lost }),
  };
}
