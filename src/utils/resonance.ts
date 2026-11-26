import { ELEMENT_ORDER } from "../constants/elements";
import { FLOW } from "../constants/growth";
import { ELEMENT_STATS, FUSION_RANK, FUSIONS, type FusionId, RESONANCE_WEIGHT } from "../constants/resonance";
import type { ArtDef } from "../types/art";
import type { Build, BuildStats } from "../types/build";
import type { ArtId, ElementId } from "../types/campaign";
import type { CharacterDef } from "../types/character";

export type Ranks = Record<ElementId, number>;

export const emptyRanks = (): Ranks => ({ blaze: 0, frost: 0, storm: 0, venom: 0, void: 0 });

export function resonanceRanks(b: Build, c: CharacterDef, arts: Readonly<Record<ArtId, ArtDef>>): Ranks {
  const ranks = emptyRanks();
  for (const skill of c.skills) {
    const level = b.skills[skill.id] ?? 0;
    if (!level) continue;
    ranks[skill.element] += level * RESONANCE_WEIGHT.skillLevel;
    if (b.evolved.includes(skill.id)) ranks[skill.element] += RESONANCE_WEIGHT.evolved;
  }
  for (const [id, level] of Object.entries(b.arts) as [ArtId, number][]) {
    ranks[arts[id].element] += level * RESONANCE_WEIGHT.artLevel;
  }
  return ranks;
}

export function activeFusions(ranks: Ranks): FusionId[] {
  return FUSIONS.filter((f) => ranks[f.pair[0]] >= FUSION_RANK && ranks[f.pair[1]] >= FUSION_RANK).map((f) => f.id);
}

export function strongestElements(ranks: Ranks): ElementId[] {
  return ELEMENT_ORDER.filter((id) => ranks[id] > 0).sort((a, b) => ranks[b] - ranks[a]);
}

export function resonanceStats(ranks: Ranks): BuildStats {
  return {
    might: 1,
    cooldown: Math.max(ELEMENT_STATS.fewestCooldown, 1 - ELEMENT_STATS.stormCooldown * ranks.storm),
    amount: Math.floor(ranks.void / ELEMENT_STATS.voidAmountRanks),
    area: 1 + ELEMENT_STATS.blazeArea * ranks.blaze,
    duration: 1 + ELEMENT_STATS.frostDuration * ranks.frost,
    speed: 1 + ELEMENT_STATS.stormSpeed * ranks.storm,
    luck: 1,
    growth: 1,
    vigor: 1,
    crit: ELEMENT_STATS.venomCrit * ranks.venom,
    move: 1,
    flowCap: FLOW.cap,
  };
}
