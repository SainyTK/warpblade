import type { SkillDef } from "../../../../types/skill";
import { EMBER_BRAND } from "./brand";
import { BRAZIER_SKILL } from "./brazier";
import { COUNTER } from "./counter";
import { FIREWALK } from "./firewalk";
import { SUN_HAWK } from "./hawk";
import { IMPALE } from "./impale";
import { EMBER_JAVELIN } from "./javelin";
import { KINDLING } from "./kindling";
import { OVERHEAT_SKILL } from "./overheat";
import { FLAME_PILLAR_SKILL } from "./pillar";
import { PYRE_WAVE } from "./pyre";
import { SUNREAP } from "./reap";
import { SALAMANDER } from "./salamander";
import { SEARING_EDGE } from "./searing";
import { GLAIVE_SHADE } from "./shade";
import { SKYHOOK } from "./skyhook";
import { SMOULDER } from "./smoulder";
import { HAFT_WARD } from "./ward";
import { WARPATH } from "./warpath";
import { WINDMILL } from "./windmill";

/** Ysra's 20 skills. Design: docs/skills/ysra.md */
export const YSRA_SKILLS: readonly SkillDef[] = [
  EMBER_JAVELIN,
  IMPALE,
  WINDMILL,
  COUNTER,
  SKYHOOK,
  SUNREAP,
  FIREWALK,
  WARPATH,
  FLAME_PILLAR_SKILL,
  BRAZIER_SKILL,
  OVERHEAT_SKILL,
  SEARING_EDGE,
  SMOULDER,
  EMBER_BRAND,
  GLAIVE_SHADE,
  SALAMANDER,
  SUN_HAWK,
  KINDLING,
  HAFT_WARD,
  PYRE_WAVE,
];
