import { DAMAGE } from "../../../constants/combat";
import { stacksOf } from "../../../game/enemies/skillStatus";
import { movePayoff, payoffLands } from "../../../game/skills/payoff";
import { skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { OwnHit } from "../../../types/kit";
import { AIR_MOVES } from "./blades";
import { twinBuff } from "./skills/twinPhantom";
import { vesper } from "./state";

/** what a Keen blow adds: Twin Keen's bonus and its streak */
function keenBonus(): number {
  const v = skillValues("ve_keen");
  if (!v.bonus) return 0;
  return v.bonus + Math.min(v.streakCap ?? 0, vesper.keenStreak * (v.streak ?? 0));
}

/**
 * Extra damage one of her own hits deals, added together: an opened foe after a parry takes the back attack's share and
 * Turning Blade's (the blow counts as from behind); each Tempo stack on a string blow (Rising Edge); a Keen blow on the
 * foe the move pays off on (Twin Keen); an air blow (Sky Ribbon); and Mirror Dance's phantom.
 */
export function hitBonus(e: Enemy, hit: OwnHit): number {
  let bonus = twinBuff();
  if (vesper.opened > 0) bonus += (hit.back ? 0 : DAMAGE.back - 1) + (skillValues("ve_turn").openBonus ?? 0);
  if (hero.state === "move") bonus += vesper.tempo * (skillValues("ve_edge").perStack ?? 0);
  if (hit.keen && payoffLands(movePayoff(), e)) bonus += keenBonus();
  if (hero.state === "move" && hero.move && AIR_MOVES.has(hero.move)) {
    const sky = skillValues("ve_sky");
    bonus += (sky.airBonus ?? 0) + (hero.move === "nightfall" ? (sky.diveBonus ?? 0) : 0);
  }
  return bonus;
}

/** extra damage a foe takes from every source: five or more dusk sigils (Dusk Sigil), night while it is in the air
 *  (Falling Night) */
export function takenBonus(e: Enemy): number {
  let bonus = 0;
  const hex = skillValues("ve_hex");
  if (hex.taken && stacksOf(e, "ve_hex") >= 5) bonus += hex.taken;
  const night = skillValues("ve_night");
  if (night.airTaken && e.air && stacksOf(e, "ve_night") > 0) bonus += night.airTaken;
  return bonus;
}
