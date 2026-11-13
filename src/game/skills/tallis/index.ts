import type { SkillBehavior } from "../../../types/skillBehavior";
import { caltropsSkill } from "./caltrops";
import { crowsSkill } from "./crows";
import { doubleSkill } from "./double";
import { markDuskSkill } from "./markDusk";
import { openVeinsSkill } from "./openVeins";
import { inkWoundSkill, nightshadeSkill } from "./spreads";
import { wraithSkill } from "./wraith";

/** the code of each of Tallis's skills that acts on its own or answers events, by skill id; the rest live in his kit */
export const TALLIS_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  t_crows: crowsSkill,
  t_double: doubleSkill,
  t_wraith: wraithSkill,
  t_openVeins: openVeinsSkill,
  t_nightshade: nightshadeSkill,
  t_inkWound: inkWoundSkill,
  t_markDusk: markDuskSkill,
  t_caltrops: caltropsSkill,
};
