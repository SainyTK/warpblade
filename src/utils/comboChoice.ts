import type { MoveId, Situation } from "../types/move";

/** the ground string in order; the last hit a combo allows is always the smash */
export const GROUND_CHAIN: readonly MoveId[] = ["stepCut", "risingBackhand", "twinFang", "hopCleave", "crescentTurn"];
/** the air string in order: a wheel, a scissor cut, then the stomp that takes Kael down to the floor */
export const AIR_CHAIN: readonly MoveId[] = ["airWheel", "airScissor", "airStomp"];

/** the next air hit, or null once the air string is spent until Kael lands */
function airMove(s: Situation): MoveId | null {
  if (s.airHits >= s.airLimit) return null;
  if (s.down && s.perks.has("meteorDrop")) return "meteor";
  if (s.doubleJumped && !s.whirled && s.perks.has("whirlwind")) return "whirl";
  return AIR_CHAIN[Math.min(s.airHits, AIR_CHAIN.length - 1)];
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
 * then the situation, then the next hit of the plain string. Null when the air string is spent.
 */
export function chooseMove(s: Situation): MoveId | null {
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
