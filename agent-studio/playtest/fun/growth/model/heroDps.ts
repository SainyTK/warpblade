import { DPS_MODEL } from "../constants";
import type { Build, Game, HeroDef, SkillDef } from "../types/game";
import type { Crowd } from "../types/model";
import { resonanceMultiplier } from "./resonanceMultiplier";

const critFactorOf = (crit: number): number => 1 + Math.min(1, crit) * (DPS_MODEL.crit - 1);

const kindListed = (kinds: readonly string[], skill: SkillDef): boolean => kinds.includes(skill.kind);

function skillValue(game: Game, skill: SkillDef, level: number, evolved: boolean): number {
  const atTop = DPS_MODEL.riskValue[skill.risk] * DPS_MODEL.kindScale[skill.kind];
  if (evolved) {
    return DPS_MODEL.riskValue[skill.risk] * DPS_MODEL.evolvedTimes[skill.risk];
  }
  const top = game.growth.skillMaxLevel;
  return atTop * DPS_MODEL.firstLevelShare[skill.kind] ** ((top - level) / (top - 1));
}

export function heroDps(game: Game, hero: HeroDef, level: number, build: Build, crowd: Crowd): number {
  const ranks = game.resonanceRanks(build, hero);
  const fusions = game.activeFusions(ranks);
  const buildStats = game.resonanceStats(ranks);
  const pact = game.pactPower(hero, build);
  const rows = [...game.heldRows(hero, build), ...game.growthRows(build), { scale: { ad: pact, ap: pact } }];
  const stats = game.computeStats(hero, level, rows, {}, buildStats);
  const attackPower = stats.ad / hero.base.ad;
  const abilityPower = stats.ap / hero.base.ap;
  const cooldownRate = stats.haste / buildStats.cooldown;
  const critFactor = critFactorOf(stats.crit);
  const charge = 1 + DPS_MODEL.chargedShareOfAttacks * game.growth.chargeDamage * build.chargeRank;
  const kitAttacks = DPS_MODEL.baseKit * DPS_MODEL.baseAttackShare * attackPower * stats.aspd * charge;
  const kitAbilities = DPS_MODEL.baseKit * (1 - DPS_MODEL.baseAttackShare) * abilityPower * cooldownRate;
  let direct = 0;
  let overTime = 0;
  for (const skill of hero.skills) {
    const skillLevel = build.skills[skill.id] ?? 0;
    if (!skillLevel) {
      continue;
    }
    let value = skillValue(game, skill, skillLevel, build.evolved.includes(skill.id));
    value *= kindListed(DPS_MODEL.abilityPowerKinds, skill) ? abilityPower : attackPower;
    if (kindListed(DPS_MODEL.cooldownKinds, skill)) {
      value *= cooldownRate;
    } else if (skill.kind === "attack") {
      value *= stats.aspd;
    }
    if (skill.kind === "dot") {
      overTime += value;
    } else {
      direct += value;
    }
  }
  const resonance = resonanceMultiplier(game.resonance, ranks, fusions, critFactor, crowd);
  const hits = (kitAttacks + kitAbilities + direct) * (critFactor / critFactorOf(hero.base.crit));
  return hits * resonance.multiplier + overTime * resonance.taken;
}
