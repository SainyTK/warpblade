import type { CeriseDrillSkill } from "../../../types/drillSkill";
import { FEINT_DRILL } from "./feint";
import { GRACE_DRILL } from "./grace";
import { LONG_LUNGE_DRILL } from "./longLunge";
import { MEASURED_TOUCH_DRILL } from "./measuredTouch";
import { MIRROR_GUARD_DRILL } from "./mirrorGuard";
import { NEEDLE_RAIN_DRILL } from "./needleRain";
import { PASSING_TOUCH_DRILL } from "./passingTouch";
import { PINNING_POINT_DRILL } from "./pinningPoint";
import { POISE_DRILL } from "./poise";
import { RIPOSTE_CHAIN_DRILL } from "./riposteChain";
import { ROSE_BLOOM_DRILL } from "./roseBloom";
import { ROSE_MARK_DRILL } from "./roseMark";
import { ROSE_TEMPEST_DRILL } from "./roseTempest";
import { SWALLOW_DIVE_DRILL } from "./swallowDive";
import { THORN_WOUNDS_DRILL } from "./thornWounds";

export const CERISE_DRILL_SKILLS: readonly CeriseDrillSkill[] = [
  MEASURED_TOUCH_DRILL,
  FEINT_DRILL,
  LONG_LUNGE_DRILL,
  PINNING_POINT_DRILL,
  RIPOSTE_CHAIN_DRILL,
  ROSE_MARK_DRILL,
  PASSING_TOUCH_DRILL,
  POISE_DRILL,
  GRACE_DRILL,
  SWALLOW_DIVE_DRILL,
  MIRROR_GUARD_DRILL,
  NEEDLE_RAIN_DRILL,
  ROSE_BLOOM_DRILL,
  THORN_WOUNDS_DRILL,
  ROSE_TEMPEST_DRILL,
];
