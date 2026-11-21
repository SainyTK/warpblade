import { nativeOrDrill } from "../../../../drill";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { grace } from "./grace";
import { mirrorBlade } from "./mirrorBlade";
import { passingTouch } from "./passingTouch";
import { petalBlades } from "./petalBlades";
import { riposteChain } from "./riposteChain";
import { roseMarkSkill } from "./roseMark";
import { thornSentinel } from "./thornSentinel";
import { weepingMark } from "./weepingMark";
import { wiltingCurse } from "./wiltingCurse";

/** the code of Cerise's skills that answer events or act on their own, by skill id; the rest reshape her kit */
export const CERISE_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  ce_riposte: nativeOrDrill(riposteChain),
  ce_markwarp: nativeOrDrill(roseMarkSkill),
  ce_step: nativeOrDrill(passingTouch),
  ce_weep: weepingMark,
  ce_curse: wiltingCurse,
  ce_mirror: mirrorBlade,
  ce_petals: petalBlades,
  ce_sentinel: thornSentinel,
  ce_grace: nativeOrDrill(grace),
};
