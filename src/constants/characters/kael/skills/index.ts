import type { SkillDef } from "../../../../types/skill";
import { BLINK_STEP } from "./blinkStep";
import { CRYSTAL_FAMILIAR } from "./crystalFamiliar";
import { CRYSTAL_SPLINTERS } from "./crystalSplinters";
import { FIRE_FLASK } from "./fireFlask";
import { ICE_SPIKES } from "./iceSpikes";
import { KEEN_EDGE } from "./keenEdge";
import { LIGHTNING } from "./lightning";
import { MIRROR_KNIGHT } from "./mirrorKnight";
import { PASSING_CUT } from "./passingCut";
import { PHANTOM_EDGE } from "./phantomEdge";
import { PHANTOM_LEGION } from "./phantomLegion";
import { PHASE_CUT } from "./phaseCut";
import { REAPING_SWEEP } from "./reapingSweep";
import { RIFT_WOUND } from "./riftWound";
import { SKYBREAKER } from "./skybreaker";
import { SKY_DANCE } from "./skyDance";
import { STARFALL } from "./starfall";
import { STATIC_CHARGE } from "./staticCharge";
import { THOUSAND_EDGES } from "./thousandEdges";
import { WARPCRAFT } from "./warpcraft";

/** Kael's 20 skills. Design: docs/skills/kael.md */
export const KAEL_SKILL_DEFS: readonly SkillDef[] = [
  KEEN_EDGE,
  SKYBREAKER,
  REAPING_SWEEP,
  PHASE_CUT,
  WARPCRAFT,
  BLINK_STEP,
  PASSING_CUT,
  SKY_DANCE,
  FIRE_FLASK,
  ICE_SPIKES,
  LIGHTNING,
  CRYSTAL_SPLINTERS,
  RIFT_WOUND,
  STATIC_CHARGE,
  PHANTOM_EDGE,
  CRYSTAL_FAMILIAR,
  MIRROR_KNIGHT,
  THOUSAND_EDGES,
  PHANTOM_LEGION,
  STARFALL,
];
