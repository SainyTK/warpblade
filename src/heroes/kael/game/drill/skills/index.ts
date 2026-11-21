import type { KaelDrillSkill } from "../../../types/drillSkill";
import { BLINK_STEP_DRILL } from "./blinkStep";
import { CRYSTAL_NOVA_DRILL } from "./crystalNova";
import { FIRE_FLASK_DRILL } from "./fireFlask";
import { ICE_SPIKES_DRILL } from "./iceSpikes";
import { KEEN_EDGE_DRILL } from "./keenEdge";
import { LIGHTNING_DRILL } from "./lightning";
import { PASSING_CUT_DRILL } from "./passingCut";
import { PHASE_CUT_DRILL } from "./phaseCut";
import { REAPING_SWEEP_DRILL } from "./reapingSweep";
import { SKYBREAKER_DRILL } from "./skybreaker";
import { SKY_DANCE_DRILL } from "./skyDance";
import { SPELLWARP_DRILL } from "./spellwarp";
import { WARPCRAFT_DRILL } from "./warpcraft";

export const KAEL_DRILL_SKILLS: readonly KaelDrillSkill[] = [
  KEEN_EDGE_DRILL,
  SKYBREAKER_DRILL,
  REAPING_SWEEP_DRILL,
  PHASE_CUT_DRILL,
  WARPCRAFT_DRILL,
  BLINK_STEP_DRILL,
  SPELLWARP_DRILL,
  PASSING_CUT_DRILL,
  SKY_DANCE_DRILL,
  FIRE_FLASK_DRILL,
  ICE_SPIKES_DRILL,
  LIGHTNING_DRILL,
  CRYSTAL_NOVA_DRILL,
];
