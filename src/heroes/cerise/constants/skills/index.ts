import type { SkillDef } from "../../../../types/skill";
import { FEINT } from "./feint";
import { GRACE } from "./grace";
import { LONG_LUNGE } from "./longLunge";
import { MEASURED_TOUCH } from "./measuredTouch";
import { MIRROR_BLADE } from "./mirrorBlade";
import { MIRROR_GUARD } from "./mirrorGuard";
import { NEEDLE_RAIN } from "./needleRain";
import { PASSING_TOUCH } from "./passingTouch";
import { PETAL_BLADES } from "./petalBlades";
import { PINNING_POINT } from "./pinningPoint";
import { POISE } from "./poise";
import { RIPOSTE_CHAIN } from "./riposteChain";
import { ROSE_BLOOM } from "./roseBloom";
import { ROSE_MARK } from "./roseMark";
import { ROSE_TEMPEST } from "./roseTempest";
import { SWALLOW_DIVE } from "./swallowDive";
import { THORN_SENTINEL } from "./thornSentinel";
import { THORN_WOUNDS } from "./thornWounds";
import { WEEPING_MARK } from "./weepingMark";
import { WILTING_CURSE } from "./wiltingCurse";

/** Cerise's 20 skills. Design: docs/skills/cerise.md */
export const CERISE_SKILL_DEFS: readonly SkillDef[] = [
  MEASURED_TOUCH,
  RIPOSTE_CHAIN,
  LONG_LUNGE,
  PINNING_POINT,
  FEINT,
  ROSE_MARK,
  PASSING_TOUCH,
  SWALLOW_DIVE,
  ROSE_BLOOM,
  NEEDLE_RAIN,
  MIRROR_GUARD,
  THORN_WOUNDS,
  WEEPING_MARK,
  WILTING_CURSE,
  MIRROR_BLADE,
  PETAL_BLADES,
  THORN_SENTINEL,
  POISE,
  GRACE,
  ROSE_TEMPEST,
];
