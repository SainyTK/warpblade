import type { SkillDef } from "../../../../types/skill";
import { BREAKING_BASH } from "./breakingBash";
import { BULWARK_ARRIVAL } from "./bulwarkArrival";
import { CRESTFALL } from "./crestfall";
import { DAWN_FALCON } from "./dawnFalcon";
import { DAWN_LANCE } from "./dawnLance";
import { IRON_RETORT } from "./ironRetort";
import { IRON_VOW } from "./ironVow";
import { LINGERING_DAWN } from "./lingeringDawn";
import { MENDING_LIGHT } from "./mendingLight";
import { OATHBLADE } from "./oathblade";
import { OATHSWORN } from "./oathsworn";
import { PENANCE } from "./penance";
import { RALLYING_CRY } from "./rallyingCry";
import { RESOLVE } from "./resolve";
import { SANCTUARY } from "./sanctuary";
import { SHIELD_STEP } from "./shieldStep";
import { SKYFALL } from "./skyfall";
import { SUNBRAND } from "./sunbrand";
import { SUN_LION } from "./sunLion";
import { VERDICT } from "./verdict";

/** Aldric's 20 skills. Design: docs/skills/aldric.md */
export const ALDRIC_SKILL_DEFS: readonly SkillDef[] = [
  OATHBLADE,
  BREAKING_BASH,
  IRON_RETORT,
  VERDICT,
  CRESTFALL,
  SHIELD_STEP,
  BULWARK_ARRIVAL,
  SKYFALL,
  DAWN_LANCE,
  MENDING_LIGHT,
  RALLYING_CRY,
  SUNBRAND,
  PENANCE,
  LINGERING_DAWN,
  OATHSWORN,
  SUN_LION,
  DAWN_FALCON,
  RESOLVE,
  IRON_VOW,
  SANCTUARY,
];
