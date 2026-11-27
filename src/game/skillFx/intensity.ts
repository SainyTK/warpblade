import { HERO_LEVEL_POWER, SKILL_MAX_LEVEL } from "../../constants/growth";
import { ELEMENT_FX, FX_TIERS, FX_INTENSITY as K } from "../../constants/skillFx";
import type { ElementId } from "../../types/campaign";
import type { FxCast, FxTier } from "../../types/skillFx";
import { clamp } from "../../utils/math";
import { skillOf } from "../../utils/skills";
import { skillEvolved, skillLevel } from "../skills/query";
import { character, progress } from "../state";

export interface IntensityInput {
  level: number;
  mastery: number;
  evolved: boolean;
  hitRatio: number;
  minor?: boolean;
}

export function expectedHit(): number {
  return Math.max(1, character.base.ad * HERO_LEVEL_POWER ** (progress.level - 1));
}

export function intensityOf({ level, mastery, evolved, hitRatio, minor }: IntensityInput): number {
  const rank = (clamp(level, 1, SKILL_MAX_LEVEL) - 1) / (SKILL_MAX_LEVEL - 1);
  const punch = clamp(Math.log2(Math.max(0.01, hitRatio)) * K.punchPerDoubling, K.punchLow, K.punchHigh);
  const growth = rank * K.levelWeight + mastery * K.masteryStep + (evolved ? K.evolvedBonus : 0);
  const total = growth + punch - (minor ? K.minorDrop : 0);
  return clamp(total, 0, K.most);
}

export function tierOf(intensity: number, evolved: boolean): FxTier {
  if (evolved && intensity >= K.evolvedFrom) return "evolved";
  if (intensity >= K.lateFrom) return "late";
  return intensity >= K.midFrom ? "mid" : "early";
}

const TIER_FLOOR: Readonly<Record<FxTier, number>> = {
  early: 0,
  mid: K.midFrom,
  late: K.lateFrom,
  evolved: K.evolvedFrom,
};

export function castFrom(id: string, element: ElementId, input: IntensityInput): FxCast {
  const intensity = intensityOf(input);
  const tier = tierOf(intensity, input.evolved);
  const feel = FX_TIERS[tier];
  const gradeInTier = clamp((intensity - TIER_FLOOR[tier]) / 0.8);
  return {
    id,
    element,
    tier,
    intensity,
    gradeInTier,
    size: feel.size * (1 + K.gradeSpan * gradeInTier),
    feel,
    look: ELEMENT_FX[element],
    fillsScreen: tier === "evolved" && intensity >= K.fillsScreenFrom,
  };
}

export function skillCast(id: string, damage?: number, element?: ElementId, minor = false): FxCast {
  const level = Math.max(1, skillLevel(id));
  const def = skillOf(character, id);
  return castFrom(id, element ?? def?.element ?? "void", {
    level,
    mastery: progress.build.mastery[id] ?? 0,
    evolved: skillEvolved(id),
    hitRatio: damage === undefined ? 1 : damage / expectedHit(),
    minor,
  });
}
