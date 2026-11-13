import type { SkillDef } from "../../../../types/skill";
import { HURLED_AXE } from "./axeThrow";
import { BLOOD_TRAIL } from "./bloodTrail";
import { BLOOD_WOLVES } from "./bloodWolves";
import { CARRION_RAVENS } from "./carrionRavens";
import { EXECUTIONER } from "./executioner";
import { FOREBEAR } from "./forebear";
import { BLOOD_GEYSER } from "./geyser";
import { HAEMORRHAGE } from "./haemorrhage";
import { HEADLONG } from "./headlong";
import { HEAVY_HEW } from "./heavyHew";
import { LONG_HUNT } from "./longHunt";
import { OPEN_WOUNDS } from "./openWounds";
import { BLOOD_PACT } from "./pact";
import { REAVER } from "./reaver";
import { RED_EDGE } from "./redEdge";
import { REND } from "./rend";
import { SCARRED_HIDE } from "./scarredHide";
import { SPINNING_REAP } from "./spinningReap";
import { SUNDER } from "./sunder";
import { UNENDING_RAGE } from "./unendingRage";

/** Brannoc's 20 skills, in the order the Codex lists them. Design: docs/skills/brannoc.md */
export const BRANNOC_SKILL_DEFS: readonly SkillDef[] = [
  RED_EDGE,
  HEAVY_HEW,
  REAVER,
  EXECUTIONER,
  SPINNING_REAP,
  SUNDER,
  LONG_HUNT,
  HEADLONG,
  BLOOD_TRAIL,
  BLOOD_GEYSER,
  HURLED_AXE,
  BLOOD_PACT,
  OPEN_WOUNDS,
  REND,
  HAEMORRHAGE,
  BLOOD_WOLVES,
  FOREBEAR,
  CARRION_RAVENS,
  SCARRED_HIDE,
  UNENDING_RAGE,
];
