import { DPS_MODEL, FUSION_EFFECTS } from "../constants";
import type { Ranks, ResonanceRules } from "../types/game";
import type { Crowd } from "../types/model";

export interface ResonanceEffect {
  taken: number;
  multiplier: number;
}

export function resonanceMultiplier(
  rules: ResonanceRules,
  ranks: Ranks,
  fusions: readonly string[],
  critFactor: number,
  crowd: Crowd,
): ResonanceEffect {
  const { blaze, frost, storm, venom } = rules;
  const fused = (id: string): boolean => fusions.includes(id);
  const hits = crowd.hitsPerFoe;
  const chilled = ranks.frost > 0;
  const burning = ranks.blaze > 0;
  const venomStacks =
    ranks.venom > 0 ? Math.min(venom.baseStacks + venom.stacksPerRank * ranks.venom, hits * venom.duration) : 0;
  const hitsToFreeze = Math.max(
    frost.fewestHitsToFreeze,
    Math.round(frost.baseHitsToFreeze - frost.hitsPerRank * ranks.frost),
  );
  const frozen = chilled
    ? Math.min(DPS_MODEL.mostFrozenShare, (frost.freeze * hits) / hitsToFreeze) * crowd.minionShare
    : 0;
  const blackIce = fused("blackIce") && chilled ? FUSION_EFFECTS.doubledBy : 1;
  let taken = 1 + venomStacks * venom.takenPerStack * blackIce;
  taken *= 1 + frozen * (frost.frozenTaken + frost.frozenTakenPerRank * ranks.frost);
  if (fused("thermalShock") && burning) {
    taken *= 1 + frozen;
  }
  let arc = 0;
  let arcPerProc = 0;
  if (ranks.storm > 0) {
    const chance = Math.min(1, storm.chance + storm.chancePerRank * ranks.storm);
    const plasma = fused("plasma") && burning ? FUSION_EFFECTS.plasmaExtraTargets : 0;
    const targets = Math.min(crowd.foesInReach - 1, 1 + Math.floor(ranks.storm / storm.ranksPerTarget) + plasma);
    const superconductor = fused("superconductor") && chilled ? FUSION_EFFECTS.doubledBy : 1;
    const share = (storm.share + storm.sharePerRank * ranks.storm) * superconductor;
    const crit = ranks.storm >= storm.overchargeRank ? DPS_MODEL.crit : critFactor;
    arcPerProc = targets * share * crit * taken;
    arc = chance * arcPerProc;
  }
  let echo = 0;
  if (ranks.void > 0) {
    const voidRules = rules.void;
    const entropy = fused("entropy") ? venomStacks * FUSION_EFFECTS.entropyChancePerVenomStack : 0;
    const chance = Math.min(voidRules.mostChance, voidRules.chance + voidRules.chancePerRank * ranks.void + entropy);
    const echoes = ranks.void >= voidRules.riftRank ? FUSION_EFFECTS.voidRiftEchoes : 1;
    const stasis = fused("stasis") ? FUSION_EFFECTS.stasisShare : 1;
    const share = (voidRules.share + voidRules.sharePerRank * ranks.void) * stasis;
    echo = chance * echoes * share * critFactor * taken;
  }
  const firstProcs = arc + echo;
  const thunder = fused("thunderEcho") ? echo * arcPerProc : 0;
  const procs = firstProcs + firstProcs * firstProcs + thunder;
  const burnStacks = burning
    ? Math.min(blaze.baseStacks + blaze.stacksPerRank * ranks.blaze, hits * blaze.duration)
    : 0;
  const caustic = fused("causticFire") ? 1 + venomStacks * FUSION_EFFECTS.causticFirePerVenomStack : 1;
  const burn = (burnStacks * (blaze.tickShare + blaze.tickSharePerRank * ranks.blaze) * caustic) / blaze.every / hits;
  const poison = (venomStacks * venom.tickShare) / venom.every / hits;
  return { taken, multiplier: taken * (1 + procs) + taken * taken * (burn + poison) };
}
