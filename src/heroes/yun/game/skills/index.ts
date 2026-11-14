import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { cloudStep } from "./cloudStep";
import { guardianBlade } from "./guardianBlade";
import { harmony } from "./harmony";
import { jadeHeron } from "./jadeHeron";
import { jadeNeedle } from "./jadeNeedle";
import { lingeringQi } from "./lingeringQi";
import { sagesBreath } from "./sagesBreath";
import { sagesShade } from "./sagesShade";
import { thousandCuts } from "./thousandCuts";

/**
 * Code of Yun's skills that act on their own or answer events, by skill id. The skills that reshape his own moves are
 * read where the move is: the string (`shapeHit`, Flowing Water, High Tide, Petal Storm), the echo (Twin Echo), the warp
 * (Sword Riding), the dodge (Drifting Leaf), the abilities (Sword Fan, Sword Cage, Qi Crescent), the swords (Sage's
 * Breath) and Jade Rain (Heaven's Grove).
 */
export const YUN_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  [SKILL.cloud]: cloudStep,
  [SKILL.guardian]: guardianBlade,
  [SKILL.harmony]: harmony,
  [SKILL.heron]: jadeHeron,
  [SKILL.needle]: jadeNeedle,
  [SKILL.wound]: lingeringQi,
  [SKILL.breath]: sagesBreath,
  [SKILL.shade]: sagesShade,
  [SKILL.bleed]: thousandCuts,
};
