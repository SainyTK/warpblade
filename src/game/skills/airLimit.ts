import { AIR_STRING } from "../../constants/combo";
import { skillValues } from "./query";

/** air attacks the hero may make before landing: one, plus the rank of the air string skill (temporary, until Kael's
 *  skills are designed) */
export const airLimit = (): number => AIR_STRING.hits + (skillValues(AIR_STRING.skill).rank ?? 0);
