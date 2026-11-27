import { SURGE } from "../constants/campaign";
import { MAX_LEVEL } from "../constants/growth";
import {
  CROWD_TOUGHNESS,
  EXPECTED_HERO_DAMAGE,
  FOE_BAND,
  FOE_HIT,
  HERO_DPS_AT_LEVEL_1,
  HYPER,
  TIER_SCALE,
  TIME_TO_KILL,
} from "../constants/stageArc";
import { STAGE_TIER } from "../constants/stageGraph";
import { STAGE_WAVES } from "../constants/waves";
import type { ArmoryRates } from "../types/armory";
import type { LadderFoe, StageDef } from "../types/campaign";
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

export function stageMods(
  stage: StageDef,
  hyper: boolean,
  armory: Pick<ArmoryRates, "foeHp" | "foeDamage"> = { foeHp: 1, foeDamage: 1 },
): StageMods {
  const tier = TIER_SCALE[STAGE_TIER[stage.id]];
  const twist = stage.twist;
  return {
    hp: tier.hp * (twist.foeHp ?? 1) * armory.foeHp,
    damage: tier.damage * (twist.foeDamage ?? 1) * armory.foeDamage,
    pace: (twist.foePace ?? 1) * (hyper ? HYPER.foePace : 1),
    coins: FOE_BAND.goldShare * (twist.coins ?? 1) * (hyper ? HYPER.coins : 1),
    heartChance: twist.heartChance ?? 1,
    crowd: twist.crowd ?? 1,
    eliteEvery: twist.eliteEvery ?? SURGE.eliteEvery,
  };
}

export const bandWave = (level: number): number =>
  1 + ((STAGE_WAVES - 1) * (clamp(level, 1, MAX_LEVEL) - 1)) / (MAX_LEVEL - 1);

type Anchors = readonly (readonly [level: number, times: number])[];

function along(anchors: Anchors, level: number): number {
  const at = clamp(level, 1, MAX_LEVEL);
  const next = anchors.findIndex(([l]) => l >= at);
  if (next <= 0) return anchors[0][1];
  const [l0, d0] = anchors[next - 1];
  const [l1, d1] = anchors[next];
  return d0 * (d1 / d0) ** ((at - l0) / (l1 - l0));
}

export const expectedDamage = (level: number): number => along(EXPECTED_HERO_DAMAGE, level);

export const crowdDamage = (level: number): number => expectedDamage(level) * along(CROWD_TOUGHNESS, level);

export const bandDamage = (level: number, mods: StageMods): number =>
  (1 + FOE_BAND.damagePerLevel * (clamp(level, 1, MAX_LEVEL) - 1)) * mods.damage;

export const ladderHp = (entry: LadderFoe, mods: StageMods): number =>
  Math.max(1, Math.round(entry.hits * FOE_HIT * crowdDamage(entry.level) * mods.hp));

export const bigFoeHp = (level: number, kind: Exclude<keyof typeof TIME_TO_KILL, "minion">, mods: StageMods): number =>
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
