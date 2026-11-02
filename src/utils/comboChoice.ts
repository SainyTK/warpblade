import type { MoveId, Situation } from "../types/move";

/** the ground string in order; the last hit a combo allows is always the smash */
export const GROUND_CHAIN: readonly MoveId[] = ["stepCut", "risingBackhand", "twinFang", "hopCleave", "crescentTurn"];
/** the air string in order; the last hit a combo allows, or the one after these, is the spike */
export const AIR_CHAIN: readonly MoveId[] = ["airCross", "airSomersault", "airDrill"];

function airMove(s: Situation): MoveId {
  if (s.down && s.perks.has("meteorDrop")) return "meteor";
  if (s.doubleJumped && !s.whirled && s.perks.has("whirlwind")) return "whirl";
  if (s.next === s.limit || s.airHits >= AIR_CHAIN.length) return "airSpike";
  return AIR_CHAIN[s.airHits];
}

/** what the foes around Kael ask for, when no held key asks for something else */
function situational(s: Situation): MoveId | null {
  if (s.foeAirborne) return "chaseCut";
  if (s.surrounded && s.previous !== "ringCut") return "ringCut";
  if (s.foeBehindOnly) return "turnCut";
  if (s.foeDown && !s.stabbed) return "downStab";
  return null;
}

/**
 * The move J starts now. Held keys and skills come first (they are the player asking for something),
 * then the situation, then the next hit of the plain string.
 */
export function chooseMove(s: Situation): MoveId {
  if (!s.ground && !s.hanging) return airMove(s);
  if (s.hanging) return AIR_CHAIN[0];
  if (s.dashing && s.perks.has("dashStrike")) return "dashStrike";
  if (s.running && s.perks.has("runThrust")) return "thrust";
  if (s.down && s.perks.has("sweep")) return "sweep";
  if (s.up && s.next > 1 && s.perks.has("launcher")) return "launcher";
  const last = s.next === s.limit;
  const branch = situational(s);
  if (branch === "chaseCut") return branch;
  if (last) return "smash";
  return branch ?? GROUND_CHAIN[Math.min(s.next, GROUND_CHAIN.length) - 1];
}
