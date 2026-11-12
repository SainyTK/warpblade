import type { SkillBehavior } from "../../../types/skillBehavior";
import { bloodTrailSkill } from "./bloodTrail";
import { bloodWolvesSkill } from "./bloodWolves";
import { carrionRavensSkill } from "./carrionRavens";
import { forebearSkill } from "./forebear";
import { geyserSkill } from "./geyser";
import { haemorrhageSkill } from "./haemorrhage";
import { hurledAxeSkill } from "./hurledAxe";
import { longHuntSkill } from "./longHunt";
import { openWoundsSkill } from "./openWounds";
import { pactSkill } from "./pact";
import { redEdgeSkill } from "./redEdge";

/** the code of each of Brannoc's skills that acts on its own or answers events, by skill id; the rest live in his kit */
export const BRANNOC_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  b_geyser: geyserSkill,
  b_axeThrow: hurledAxeSkill,
  b_pact: pactSkill,
  b_bleed: openWoundsSkill,
  b_hemorrhage: haemorrhageSkill,
  b_wolves: bloodWolvesSkill,
  b_ancestor: forebearSkill,
  b_ravens: carrionRavensSkill,
  b_bloodTrail: bloodTrailSkill,
  b_hunt: longHuntSkill,
  b_redEdge: redEdgeSkill,
};
