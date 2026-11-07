import type { SkillDef } from "../../../../types/skill";
import { ASHEN_WAKE_SKILL } from "./ashen";
import { EMBER_BRAND } from "./brand";
import { BRAZIER_SKILL } from "./brazier";
import { COUNTER } from "./counter";
import { FALLING_STAR } from "./dive";
import { SUN_HAWK } from "./hawk";
import { HEFT } from "./heft";
import { IMPALE } from "./impale";
import { KINDLING } from "./kindling";
import { OVERHEAT_SKILL } from "./overheat";
import { FLAME_PILLAR_SKILL } from "./pillar";
import { VOLCANIC_RIFT } from "./rift";
import { SALAMANDER } from "./salamander";
import { SEARING_EDGE } from "./searing";
import { GLAIVE_SHADE } from "./shade";
import { SKYHOOK } from "./skyhook";
import { SUNSPEAR } from "./sunspear";
import { VAULT_STRIKE } from "./vault";
import { WARPATH } from "./warpath";
import { WINDMILL } from "./windmill";

/** Ysra's 20 skills. Design: docs/skills/ysra.md */
export const YSRA_SKILLS: readonly SkillDef[] = [
  HEFT,
  IMPALE,
  WINDMILL,
  COUNTER,
  SKYHOOK,
  VAULT_STRIKE,
  FALLING_STAR,
  WARPATH,
  FLAME_PILLAR_SKILL,
  BRAZIER_SKILL,
  OVERHEAT_SKILL,
  SEARING_EDGE,
  ASHEN_WAKE_SKILL,
  EMBER_BRAND,
  GLAIVE_SHADE,
  SALAMANDER,
  SUN_HAWK,
  KINDLING,
  SUNSPEAR,
  VOLCANIC_RIFT,
];
