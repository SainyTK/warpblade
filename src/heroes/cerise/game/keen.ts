import { KEEN } from "../../../constants/combo";
import { skillValues } from "../../../game/skills/query";

/** seconds after a blow lands that a J press is Keen: Measured Touch's window, or the shared one */
export const keenWindow = (): number => skillValues("ce_measure").window ?? KEEN.window;
