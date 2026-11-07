import { AIR_STRING } from "../../constants/combo";
import { skillValues } from "./query";

/** air attacks the hero may make before landing: Kael's two, plus Sky Dance's */
export const airLimit = (): number => AIR_STRING.hits + (skillValues(AIR_STRING.skill).air ?? 0);
