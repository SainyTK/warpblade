import type { SkillBehavior } from "../../../types/skillBehavior";
import { dissonanceSkill } from "./dissonance";
import { drumCorpsSkill } from "./drumCorps";
import { echoSkill } from "./echoChamber";
import { encoreSkill } from "./encore";
import { gongSkill } from "./gong";
import { ironMetronomeSkill } from "./ironMetronome";
import { leapSkill } from "./leap";
import { marchSkill } from "./march";
import { resonanceSkill } from "./resonance";
import { ringingEarsSkill } from "./ringingEars";
import { stepTouchSkill } from "./stepTouch";
import { tuningSkill } from "./tuningFork";
import { warHornSkill } from "./warHorn";

/** the code of each of Jory's skills that acts on its own or answers events, by skill id; the rest live in his kit */
export const JORY_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  j_stepTouch: stepTouchSkill,
  j_march: marchSkill,
  j_leap: leapSkill,
  j_gong: gongSkill,
  j_tuning: tuningSkill,
  j_echo: echoSkill,
  j_resonance: resonanceSkill,
  j_eardrum: ringingEarsSkill,
  j_dissonance: dissonanceSkill,
  j_encore: encoreSkill,
  j_drumCorps: drumCorpsSkill,
  j_horn: warHornSkill,
  j_metronome: ironMetronomeSkill,
};
