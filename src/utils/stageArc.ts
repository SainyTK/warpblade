import { SURGE } from "../constants/campaign";
import { MAX_LEVEL } from "../constants/growth";
import {
  EXPECTED_HERO_DAMAGE,
  FOE_BAND,
  HERO_DPS_AT_LEVEL_1,
  HYPER,
  TIER_SCALE,
  TIME_TO_KILL,
} from "../constants/stageArc";
import { STAGE_TIER } from "../constants/stageGraph";
import { STAGE_WAVES } from "../constants/waves";
import type { StageDef } from "../types/campaign";
import type { FoeScale } from "../types/enemy";
import { clamp } from "./math";
import { xpToNext, xpToReach } from "./progression";

export interface StageMods {
  hp: number;
  damage: number;
  pace: number;
  coins: number;
  heartChance: number;
  crowd: number;
  eliteEvery: number;
}

export function stageMods(stage: StageDef, hyper: boolean): StageMods {
  const tier = TIER_SCALE[STAGE_TIER[stage.id]];
  const twist = stage.twist;
  return {
    hp: tier.hp * (twist.foeHp ?? 1),
    damage: tier.damage * (twist.foeDamage ?? 1),
    pace: (twist.foePace ?? 1) * (hyper ? HYPER.foePace : 1),
    coins: FOE_BAND.goldShare * (twist.coins ?? 1) * (hyper ? HYPER.coins : 1),
    heartChance: twist.heartChance ?? 1,
    crowd: twist.crowd ?? 1,
    eliteEvery: twist.eliteEvery ?? SURGE.eliteEvery,
  };
}

export const bandWave = (level: number): number =>
  1 + ((STAGE_WAVES - 1) * (clamp(level, 1, MAX_LEVEL) - 1)) / (MAX_LEVEL - 1);

export function expectedDamage(level: number): number {
  const at = clamp(level, 1, MAX_LEVEL);
  const next = EXPECTED_HERO_DAMAGE.findIndex(([l]) => l >= at);
  if (next <= 0) return EXPECTED_HERO_DAMAGE[0][1];
  const [l0, d0] = EXPECTED_HERO_DAMAGE[next - 1];
  const [l1, d1] = EXPECTED_HERO_DAMAGE[next];
  return d0 * (d1 / d0) ** ((at - l0) / (l1 - l0));
}

export function bandScale(level: number, mods: StageMods): FoeScale {
  const steps = clamp(level, 1, MAX_LEVEL) - 1;
  return {
    hp: expectedDamage(level) * mods.hp,
    damage: (1 + FOE_BAND.damagePerLevel * steps) * mods.damage,
    xp: 0,
  };
}

export const bigFoeHp = (level: number, kind: keyof typeof TIME_TO_KILL, mods: StageMods): number =>
  Math.round(HERO_DPS_AT_LEVEL_1 * expectedDamage(level) * TIME_TO_KILL[kind] * mods.hp);

export const levelBetween = (from: number, to: number, share: number): number => from + (to - from) * clamp(share);

export interface XpClaim {
  level: number;
  weight: number;
}

export function xpBudget(from: number, to: number, claims: readonly XpClaim[]): number[] {
  const total = Math.max(0, xpToReach(to) - xpToReach(from));
  const raw = claims.map((c) => c.weight * Math.max(1, xpToNext(Math.round(c.level))));
  const sum = raw.reduce((a, b) => a + b, 0);
  return sum > 0 ? raw.map((r) => (total * r) / sum) : claims.map(() => 0);
}
