import { stacksOf } from "../../../game/enemies/skillStatus";
import { movePayoff, payoffLands } from "../../../game/skills/payoff";
import { skillEvolved, skillValues } from "../../../game/skills/query";
import type { Enemy } from "../../../types/enemy";
import type { OwnHit } from "../../../types/kit";
import { heftFull } from "./heft";
import { brynn } from "./state";

/** what a heavy swing adds on the foe it pays off on: Heavy Hands' bonus and its streak */
function heavyBonus(): number {
  const v = skillValues("br_heavy");
  if (!v.bonus) return 0;
  const streak = v.streak ? Math.min(v.streakCap, (brynn.heavyStreak - 1) * v.streak) : 0;
  return v.bonus + Math.max(0, streak);
}

/**
 * Extra damage one of Brynn's own hits deals from her skills, added together: a heavy swing on the foe it pays off on
 * (Heavy Hands, precise), a sword blow in the swings after a parry (Counter Cleave).
 */
export function hitBonus(e: Enemy, hit: OwnHit): number {
  let bonus = 0;
  if (hit.keen && payoffLands(movePayoff(), e)) bonus += heavyBonus();
  if (hit.melee && brynn.afterParry > 0) bonus += skillValues("br_counter").after ?? 0;
  return bonus;
}

/** extra damage a foe takes from every source: thrown up (Skyward Heave), holding embers (Searing Edge) */
export function takenBonus(e: Enemy): number {
  let bonus = e.air ? (skillValues("br_launch").airBonus ?? 0) : 0;
  if (stacksOf(e, "br_embers")) bonus += skillValues("br_embers").taken ?? 0;
  return bonus;
}

/** every hit she deals is multiplied by this: War Cry's buff while it lasts, Bellows at full Heft */
export function damageScale(): number {
  let scale = 1;
  if (brynn.cry > 0) scale += skillValues("br_cry").buff ?? 0;
  if (heftFull()) scale += skillValues("br_bellows").damage ?? 0;
  return scale;
}

/** her swings play faster at full Heft with Bellows */
export const attackRate = (): number => (heftFull() ? 1 + (skillValues("br_bellows").speed ?? 0) : 1);

/** War Cry's evolution: every swing is heavy while the cry lasts */
export const alwaysKeen = (): boolean => brynn.cry > 0 && skillEvolved("br_cry");
