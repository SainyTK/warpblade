import type { SkillDef } from "../../../../types/skill";
import { ANVIL_WEIGHT } from "./anvilWeight";
import { BELLOWS } from "./bellows";
import { BRAND_PILLARS } from "./brandPillars";
import { CINDER_EDGE } from "./cinderEdge";
import { COUNTER_CLEAVE } from "./counterCleave";
import { CRATER_LEAP } from "./craterLeap";
import { CRIMSON_FALL } from "./crimsonFall";
import { CRUSHING_WEIGHT } from "./crushingWeight";
import { ECHO_SWING } from "./echoSwing";
import { EMBER_ARC } from "./emberArc";
import { FALLING_BLADE } from "./fallingBlade";
import { FAULT_LINES } from "./faultLines";
import { HEART_SPLINTER } from "./heartSplinter";
import { HEAVY_HANDS } from "./heavyHands";
import { IRON_SKIN } from "./ironSkin";
import { SHOULDER_CHARGE } from "./shoulderCharge";
import { SKYWARD_HEAVE } from "./skywardHeave";
import { SPINNING_THROW } from "./spinningThrow";
import { WAR_CRY } from "./warCry";
import { WIDE_ARC } from "./wideArc";

/** Brynn's 20 skills. Design: docs/skills/brynn.md */
export const BRYNN_SKILL_DEFS: readonly SkillDef[] = [
  HEAVY_HANDS,
  WIDE_ARC,
  SKYWARD_HEAVE,
  ANVIL_WEIGHT,
  COUNTER_CLEAVE,
  SPINNING_THROW,
  CRATER_LEAP,
  SHOULDER_CHARGE,
  EMBER_ARC,
  BRAND_PILLARS,
  WAR_CRY,
  CINDER_EDGE,
  FAULT_LINES,
  CRUSHING_WEIGHT,
  FALLING_BLADE,
  ECHO_SWING,
  HEART_SPLINTER,
  IRON_SKIN,
  BELLOWS,
  CRIMSON_FALL,
];
