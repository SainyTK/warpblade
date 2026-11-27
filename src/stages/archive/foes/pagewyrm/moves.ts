import { BOSS_PHASES } from "../../../../constants/bossFight";
export const WYRM_HITS = { erupt: 22, page: 11, wave: 16, bite: 20, touch: 8 } as const;

export const WYRM = {
  enrage: BOSS_PHASES.second,
  dive: 0.45,
  travel: 165,
  travelMost: 1.6,
  mark: { calm: 0.95, enraged: 0.62 },
  erupt: { rise: 0.18, hurt: 0.34, hold: 0.55, half: 11, height: 60 },
  storm: { wind: 0.85, fire: 0.5, speed: 112, spread: 0.17, calm: 5, enraged: 7, volleys: { calm: 1, enraged: 2 } },
  wave: { wind: 0.8, slam: 0.14, hold: 0.55, speed: 122, height: 12, reach: 170 },
  bite: { coil: 0.7, strike: 0.16, lag: 0.32, hold: 0.4, reach: 86, height: 20, offset: 92 },
  recover: 0.85,
  summon: 1.6,
  cooldown: { calm: [1.1, 1.7], enraged: [0.7, 1.15] },
  keep: 70,
  slide: 22,
} as const;

export const MOVE = { erupt: 1, storm: 2, wave: 3, bite: 4 } as const;
export type MoveId = (typeof MOVE)[keyof typeof MOVE];
export const MOVES: readonly MoveId[] = [MOVE.erupt, MOVE.storm, MOVE.wave, MOVE.bite];
