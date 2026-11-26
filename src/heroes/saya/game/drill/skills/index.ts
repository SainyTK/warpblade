import type { SayaDrillSkill } from "../../../types/drillSkill";
import { CALM_MIND_DRILL } from "./calmMind";
import { CLEAN_SHEATHE_DRILL } from "./cleanSheathe";
import { CRESCENT_WAVE_DRILL } from "./crescentWave";
import { FALLING_MOON_DRILL } from "./fallingMoon";
import { FEATHER_STEP_DRILL } from "./featherStep";
import { HONED_DRAW_DRILL } from "./honedDraw";
import { INK_FLOW_DRILL } from "./inkFlow";
import { INK_RAIN_DRILL } from "./inkRain";
import { LINGERING_LINE_DRILL } from "./lingeringLine";
import { LONG_STROKE_DRILL } from "./longStroke";
import { PASSING_DRAW_DRILL } from "./passingDraw";
import { REVERSE_EDGE_DRILL } from "./reverseEdge";
import { SHADOW_STEP_DRILL } from "./shadowStep";
import { SILENT_MOON_DRILL } from "./silentMoon";
import { STILL_WATER_DRILL } from "./stillWater";

export const SAYA_DRILL_SKILLS: readonly SayaDrillSkill[] = [
  HONED_DRAW_DRILL,
  REVERSE_EDGE_DRILL,
  CLEAN_SHEATHE_DRILL,
  FALLING_MOON_DRILL,
  CALM_MIND_DRILL,
  PASSING_DRAW_DRILL,
  SHADOW_STEP_DRILL,
  LONG_STROKE_DRILL,
  INK_FLOW_DRILL,
  FEATHER_STEP_DRILL,
  CRESCENT_WAVE_DRILL,
  INK_RAIN_DRILL,
  STILL_WATER_DRILL,
  LINGERING_LINE_DRILL,
  SILENT_MOON_DRILL,
];
