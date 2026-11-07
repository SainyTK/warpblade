import type { Enemy } from "../../../types/enemy";
import type { MoveId } from "../../../types/move";
import type { OwnHit } from "../../damageHooks";
import { stacksOf } from "../../enemies/skillStatus";
import { movePayoff, payoffLands } from "../../skills/payoff";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { kael } from "./state";

/** the moves of the air string, whose hits Sky Dance strengthens */
const AIR_MOVES: ReadonlySet<MoveId> = new Set<MoveId>(["airWheel", "airScissor", "airStomp", "whirl", "meteor"]);

/** what a Keen blow adds: Keen Edge's bonus and its streak */
function keenBonus(): number {
  const v = skillValues("k_keen");
  if (!v.bonus) return 0;
  const streak = v.streak ? Math.min(v.streakCap, kael.keenStreak * v.streak) : 0;
  return v.bonus + streak;
}

/**
 * Extra damage one of Kael's own hits deals from his skills, added together: a Keen blow (Keen Edge, a precise payoff:
 * only on the foe the Keen move reached first), a back attack after a phase (Phase Cut), an air hit (Sky Dance), a sword
 * blow in Riposte (Mirror Knight).
 */
export function hitBonus(e: Enemy, hit: OwnHit): number {
  let bonus = 0;
  if (hit.keen && payoffLands(movePayoff(), e)) bonus += keenBonus();
  if (hit.back && kael.phaseBack > 0) bonus += skillValues("k_phase").back ?? 0;
  if (hero.move && AIR_MOVES.has(hero.move)) bonus += skillValues("k_skydance").airBonus ?? 0;
  if (hit.melee && hero.riposte > 0) bonus += (skillValues("k_mirror").riposte ?? 1) - 1;
  return bonus;
}

/**
 * Extra damage a foe takes from every source from Kael's skills, added together: airborne (Skybreaker), knocked down
 * (Reaping Sweep), frozen (Ice Spikes), shocked (Lightning), each rift layer (Rift Wound). `dealDamage` caps the sum.
 */
export function takenBonus(e: Enemy): number {
  let bonus = 0;
  if (e.air) bonus += skillValues("k_skyward").airBonus ?? 0;
  if (!e.air && e.stun > 0) bonus += skillValues("k_reap").trip ?? 0;
  if (e.frozen > 0) bonus += skillValues("k_frost").frozenBonus ?? 0;
  if (e.shock > 0) bonus += skillValues("k_volt").swordBonus ?? 0;
  const layers = stacksOf(e, "k_rift");
  if (layers) bonus += layers * (skillValues("k_rift").taken ?? 0);
  return bonus;
}
