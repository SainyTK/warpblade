import type { SkillDef } from "../../../../types/skill";
import { CLOUD_STEP } from "./cloudStep";
import { CRANES_REACH } from "./cranesReach";
import { DRIFTING_LEAF } from "./driftingLeaf";
import { FLOWING_WATER } from "./flowingWater";
import { GUARDIAN_BLADE } from "./guardianBlade";
import { HARMONY } from "./harmony";
import { HEAVENS_GROVE } from "./heavensGrove";
import { HIGH_TIDE } from "./highTide";
import { JADE_HERON } from "./jadeHeron";
import { JADE_NEEDLE } from "./jadeNeedle";
import { LINGERING_QI } from "./lingeringQi";
import { PETAL_STORM } from "./petalStorm";
import { QI_CRESCENT } from "./qiCrescent";
import { SAGES_BREATH } from "./sagesBreath";
import { SAGES_SHADE } from "./sagesShade";
import { SWORD_CAGE } from "./swordCage";
import { SWORD_FAN } from "./swordFan";
import { SWORD_RIDING } from "./swordRiding";
import { THOUSAND_CUTS } from "./thousandCuts";
import { TWIN_ECHO } from "./twinEcho";

/** Yun's 20 skills. Design: docs/skills/yun.md */
export const YUN_SKILL_DEFS: readonly SkillDef[] = [
  TWIN_ECHO,
  FLOWING_WATER,
  HIGH_TIDE,
  CRANES_REACH,
  PETAL_STORM,
  CLOUD_STEP,
  SWORD_RIDING,
  DRIFTING_LEAF,
  SWORD_FAN,
  SWORD_CAGE,
  QI_CRESCENT,
  LINGERING_QI,
  THOUSAND_CUTS,
  JADE_NEEDLE,
  GUARDIAN_BLADE,
  JADE_HERON,
  SAGES_SHADE,
  SAGES_BREATH,
  HARMONY,
  HEAVENS_GROVE,
];
