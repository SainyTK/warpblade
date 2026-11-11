import { CARRY_SHARE } from "../constants/eras";
import {
  ALIVE_CAP,
  BOSS_STREAM_SHARE,
  BOSSES,
  ELITE,
  MINI_BOSS_EVERY,
  WALKER_SHARE,
  WAVE_QUOTA,
} from "../constants/waves";
import type { EnemyType } from "../types/enemy";
import type { WaveStream } from "../types/wave";
import { eraOf, eraProgress } from "./eras";

export type WaveKind = "normal" | "mini" | "boss";

/** what a wave brings: its leader (a mini boss or a boss), the foes that stream in after it, and its elite's place */
export interface WavePlan {
  kind: WaveKind;
  leader: EnemyType | null;
  stream: EnemyType[];
  /** the index in the stream of the elite, or -1 for none */
  elite: number;
}

export function waveKind(wave: number): WaveKind {
  if (BOSSES[wave]) return "boss";
  return wave % MINI_BOSS_EVERY === 0 ? "mini" : "normal";
}

/** foes a wave brings in all, its leader included */
export const waveQuota = (wave: number): number => Math.round(WAVE_QUOTA.base * WAVE_QUOTA.growth ** (wave - 1));

/** foes that may stand at once; a stream made longer by `share` (a co-op room) raises it by as much, to a higher limit */
export function aliveCap(wave: number, share = 1): number {
  const solo = Math.min(ALIVE_CAP.base + Math.ceil(ALIVE_CAP.perWave * wave), ALIVE_CAP.most);
  return share > 1 ? Math.min(Math.round(solo * share), ALIVE_CAP.coopMost) : solo;
}

/** a normal wave from ELITE.from whose number divides by ELITE.every */
export const hasElite = (wave: number): boolean =>
  waveKind(wave) === "normal" && wave >= ELITE.from && wave % ELITE.every === 0;

/** the share of a normal stream that walks: none at wave 1, then more each wave up to half */
export const walkerShare = (wave: number): number => Math.min(WALKER_SHARE.most, WALKER_SHARE.perWave * (wave - 1));

/** whether place i of a stream falls on a share of evenly spread places */
const spread = (i: number, share: number): boolean => Math.floor((i + 1) * share) > Math.floor(i * share);

/**
 * `count` foes of a wave's era, walkers and flyers spread evenly through the stream. In an era that carries foes over,
 * the old ones are spread among the walkers and among the flyers alike, fewer as the era goes on.
 */
export function mixedStream(wave: number, count: number): EnemyType[] {
  const era = eraOf(wave);
  const walkers = walkerShare(wave);
  const old = era.carry ? CARRY_SHARE * (1 - eraProgress(wave)) : 0;
  const seen = { ground: 0, flyer: 0 };
  return Array.from({ length: count }, (_, i) => {
    const role = spread(i, walkers) ? "ground" : "flyer";
    const from = era.carry && spread(seen[role]++, old) ? era.carry : era;
    return from[role];
  });
}

/**
 * The foes of a wave, from its era. A normal wave streams its quota with one elite in the middle on every third wave from
 * wave 3; a mini boss wave brings the era's mini boss with a stream of flyers; a boss wave its boss with a stream
 * of half the quota.
 */
export function wavePlan(wave: number): WavePlan {
  const kind = waveKind(wave);
  const era = eraOf(wave);
  const quota = waveQuota(wave);
  if (kind === "boss")
    return { kind, leader: BOSSES[wave], stream: mixedStream(wave, Math.round(quota * BOSS_STREAM_SHARE)), elite: -1 };
  if (kind === "mini") return { kind, leader: era.mini, stream: Array(quota - 1).fill(era.flyer), elite: -1 };
  const stream = mixedStream(wave, quota);
  if (!hasElite(wave)) return { kind, leader: null, stream, elite: -1 };
  // the elite is always one of the era's own foes, never one carried over
  const elite = Math.floor(quota * ELITE.at);
  stream[elite] = stream[elite] === era.ground || stream[elite] === era.carry?.ground ? era.ground : era.flyer;
  return { kind, leader: null, stream, elite };
}

/** no wave in play: nothing to come */
export const emptyStream = (): WaveStream => ({ foes: [], sent: 0, elite: -1, cap: 0, refills: [] });

/** foes of the stream still to come through */
export const streamLeft = (s: WaveStream): number => s.foes.length - s.sent;
