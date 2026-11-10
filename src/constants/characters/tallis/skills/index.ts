import type { SkillDef } from "../../../../types/skill";
import { AMBUSH } from "./ambush";
import { BACKBITER } from "./backbiter";
import { CALTROPS } from "./caltrops";
import { CUT_TENDON } from "./cutTendon";
import { DEEP_SHADOW } from "./deepShadow";
import { ECLIPSE } from "./eclipse";
import { GLOAM_CROWS } from "./gloamCrows";
import { HOLLOW_WRAITH } from "./hollowWraith";
import { INK_WOUND } from "./inkWound";
import { MARK_OF_DUSK } from "./markOfDusk";
import { NEEDLE_FAN } from "./needleFan";
import { NIGHT_LEAP } from "./nightLeap";
import { NIGHTSHADE } from "./nightshade";
import { OPEN_VEINS } from "./openVeins";
import { PLUNGE } from "./plunge";
import { QUICK_KNIVES } from "./quickKnives";
import { QUIET_STEP } from "./quietStep";
import { SHADOW_DOUBLE } from "./shadowDouble";
import { SHROUD } from "./shroud";
import { TURNABOUT } from "./turnabout";

/** Tallis's 20 skills, in the order the Codex lists them. Design: docs/skills/tallis.md */
export const TALLIS_SKILL_DEFS: readonly SkillDef[] = [
  BACKBITER,
  AMBUSH,
  QUICK_KNIVES,
  TURNABOUT,
  PLUNGE,
  CUT_TENDON,
  DEEP_SHADOW,
  QUIET_STEP,
  NIGHT_LEAP,
  NEEDLE_FAN,
  MARK_OF_DUSK,
  CALTROPS,
  OPEN_VEINS,
  NIGHTSHADE,
  INK_WOUND,
  GLOAM_CROWS,
  SHADOW_DOUBLE,
  HOLLOW_WRAITH,
  SHROUD,
  ECLIPSE,
];
