import type { YunDrillSkill } from "../../../types/drillSkill";
import { CLOUD_STEP_DRILL } from "./cloudStep";
import { CRANES_REACH_DRILL } from "./cranesReach";
import { DRIFTING_LEAF_DRILL } from "./driftingLeaf";
import { FLOWING_WATER_DRILL } from "./flowingWater";
import { HARMONY_DRILL } from "./harmony";
import { HEAVENS_GROVE_DRILL } from "./heavensGrove";
import { HIGH_TIDE_DRILL } from "./highTide";
import { LINGERING_QI_DRILL } from "./lingeringQi";
import { PETAL_STORM_DRILL } from "./petalStorm";
import { QI_CRESCENT_DRILL } from "./qiCrescent";
import { SAGES_BREATH_DRILL } from "./sagesBreath";
import { SWORD_CAGE_DRILL } from "./swordCage";
import { SWORD_FAN_DRILL } from "./swordFan";
import { SWORD_RIDING_DRILL } from "./swordRiding";
import { TWIN_ECHO_DRILL } from "./twinEcho";

export const YUN_DRILL_SKILLS: readonly YunDrillSkill[] = [
  FLOWING_WATER_DRILL,
  TWIN_ECHO_DRILL,
  HIGH_TIDE_DRILL,
  PETAL_STORM_DRILL,
  CRANES_REACH_DRILL,
  SWORD_RIDING_DRILL,
  DRIFTING_LEAF_DRILL,
  HARMONY_DRILL,
  SAGES_BREATH_DRILL,
  CLOUD_STEP_DRILL,
  SWORD_FAN_DRILL,
  SWORD_CAGE_DRILL,
  QI_CRESCENT_DRILL,
  LINGERING_QI_DRILL,
  HEAVENS_GROVE_DRILL,
];
