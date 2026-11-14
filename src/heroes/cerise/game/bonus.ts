import { stacksOf } from "../../../game/enemies/skillStatus";
import { movePayoff, payoffLands } from "../../../game/skills/payoff";
import { skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { OwnHit } from "../../../types/kit";
import { openBonus } from "./feint";
import { isMarked, markBonus } from "./mark";
import { cerise } from "./state";

/** what a Keen blow adds with Measured Touch, with its streak; only on the foe the Keen move paid off on */
function keenBonus(): number {
  const v = skillValues("ce_measure");
  if (!v.bonus) return 0;
  const streak = v.streak ? Math.min(v.streakCap, cerise.keenStreak * v.streak) : 0;
  return v.bonus + streak;
}

/**
 * Extra damage one of Cerise's own hits deals, added together: the Rose mark, a Keen blow (Measured Touch, a precise
 * payoff), a riposte link (Riposte Chain, and Mirror Guard's stance), a foe held by Pinning Point, a foe opened by Feint.
 */
export function hitBonus(e: Enemy, hit: OwnHit): number {
  let bonus = markBonus(e, hit.keen);
  if (hit.keen && hero.state === "move" && payoffLands(movePayoff(), e)) bonus += keenBonus();
  if (hero.state === "riposte") bonus += skillValues("ce_riposte").bonus ?? 0;
  if (hero.state === "riposte" && cerise.stance > 0) bonus += skillValues("ce_mirrorguard").bonus ?? 0;
  if (hit.melee && (e.halt > 0 || e.pinned > 0)) bonus += skillValues("ce_pin").held ?? 0;
  bonus += openBonus(e);
  return bonus;
}

/** extra damage a foe takes from every source: bleeding from Thorn Wounds, marked with Weeping Mark */
export function takenBonus(e: Enemy): number {
  let bonus = 0;
  if (stacksOf(e, "ce_thorns")) bonus += skillValues("ce_thorns").taken ?? 0;
  if (isMarked(e)) bonus += skillValues("ce_weep").taken ?? 0;
  return bonus;
}
