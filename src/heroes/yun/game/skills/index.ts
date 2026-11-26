import { nativeOrDrill } from "../../../../drill";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skillIds";
import { cloudStep } from "./cloudStep";
import { guardianBlade } from "./guardianBlade";
import { harmony } from "./harmony";
import { jadeHeron } from "./jadeHeron";
import { jadeNeedle } from "./jadeNeedle";
import { jadeNeedleDrill } from "./jadeNeedleDrill";
import { lingeringQi } from "./lingeringQi";
import { lingeringQiDrill } from "./lingeringQiDrill";
import { sagesBreath } from "./sagesBreath";
import { sagesShade } from "./sagesShade";
import { sagesShadeDrill } from "./sagesShadeDrill";
import { thousandCuts } from "./thousandCuts";
import { thousandCutsDrill } from "./thousandCutsDrill";

/**
 * Code of Yun's skills that act on their own or answer events, by skill id. The skills that reshape his own moves are
 * read where the move is: the string (`shapeHit`, Flowing Water, High Tide, Petal Storm), the echo (Twin Echo), the warp
 * (Sword Riding), the dodge (Drifting Leaf), the abilities (Sword Fan, Sword Cage, Qi Crescent), the swords (Sage's
 * Breath) and Jade Rain (Heaven's Grove).
 */
export const YUN_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  [SKILL.cloud]: nativeOrDrill(cloudStep),
  [SKILL.guardian]: guardianBlade,
  [SKILL.harmony]: nativeOrDrill(harmony),
  [SKILL.heron]: jadeHeron,
  [SKILL.needle]: nativeOrDrill(jadeNeedle, jadeNeedleDrill),
  [SKILL.wound]: nativeOrDrill(lingeringQi, lingeringQiDrill),
  [SKILL.breath]: nativeOrDrill(sagesBreath),
  [SKILL.shade]: nativeOrDrill(sagesShade, sagesShadeDrill),
  [SKILL.bleed]: nativeOrDrill(thousandCuts, thousandCutsDrill),
};
