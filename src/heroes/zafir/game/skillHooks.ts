import { movePayoff, payoffLands } from "../../../game/skills/payoff";
import { skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import type { OwnHit } from "../../../types/kit";
import { zafir } from "./state";
import { STRING_SPINS } from "./stringSkills";
import { woundsOf } from "./wounds";

/** a foe on the side he is not facing: the back of his spin */
export const behindHim = (e: Enemy): boolean => Math.sign(e.x - hero.x) === -hero.face;

/** wounds a cut opens on top of the base: Two-Faced Cut on the foe behind him */
export function zafirCutWounds(e: Enemy): number {
  return behindHim(e) ? (skillValues("za_twofaced").wounds ?? 0) : 0;
}

/** Sirocco Timing's bonus on a Keen spin: its own, and its streak */
function siroccoBonus(): number {
  const v = skillValues("za_sirocco");
  if (!v.keen) return 0;
  return v.keen + Math.min(v.streakCap ?? 0, zafir.keenStreak * (v.streak ?? 0));
}

/**
 * Extra damage one of Zafir's own hits deals from his skills, added together: a spin of the string (Whirling Edge), a
 * Keen spin on the foe it paid off on (Sirocco Timing), the cyclone per wound (Opened Veins), the foe behind him
 * (Two-Faced Cut), the descent (Falling Dune) and a bleeding foe (Deep Wounds).
 */
export function hitBonus(e: Enemy, hit: OwnHit): number {
  let bonus = 0;
  const move = hero.state === "move" ? hero.move : null;
  if (move && STRING_SPINS.has(move)) bonus += skillValues("za_whirling").bonus ?? 0;
  if (hit.keen && move && payoffLands(movePayoff(), e)) bonus += siroccoBonus();
  const veins = skillValues("za_veins");
  if (move === "duneCyclone" || (move === "twinTurn" && veins.twin)) bonus += woundsOf(e) * (veins.perWound ?? 0);
  if (hit.melee && behindHim(e))
    bonus += (skillValues("za_twofaced").behind ?? 0) + (skillValues("za_twofaced").backAll ?? 0);
  if (move === "spinDrop") bonus += skillValues("za_falling").air ?? 0;
  if (woundsOf(e)) bonus += skillValues("za_deep").blows ?? 0;
  return bonus;
}

/** extra damage a foe takes from every source: a bleeding foe, with Desert Thirst, more for each wound and more again
 *  when it is low */
export function takenBonus(e: Enemy): number {
  const n = woundsOf(e);
  const v = skillValues("za_thirst");
  if (!n || !v.taken) return 0;
  const low = e.hp < e.max / 3 ? (v.low ?? 0) : 0;
  return v.taken + n * (v.perWound ?? 0) + low;
}
