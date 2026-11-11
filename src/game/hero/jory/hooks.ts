import type { Enemy } from "../../../types/enemy";
import { type OwnHit, registerDamageHooks } from "../../damageHooks";
import { stacksOf } from "../../enemies/skillStatus";
import { skillValues } from "../../skills/query";

/** Tuning Fork: his blows on a tuned foe deal more, the more on-beat blows it has taken */
function hitBonus(e: Enemy, hit: OwnHit): number {
  if (!hit.melee) return 0;
  const tuned = stacksOf(e, "j_tuning");
  return tuned > 0 ? (skillValues("j_tuning").bonus ?? 0) : 0;
}

/** Ringing Ears: a ringing foe takes more from every source once its level says so */
const takenBonus = (e: Enemy): number => (stacksOf(e, "j_eardrum") > 0 ? (skillValues("j_eardrum").taken ?? 0) : 0);

registerDamageHooks("jory", { hitBonus, takenBonus });
