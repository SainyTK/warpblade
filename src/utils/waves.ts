import { CARRY_SHARE } from "../constants/eras";
import { BOSS_WAVES, MAX_FOES, MINI_BOSS_EVERY } from "../constants/waves";
import type { EnemyType } from "../types/enemy";
import { eraOf, eraProgress } from "./eras";

export type WaveKind = "normal" | "mini" | "boss";

export function waveKind(wave: number): WaveKind {
  if (BOSS_WAVES.includes(wave)) return "boss";
  return wave % MINI_BOSS_EVERY === 0 ? "mini" : "normal";
}

/**
 * The foes of a wave, from its era: more each wave, walkers from wave 2, the era's mini boss with flying escorts every
 * fifth wave, the warden alone. In an era that carries foes over, the old ones thin out as the era goes on.
 */
export function waveFoes(wave: number): EnemyType[] {
  const kind = waveKind(wave);
  const era = eraOf(wave);
  if (kind === "boss") return ["warden"];
  if (kind === "mini") return [era.mini, ...Array<EnemyType>(1 + Math.floor(wave / MINI_BOSS_EVERY)).fill(era.flyer)];
  const count = Math.min(3 + Math.floor(wave / 3), MAX_FOES);
  const walkers = Math.min(Math.floor(wave / 2), Math.ceil(count / 2));
  const old = era.carry ? Math.round(count * CARRY_SHARE * (1 - eraProgress(wave))) : 0;
  return Array.from({ length: count }, (_, i) => {
    const walker = i < walkers;
    // the old foes take every other place, so both walkers and flyers keep some
    const carried = era.carry && i % 2 === 1 && Math.floor(i / 2) < old;
    const from = carried && era.carry ? era.carry : era;
    return walker ? from.ground : from.flyer;
  });
}
