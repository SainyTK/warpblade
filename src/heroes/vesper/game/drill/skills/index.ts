import type { VesperDrillSkill } from "../../../types/drillSkill";
import { AFTERGLOW_DRILL } from "./afterglow";
import { ASCENDING_STEP_DRILL } from "./ascendingStep";
import { CROSSING_STORM_DRILL } from "./crossingStorm";
import { DUSK_GALE_DRILL } from "./duskGale";
import { DUSK_SIGIL_DRILL } from "./duskSigil";
import { DUSK_THREAD_DRILL } from "./duskThread";
import { DUSK_WALTZ_DRILL } from "./duskWaltz";
import { FALLING_MOON_DRILL } from "./fallingMoon";
import { FALLING_NIGHT_DRILL } from "./fallingNight";
import { RISING_EDGE_DRILL } from "./risingEdge";
import { SKY_RIBBON_DRILL } from "./skyRibbon";
import { SLIPSTREAM_DRILL } from "./slipstream";
import { THROWN_DUSK_DRILL } from "./thrownDusk";
import { TURNING_BLADE_DRILL } from "./turningBlade";
import { TWIN_KEEN_DRILL } from "./twinKeen";
import { UNBROKEN_RHYTHM_DRILL } from "./unbrokenRhythm";
import { WANDERERS_GRACE_DRILL } from "./wanderersGrace";

export const VESPER_DRILL_SKILLS: readonly VesperDrillSkill[] = [
  RISING_EDGE_DRILL,
  TWIN_KEEN_DRILL,
  CROSSING_STORM_DRILL,
  SKY_RIBBON_DRILL,
  TURNING_BLADE_DRILL,
  ASCENDING_STEP_DRILL,
  THROWN_DUSK_DRILL,
  SLIPSTREAM_DRILL,
  WANDERERS_GRACE_DRILL,
  UNBROKEN_RHYTHM_DRILL,
  FALLING_MOON_DRILL,
  DUSK_GALE_DRILL,
  DUSK_THREAD_DRILL,
  DUSK_SIGIL_DRILL,
  FALLING_NIGHT_DRILL,
  AFTERGLOW_DRILL,
  DUSK_WALTZ_DRILL,
];
