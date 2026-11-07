import type { SkillBehavior } from "../../../types/skillBehavior";
import { crystalFamiliar } from "./crystalFamiliar";

/** the code of each of Kael's skills that acts on its own or answers events, by skill id */
export const KAEL_SKILLS: Readonly<Record<string, SkillBehavior>> = { k_familiar: crystalFamiliar };
