import type { SkillDef } from "../../../../types/skill";
import { BLINK_STEP } from "./blinkStep";
import { CRYSTAL_AEGIS } from "./crystalAegis";
import { CRYSTAL_FAMILIAR } from "./crystalFamiliar";
import { CRYSTAL_NOVA } from "./crystalNova";
import { CRYSTAL_SPLINTERS } from "./crystalSplinters";
import { FIRE_FLASK } from "./fireFlask";
import { ICE_SPIKES } from "./iceSpikes";
import { KEEN_EDGE } from "./keenEdge";
import { LIGHTNING } from "./lightning";
import { MIRROR_KNIGHT } from "./mirrorKnight";
import { PASSING_CUT } from "./passingCut";
import { PHANTOM_EDGE } from "./phantomEdge";
import { PHASE_CUT } from "./phaseCut";
import { REAPING_SWEEP } from "./reapingSweep";
import { RIFT_WOUND } from "./riftWound";
import { SKYBREAKER } from "./skybreaker";
import { SKY_DANCE } from "./skyDance";
import { SPELLWARP } from "./spellwarp";
import { STATIC_CHARGE } from "./staticCharge";
import { WARPCRAFT } from "./warpcraft";

/** Kael's 20 skills. Design: docs/skills/kael.md */
export const KAEL_SKILL_DEFS: readonly SkillDef[] = [
  KEEN_EDGE,
  SKYBREAKER,
  REAPING_SWEEP,
  PHASE_CUT,
  CRYSTAL_AEGIS,
  WARPCRAFT,
  BLINK_STEP,
  SPELLWARP,
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
  CRYSTAL_NOVA,
];
