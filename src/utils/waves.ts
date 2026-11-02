import { BOSS_WAVES, MAX_FOES, MINI_BOSS_EVERY } from "../constants/waves";
import type { EnemyType } from "../types/enemy";

export type WaveKind = "normal" | "mini" | "boss";

export function waveKind(wave: number): WaveKind {
  if (BOSS_WAVES.includes(wave)) return "boss";
  return wave % MINI_BOSS_EVERY === 0 ? "mini" : "normal";
}

/** the foes of a wave: more each wave, husks from wave 2, a brute with escorts every fifth wave, the warden alone */
export function waveFoes(wave: number): EnemyType[] {
  const kind = waveKind(wave);
  if (kind === "boss") return ["warden"];
  if (kind === "mini") return ["brute", ...Array<EnemyType>(1 + Math.floor(wave / MINI_BOSS_EVERY)).fill("wisp")];
  const count = Math.min(3 + Math.floor(wave / 3), MAX_FOES);
  const husks = Math.min(Math.floor(wave / 2), Math.ceil(count / 2));
  return Array.from({ length: count }, (_, i) => (i < husks ? "husk" : "wisp"));
}
