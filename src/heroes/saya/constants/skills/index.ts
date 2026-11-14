import type { SkillDef } from "../../../../types/skill";
import { CALM_MIND } from "./calmMind";
import { CLEAN_SHEATHE } from "./cleanSheathe";
import { CRESCENT_WAVE } from "./crescentWave";
import { DEEP_BREATH } from "./deepBreath";
import { FALLING_MOON } from "./fallingMoon";
import { HONED_DRAW } from "./honedDraw";
import { INK_CRANE } from "./inkCrane";
import { INK_FLOW } from "./inkFlow";
import { INK_RAIN } from "./inkRain";
import { INK_STAIN } from "./inkStain";
import { LINGERING_LINE } from "./lingeringLine";
import { LONG_STROKE } from "./longStroke";
import { PAPER_BLADES } from "./paperBlades";
import { PASSING_DRAW } from "./passingDraw";
import { REVERSE_EDGE } from "./reverseEdge";
import { SHADE } from "./shade";
import { SHADOW_STEP } from "./shadowStep";
import { SILENT_MOON_SKILL } from "./silentMoon";
import { STILL_WATER } from "./stillWater";
import { WEEPING_CUT } from "./weepingCut";

/** Saya's 20 skills. Design: docs/skills/saya.md */
export const SAYA_SKILL_DEFS: readonly SkillDef[] = [
  HONED_DRAW,
  CLEAN_SHEATHE,
  REVERSE_EDGE,
  INK_FLOW,
  FALLING_MOON,
  PASSING_DRAW,
  SHADOW_STEP,
  LONG_STROKE,
  CRESCENT_WAVE,
  INK_RAIN,
  STILL_WATER,
  WEEPING_CUT,
  INK_STAIN,
  LINGERING_LINE,
  INK_CRANE,
  SHADE,
  PAPER_BLADES,
  DEEP_BREATH,
  CALM_MIND,
  SILENT_MOON_SKILL,
];
