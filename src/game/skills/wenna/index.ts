import type { SkillBehavior } from "../../../types/skillBehavior";
import { bonfireSkill } from "./bonfire";
import { gutteringSkill } from "./guttering";
import { hotWaxSkill } from "./hotWax";
import { lampfliesSkill } from "./lampflies";
import { remembranceSkill } from "./remembrance";
import { singeSkill } from "./singe";
import { smoulderSkill } from "./smoulder";
import { twinWickSkill } from "./twinWick";

/** the code of each of Wenna's skills that acts on its own or answers events, by skill id; the rest live in her kit */
export const WENNA_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  w_singe: singeSkill,
  w_hotWax: hotWaxSkill,
  w_smoulder: smoulderSkill,
  w_gutter: gutteringSkill,
  w_ghost: remembranceSkill,
  w_lampflies: lampfliesSkill,
  w_twinWick: twinWickSkill,
  w_kindle: bonfireSkill,
};
