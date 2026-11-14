import type { SkillBehavior } from "../../../../types/skillBehavior";
import { SKILL } from "../../constants/skills/ids";
import { inkCrane } from "./inkCrane";
import { inkStain } from "./inkStain";
import { lingeringLine } from "./lingeringLine";
import { paperBlades } from "./paperBlades";
import { shade } from "./shade";
import { weepingCut } from "./weepingCut";

/** code of Saya's skills that act on their own or answer events, by skill id; the others reshape her kit where it
 *  reads them */
export const SAYA_SKILLS: Record<string, SkillBehavior> = {
  [SKILL.weep]: weepingCut,
  [SKILL.stain]: inkStain,
  [SKILL.trail]: lingeringLine,
  [SKILL.crane]: inkCrane,
  [SKILL.shade]: shade,
  [SKILL.paper]: paperBlades,
};
