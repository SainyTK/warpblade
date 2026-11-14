import type { SkillDef } from "../../../../types/skill";
import { AFTERGLOW } from "./afterglow";
import { ASCENDING_STEP } from "./ascendingStep";
import { CROSSING_STORM } from "./crossingStorm";
import { DUSK_GALE } from "./duskGale";
import { DUSK_SHADE } from "./duskShade";
import { DUSK_SIGIL } from "./duskSigil";
import { DUSK_THREAD } from "./duskThread";
import { DUSK_WALTZ } from "./duskWaltz";
import { FALLING_MOON } from "./fallingMoon";
import { FALLING_NIGHT } from "./fallingNight";
import { NIGHT_SWALLOWS } from "./nightSwallows";
import { RISING_EDGE } from "./risingEdge";
import { SKY_RIBBON } from "./skyRibbon";
import { SLIPSTREAM } from "./slipstream";
import { THROWN_DUSK } from "./thrownDusk";
import { TURNING_BLADE } from "./turningBlade";
import { TWIN_KEEN } from "./twinKeen";
import { TWIN_PHANTOM } from "./twinPhantom";
import { UNBROKEN_RHYTHM } from "./unbrokenRhythm";
import { WANDERERS_GRACE } from "./wanderersGrace";

/** Vesper's 20 skills. Design: docs/skills/vesper.md */
export const VESPER_SKILL_DEFS: readonly SkillDef[] = [
  RISING_EDGE,
  TWIN_KEEN,
  SKY_RIBBON,
  CROSSING_STORM,
  TURNING_BLADE,
  ASCENDING_STEP,
  THROWN_DUSK,
  SLIPSTREAM,
  FALLING_MOON,
  DUSK_GALE,
  DUSK_THREAD,
  DUSK_SIGIL,
  FALLING_NIGHT,
  AFTERGLOW,
  DUSK_SHADE,
  NIGHT_SWALLOWS,
  TWIN_PHANTOM,
  DUSK_WALTZ,
  UNBROKEN_RHYTHM,
  WANDERERS_GRACE,
];
