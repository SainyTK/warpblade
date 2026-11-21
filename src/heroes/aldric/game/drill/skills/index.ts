import type { AldricDrillSkill } from "../../../types/drillSkill";
import { BREAKING_BASH_DRILL } from "./breakingBash";
import { BULWARK_ARRIVAL_DRILL } from "./bulwarkArrival";
import { CRESTFALL_DRILL } from "./crestfall";
import { DAWN_LANCE_DRILL } from "./dawnLance";
import { HIGH_SUN_DRILL } from "./highSun";
import { IRON_RETORT_DRILL } from "./ironRetort";
import { IRON_VOW_DRILL } from "./ironVow";
import { LINGERING_DAWN_DRILL } from "./lingeringDawn";
import { MENDING_LIGHT_DRILL } from "./mendingLight";
import { OATHBLADE_DRILL } from "./oathblade";
import { PENANCE_DRILL } from "./penance";
import { RESOLVE_DRILL } from "./resolve";
import { SANCTUARY_DRILL } from "./sanctuary";
import { SHIELD_STEP_DRILL } from "./shieldStep";
import { SKYFALL_DRILL } from "./skyfall";
import { SUNBRAND_DRILL } from "./sunbrand";
import { VERDICT_DRILL } from "./verdict";

export const ALDRIC_DRILL_SKILLS: readonly AldricDrillSkill[] = [
  OATHBLADE_DRILL,
  BREAKING_BASH_DRILL,
  CRESTFALL_DRILL,
  VERDICT_DRILL,
  IRON_RETORT_DRILL,
  SHIELD_STEP_DRILL,
  BULWARK_ARRIVAL_DRILL,
  IRON_VOW_DRILL,
  RESOLVE_DRILL,
  SKYFALL_DRILL,
  DAWN_LANCE_DRILL,
  MENDING_LIGHT_DRILL,
  HIGH_SUN_DRILL,
  SUNBRAND_DRILL,
  LINGERING_DAWN_DRILL,
  PENANCE_DRILL,
  SANCTUARY_DRILL,
];
