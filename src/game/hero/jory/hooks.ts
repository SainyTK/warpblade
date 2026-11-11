import type { Enemy } from "../../../types/enemy";
import { registerDamageHooks } from "../../damageHooks";
import { stacksOf } from "../../enemies/skillStatus";
import { skillValues } from "../../skills/query";

/** Ringing Ears: a ringing foe takes more from every source once its level says so */
const takenBonus = (e: Enemy): number => (stacksOf(e, "j_eardrum") > 0 ? (skillValues("j_eardrum").taken ?? 0) : 0);

registerDamageHooks("jory", { hitBonus: () => 0, takenBonus });
